import * as React from "react";
import { Chart, ChartCanvas } from "@react-financial-charts/core";
import { XAxis, YAxis } from "@react-financial-charts/axes";
import { discontinuousTimeScaleProviderBuilder } from "@react-financial-charts/scales";
import { CandlestickSeries } from "@react-financial-charts/series";
import { IOHLCData, withOHLCData } from "../../../data";
import { withDeviceRatio, withSize } from "@react-financial-charts/utils";
import { FreehandBrush } from "@react-financial-charts/interactive";
import { format } from "d3-format";

interface FreehandBrushInteractiveProps {
    readonly data: IOHLCData[];
    readonly height: number;
    readonly width: number;
    readonly ratio: number;
}

interface FreehandBrushInteractiveState {
    drawings: any[];
    mode: "draw" | "select";
    lineColor: string;
    lineWidth: number;
}

class FreehandBrushInteractive extends React.Component<FreehandBrushInteractiveProps, FreehandBrushInteractiveState> {
    private readonly margin = { left: 0, right: 48, top: 20, bottom: 30 };
    private readonly pricesDisplayFormat = format(".2f");
    private readonly xScaleProvider = discontinuousTimeScaleProviderBuilder().inputDateAccessor(
        (d: IOHLCData) => d.date,
    );

    constructor(props: FreehandBrushInteractiveProps) {
        super(props);
        this.state = {
            drawings: [],
            mode: "draw",
            lineColor: "#FF9800",
            lineWidth: 3,
        };
    }

    private handleDrawComplete = (e: any, newDrawings: any[]) => {
        const { lineColor, lineWidth } = this.state;
        const drawings = newDrawings.map((t: any) => ({
            ...t,
            selected: false,
            color: lineColor,
            lineWidth: lineWidth,
        }));
        this.setState({ drawings, mode: "select" });
    };

    private handleSelect = (e: any, newDrawings: any[]) => {
        if (this.state.mode !== "select") return;
        this.setState({ drawings: newDrawings });
    };

    private deleteSelected = () => {
        const { drawings } = this.state;
        const selectedIndex = drawings.findIndex((t: any) => t.selected);
        if (selectedIndex === -1) return;
        const newDrawings = drawings.filter((_: any, i: number) => i !== selectedIndex);
        if (newDrawings.length > 0) newDrawings[0].selected = true;
        this.setState({ drawings: newDrawings });
    };

    private deleteAll = () => {
        this.setState({ drawings: [] });
    };

    private setMode = (mode: "draw" | "select") => {
        const { drawings } = this.state;
        if (mode === "draw") {
            const newDrawings = drawings.map((t: any) => ({ ...t, selected: false }));
            this.setState({ mode, drawings: newDrawings });
        } else {
            this.setState({ mode });
        }
    };

    private handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newColor = e.target.value;
        const { drawings, mode } = this.state;

        this.setState({ lineColor: newColor });

