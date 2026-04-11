import * as React from "react";
import { Chart, ChartCanvas } from "@react-financial-charts/core";
import { XAxis, YAxis } from "@react-financial-charts/axes";
import { discontinuousTimeScaleProviderBuilder } from "@react-financial-charts/scales";
import { CandlestickSeries } from "@react-financial-charts/series";
import { IOHLCData, withOHLCData } from "../../../data";
import { withDeviceRatio, withSize } from "@react-financial-charts/utils";
import { InteractiveText } from "@react-financial-charts/interactive";
import { format } from "d3-format";

interface TextInteractiveProps {
    readonly data: IOHLCData[];
    readonly height: number;
    readonly width: number;
    readonly ratio: number;
}

interface TextInteractiveState {
    textList: any[];
    mode: "draw" | "select";
}

class TextInteractive extends React.Component<TextInteractiveProps, TextInteractiveState> {
    private readonly margin = { left: 0, right: 48, top: 20, bottom: 30 };
    private readonly pricesDisplayFormat = format(".2f");
    private readonly xScaleProvider = discontinuousTimeScaleProviderBuilder().inputDateAccessor(
        (d: IOHLCData) => d.date,
    );

    constructor(props: TextInteractiveProps) {
        super(props);
        this.state = {
            textList: [],
            mode: "draw",
        };
    }

    private handleChoosePosition = (e: any, newText: any, moreProps: any) => {
        console.log("handleChoosePosition", newText);
        const newTextList = [
            ...this.state.textList,
            {
                ...newText,
                selected: true,
            },
        ];
        this.setState({ textList: newTextList, mode: "select" });
    };

    private handleDragComplete = (e: any, newTextList: any[], moreProps: any) => {
        console.log("handleDragComplete", newTextList);
        this.setState({ textList: newTextList });
    };

    private handleSelect = (e: any, newTextList: any[]) => {
        console.log("handleSelect", newTextList);
        if (this.state.mode !== "select") return;
        this.setState({ textList: newTextList });
    };

    private deleteSelected = () => {
        const { textList } = this.state;
        const selectedIndex = textList.findIndex((t: any) => t.selected);
        if (selectedIndex === -1) return;
        const newTextList = textList.filter((_: any, i: number) => i !== selectedIndex);
        if (newTextList.length > 0) newTextList[0].selected = true;
        this.setState({ textList: newTextList });
    };

    private deleteAll = () => {
        this.setState({ textList: [] });
    };

    private setMode = (mode: "draw" | "select") => {
        const { textList } = this.state;
        if (mode === "draw") {
            const newTextList = textList.map((t: any) => ({ ...t, selected: false }));
            this.setState({ mode, textList: newTextList });
        } else {
            this.setState({ mode });
        }
    };

    public render() {
        const { data: initialData, height, ratio, width } = this.props;
        const { textList, mode } = this.state;

        const { data, xScale, xAccessor, displayXAccessor } = this.xScaleProvider(initialData);

        const startXAccessor = xAccessor(data[Math.max(0, data.length - 100)]);
        const endXAccessor = xAccessor(data[data.length - 1]);
        const xExtents = [startXAccessor, endXAccessor];

        const hasTexts = textList.length > 0;
        const hasSelected = textList.some((t: any) => t.selected);

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
                                disabled={!hasTexts}
                                style={{
                                    padding: "0 16px",
                                    height: "32px",
                                    lineHeight: "32px",
                                    fontSize: "13px",
                                    fontWeight: 500,
                                    border: "none",
                                    borderRadius: "4px",
                                    cursor: hasTexts ? "pointer" : "not-allowed",
                                    opacity: hasTexts ? 1 : 0.5,
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
                        {textList.length} text{textList.length !== 1 ? "s" : ""}
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
                            <InteractiveText
                                enabled={mode === "draw"}
                                textList={textList}
                                onChoosePosition={this.handleChoosePosition}
                                onDragComplete={this.handleDragComplete}
                                onSelect={mode === "select" ? this.handleSelect : undefined}
                                defaultText={{
                                    bgFill: "#D3D3D3",
                                    bgOpacity: 1,
                                    bgStrokeWidth: 1,
                                    textFill: "#000000",
                                    fontFamily: "sans-serif",
                                    fontSize: 14,
                                    fontStyle: "normal",
                                    fontWeight: "normal",
                                    text: "Text",
                                }}
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
    withSize({ style: { minHeight: 600, width: "100%" } })(withDeviceRatio()(TextInteractive)),
);
