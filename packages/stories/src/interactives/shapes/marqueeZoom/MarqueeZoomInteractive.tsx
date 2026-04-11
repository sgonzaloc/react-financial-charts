import * as React from "react";
import { Chart, ChartCanvas } from "@react-financial-charts/core";
import { XAxis, YAxis } from "@react-financial-charts/axes";
import { discontinuousTimeScaleProviderBuilder } from "@react-financial-charts/scales";
import { CandlestickSeries } from "@react-financial-charts/series";
import { IOHLCData, withOHLCData } from "../../../data";
import { withDeviceRatio, withSize } from "@react-financial-charts/utils";
import { MarqueeZoom } from "@react-financial-charts/interactive";
import { format } from "d3-format";

interface MarqueeZoomInteractiveProps {
    readonly data: IOHLCData[];
    readonly height: number;
    readonly width: number;
    readonly ratio: number;
}

interface MarqueeZoomInteractiveState {
    enabled: boolean;
    xExtents: [number, number];
    zoomInfo: string;
}

class MarqueeZoomInteractive extends React.Component<MarqueeZoomInteractiveProps, MarqueeZoomInteractiveState> {
    private readonly margin = { left: 0, right: 48, top: 20, bottom: 30 };
    private readonly pricesDisplayFormat = format(".2f");
    private readonly xScaleProvider = discontinuousTimeScaleProviderBuilder().inputDateAccessor(
        (d: IOHLCData) => d.date,
    );

    constructor(props: MarqueeZoomInteractiveProps) {
        super(props);
        const { data, xAccessor } = this.xScaleProvider(props.data);
        this.state = {
            enabled: true,
            xExtents: [xAccessor(data[0]), xAccessor(data[data.length - 1])],
            zoomInfo: "No zoom applied",
        };
    }

    private handleZoom = (xExtents: [number, number], yExtents: [number, number]) => {
        const { data } = this.xScaleProvider(this.props.data);
        const startDate = data[Math.floor(xExtents[0])]?.date;
        const endDate = data[Math.floor(xExtents[1])]?.date;

        this.setState({
            xExtents,
            zoomInfo:
                startDate && endDate
                    ? `Zoom: ${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`
                    : `Zoom: ${xExtents[0].toFixed(0)} - ${xExtents[1].toFixed(0)}`,
        });
    };

    private toggleBrush = () => {
        this.setState((prev) => ({ enabled: !prev.enabled }));
    };

    private resetZoom = () => {
        const { data, xAccessor } = this.xScaleProvider(this.props.data);
        this.setState({
            xExtents: [xAccessor(data[0]), xAccessor(data[data.length - 1])],
            zoomInfo: "Reset to full view",
        });
    };

    public render() {
        const { data: initialData, height, ratio, width } = this.props;
        const { enabled, xExtents, zoomInfo } = this.state;

        const { data, xScale, xAccessor, displayXAccessor } = this.xScaleProvider(initialData);

        const buttonStyle = (bgColor: string) => ({
            padding: "8px 16px",
            margin: "8px",
            fontSize: "14px",
            fontWeight: 500,
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            backgroundColor: bgColor,
            color: "white",
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
                    <button onClick={this.toggleBrush} style={buttonStyle(enabled ? "#dc3545" : "#28a745")}>
                        {enabled ? "Disable Zoom" : "Enable Zoom"}
                    </button>
                    <button onClick={this.resetZoom} style={buttonStyle("#6c757d")}>
                        Reset Zoom
                    </button>
                    <div
                        style={{
                            fontSize: "12px",
                            color: "#6c757d",
                            padding: "2px 10px",
                            backgroundColor: "#e9ecef",
                            borderRadius: "12px",
                        }}
                    >
                        {zoomInfo}
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
                            <MarqueeZoom
                                enabled={enabled}
                                onZoom={this.handleZoom}
                                fillStyle="rgba(0, 120, 200, 0.2)"
                                strokeStyle="#0078C8"
                            />
                        </Chart>
                    </ChartCanvas>
                </div>
            </div>
        );
    }
}

export default withOHLCData()(
    withSize({ style: { minHeight: 600, width: "100%" } })(withDeviceRatio()(MarqueeZoomInteractive)),
);