        if (mode === "select") {
            const updatedDrawings = drawings.map((drawing: any) => {
                if (drawing.selected) {
                    return { ...drawing, color: newColor };
                }
                return drawing;
            });
            this.setState({ drawings: updatedDrawings });
        }
    };

    private handleLineWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newWidth = parseInt(e.target.value, 10);
        const { drawings, mode } = this.state;

        this.setState({ lineWidth: newWidth });

        if (mode === "select") {
            const updatedDrawings = drawings.map((drawing: any) => {
                if (drawing.selected) {
                    return { ...drawing, lineWidth: newWidth };
                }
                return drawing;
            });
            this.setState({ drawings: updatedDrawings });
        }
    };

    private getCurrentDisplayColor = () => {
        const { drawings, mode, lineColor } = this.state;
        if (mode === "select") {
            const selectedDrawing = drawings.find((d: any) => d.selected);
            if (selectedDrawing) {
                return selectedDrawing.color;
            }
        }
        return lineColor;
    };

    private getCurrentDisplayWidth = () => {
        const { drawings, mode, lineWidth } = this.state;
        if (mode === "select") {
            const selectedDrawing = drawings.find((d: any) => d.selected);
            if (selectedDrawing) {
                return selectedDrawing.lineWidth;
            }
        }
        return lineWidth;
    };

    public render() {
        const { data: initialData, height, ratio, width } = this.props;
        const { drawings, mode, lineColor, lineWidth } = this.state;

        const { data, xScale, xAccessor, displayXAccessor } = this.xScaleProvider(initialData);

        const startXAccessor = xAccessor(data[Math.max(0, data.length - 100)]);
        const endXAccessor = xAccessor(data[data.length - 1]);
        const xExtents = [startXAccessor, endXAccessor];

        const hasDrawings = drawings.length > 0;
        const hasSelected = drawings.some((t: any) => t.selected);
        const currentColor = this.getCurrentDisplayColor();
        const currentWidth = this.getCurrentDisplayWidth();

        const buttonStyle = (isActive: boolean) => ({
            padding: "0 20px",
            height: "32px",
            lineHeight: "32px",
            fontSize: "13px",
            fontWeight: isActive ? 600 : 400,
            border: "1px solid",
            borderColor: isActive ? "#1976d2" : "#ccc",
            backgroundColor: isActive ? "#1976d2" : "#fff",
            color: isActive ? "#fff" : "#333",
            borderRadius: "4px",
            cursor: "pointer",
            display: "inline-block",
            textAlign: "center" as const,
        });

        return (
            <div style={{ height: "100%", width: "100%", display: "flex", flexDirection: "column" }}>
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        padding: "8px 20px",
                        backgroundColor: "#f8f9fa",
                        borderBottom: "1px solid #dee2e6",
                        flexWrap: "wrap",
                    }}
                >
                    <button onClick={() => this.setMode("draw")} style={buttonStyle(mode === "draw")}>
                        <span style={{ marginRight: "8px" }}>✏️</span>Draw
                    </button>
                    <button onClick={() => this.setMode("select")} style={buttonStyle(mode === "select")}>
                        <span style={{ marginRight: "8px" }}>👆</span>Select
                    </button>

                    <div style={{ width: "1px", height: "20px", backgroundColor: "#dee2e6" }} />

                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <label style={{ fontSize: "12px", color: "#666" }}>
                            {mode === "select" && hasSelected
                                ? "🎨 Selected drawing color:"
                                : "🎨 Color for new drawings:"}
                        </label>
                        <input
                            type="color"
                            value={currentColor}
                            onChange={this.handleColorChange}
                            style={{
                                width: "32px",
                                height: "32px",
                                border: "1px solid #ccc",
                                borderRadius: "4px",
                                cursor: "pointer",
                                backgroundColor: "#fff",
                            }}
                        />
                        <span style={{ fontSize: "12px", color: "#666", marginLeft: "4px" }}>{currentColor}</span>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <label style={{ fontSize: "12px", color: "#666" }}>
                            {mode === "select" && hasSelected
                                ? "📏 Selected drawing width:"
                                : "📏 Width for new drawings:"}
                        </label>
                        <input
                            type="range"
                            min="1"
                            max="10"
                            value={currentWidth}
                            onChange={this.handleLineWidthChange}
                            style={{ width: "100px" }}
                        />
                        <input
                            type="number"
                            min="1"
                            max="10"
                            value={currentWidth}
                            onChange={this.handleLineWidthChange}
                            style={{
                                width: "50px",
                                padding: "4px 6px",
                                border: "1px solid #ccc",
                                borderRadius: "4px",
                                fontSize: "12px",
                            }}
                        />
                        <span style={{ fontSize: "12px", color: "#666" }}>px</span>
                    </div>

                    <div
                        style={{
                            width: "40px",
                            height: "32px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            border: "1px solid #dee2e6",
                            borderRadius: "4px",
                            backgroundColor: "#fff",
                        }}
                    >
                        <svg width="30" height="20">
                            <line
                                x1="2"
                                y1="10"
                                x2="28"
                                y2="10"
                                stroke={currentColor}
                                strokeWidth={currentWidth}
                                strokeLinecap="round"
                            />
                        </svg>
                    </div>

                    {mode === "select" && (
                        <>
                            <div style={{ width: "1px", height: "20px", backgroundColor: "#dee2e6" }} />
                            <button
                                onClick={this.deleteSelected}
                                disabled={!hasSelected}
                                style={{
                                    padding: "0 16px",
                                    height: "32px",
                                    lineHeight: "32px",
                                    fontSize: "13px",
                                    fontWeight: 500,
                                    border: "none",
                                    borderRadius: "4px",
                                    cursor: hasSelected ? "pointer" : "not-allowed",
                                    opacity: hasSelected ? 1 : 0.5,
                                    backgroundColor: "#fff",
                                    color: "#dc3545",
                                    border: "1px solid #dc3545",
                                    display: "inline-block",
                                    textAlign: "center" as const,
                                }}
                            >
                                <span style={{ marginRight: "8px" }}>🗑️</span>Delete Selected
                            </button>
                            <button
                                onClick={this.deleteAll}
                                disabled={!hasDrawings}
                                style={{
                                    padding: "0 16px",
                                    height: "32px",
                                    lineHeight: "32px",
                                    fontSize: "13px",
                                    fontWeight: 500,
                                    border: "none",
                                    borderRadius: "4px",
                                    cursor: hasDrawings ? "pointer" : "not-allowed",
                                    opacity: hasDrawings ? 1 : 0.5,
                                    backgroundColor: "#fff",
                                    color: "#dc3545",
                                    border: "1px solid #dc3545",
                                    display: "inline-block",
                                    textAlign: "center" as const,
                                }}
                            >
                                <span style={{ marginRight: "8px" }}>🗑️</span>Delete All
                            </button>
                        </>
                    )}

                    <div style={{ width: "1px", height: "20px", backgroundColor: "#dee2e6" }} />
                    <div
                        style={{
                            fontSize: "12px",
                            color: "#6c757d",
                            padding: "2px 10px",
                            backgroundColor: "#e9ecef",
                            borderRadius: "12px",
                            whiteSpace: "nowrap",
                        }}
                    >
                        {drawings.length} drawing{drawings.length !== 1 ? "s" : ""}
                        {hasSelected && ` (1 selected)`}
                    </div>
                </div>

                <div style={{ flex: 1, minHeight: 0 }}>
                    <ChartCanvas
                        height={height}
                        ratio={ratio}
                        width={width}
                        margin={this.margin}
                        data={data}
                        displayXAccessor={displayXAccessor}
                        seriesName="Data"
                        xScale={xScale}
                        xAccessor={xAccessor}
                        xExtents={xExtents}
                    >
                        <Chart id={1} yExtents={(d: IOHLCData) => [d.high, d.low]}>
                            <XAxis />
                            <YAxis tickFormat={this.pricesDisplayFormat} />
                            <CandlestickSeries />
                            <FreehandBrush
                                enabled={mode === "draw"}
                                drawings={drawings}
                                onComplete={this.handleDrawComplete}
                                onSelect={mode === "select" ? this.handleSelect : undefined}
                                color={lineColor}
                                lineWidth={lineWidth}
                                hoverText={{ enable: false }}
                            />
                        </Chart>
                    </ChartCanvas>
                </div>
            </div>
        );
    }
}

export default withOHLCData()(
    withSize({ style: { minHeight: 600, width: "100%" } })(withDeviceRatio()(FreehandBrushInteractive)),
);
