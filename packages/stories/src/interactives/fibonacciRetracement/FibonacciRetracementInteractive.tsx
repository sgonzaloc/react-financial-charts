import * as React from "react";
import { Chart, ChartCanvas } from "@react-financial-charts/core";
import { XAxis, YAxis } from "@react-financial-charts/axes";
import { discontinuousTimeScaleProviderBuilder } from "@react-financial-charts/scales";
import { CandlestickSeries } from "@react-financial-charts/series";
import { IOHLCData, withOHLCData } from "../../data";
import { withDeviceRatio, withSize } from "@react-financial-charts/utils";
import { FibonacciRetracement } from "@react-financial-charts/interactive";
import { format } from "d3-format";

interface FibonacciRetracementInteractiveProps {
    readonly data: IOHLCData[];
    readonly height: number;
    readonly width: number;
    readonly ratio: number;
}

interface FibonacciRetracementInteractiveState {
    retracements: any[];
    mode: "draw" | "select";
}

class FibonacciRetracementInteractive extends React.Component<
    FibonacciRetracementInteractiveProps,
    FibonacciRetracementInteractiveState
> {
    private readonly margin = { left: 0, right: 48, top: 20, bottom: 30 };
    private readonly pricesDisplayFormat = format(".2f");
    private readonly xScaleProvider = discontinuousTimeScaleProviderBuilder().inputDateAccessor(
        (d: IOHLCData) => d.date,
    );

    constructor(props: FibonacciRetracementInteractiveProps) {
        super(props);
        this.state = {
            retracements: [],
            mode: "draw",
        };
    }

    private handleDrawComplete = (e: any, newRetracements: any[]) => {
        const retracements = newRetracements.map((t: any) => ({ ...t, selected: false }));
        this.setState({ retracements, mode: "select" });
    };

    private handleSelect = (e: any, newRetracements: any[]) => {
        console.log("handleSelect");
        if (this.state.mode !== "select") return;
        this.setState({ retracements: newRetracements });
    };

    private deleteSelected = () => {
        const { retracements } = this.state;
        const selectedIndex = retracements.findIndex((t: any) => t.selected);
        if (selectedIndex === -1) return;

        const newRetracements = retracements.filter((_: any, i: number) => i !== selectedIndex);
        if (newRetracements.length > 0) {
            newRetracements[0].selected = true;
        }
        this.setState({ retracements: newRetracements });
    };

    private deleteAll = () => {
        this.setState({ retracements: [] });
    };

    private setMode = (mode: "draw" | "select") => {
        const { retracements } = this.state;
        if (mode === "draw") {
            const newRetracements = retracements.map((t: any) => ({ ...t, selected: false }));
            this.setState({ mode, retracements: newRetracements });
        } else {
            this.setState({ mode });
        }
    };

    public render() {
        const { data: initialData, height, ratio, width } = this.props;
        const { retracements, mode } = this.state;

        const { data, xScale, xAccessor, displayXAccessor } = this.xScaleProvider(initialData);

        const startXAccessor = xAccessor(data[Math.max(0, data.length - 100)]);
        const endXAccessor = xAccessor(data[data.length - 1]);
        const xExtents = [startXAccessor, endXAccessor];

        const hasRetracements = retracements.length > 0;
        const hasSelected = retracements.some((t: any) => t.selected);

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
                    }}
                >
                    <button onClick={() => this.setMode("draw")} style={buttonStyle(mode === "draw")}>
                        <span style={{ marginRight: "8px" }}>✏️</span>Draw
                    </button>
                    <button onClick={() => this.setMode("select")} style={buttonStyle(mode === "select")}>
                        <span style={{ marginRight: "8px" }}>👆</span>Select
                    </button>

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
                                disabled={!hasRetracements}
                                style={{
                                    padding: "0 16px",
                                    height: "32px",
                                    lineHeight: "32px",
                                    fontSize: "13px",
                                    fontWeight: 500,
                                    border: "none",
                                    borderRadius: "4px",
                                    cursor: hasRetracements ? "pointer" : "not-allowed",
                                    opacity: hasRetracements ? 1 : 0.5,
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
                        {retracements.length} retracement{retracements.length !== 1 ? "s" : ""}
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
                            <FibonacciRetracement
                                enabled={mode === "draw"}
                                retracements={retracements}
                                onComplete={this.handleDrawComplete}
                                onSelect={mode === "select" ? this.handleSelect : undefined}
                            />
                        </Chart>
                    </ChartCanvas>
                </div>
            </div>
        );
    }
}

export default withOHLCData()(
    withSize({ style: { minHeight: 600, width: "100%" } })(withDeviceRatio()(FibonacciRetracementInteractive)),
);
