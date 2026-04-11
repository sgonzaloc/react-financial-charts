import * as React from "react";
import {
    getStrokeDasharrayCanvas,
    getMouseCanvas,
    GenericChartComponent,
    strokeDashTypes,
} from "@react-financial-charts/core";

export interface MarqueeZoomProps {
    readonly enabled: boolean;
    readonly onZoom?: (xExtents: [number, number], yExtents: [number, number]) => void;
    readonly strokeStyle?: string;
    readonly fillStyle?: string;
    readonly strokeDashArray?: strokeDashTypes;
}

interface MarqueeZoomState {
    end?: any;
    rect: any | null;
    start?: any;
    x1y1?: any;
}

export class MarqueeZoom extends React.Component<MarqueeZoomProps, MarqueeZoomState> {
    public static defaultProps = {
        strokeStyle: "#000000",
        fillStyle: "rgba(0, 120, 200, 0.2)",
        strokeDashArray: "ShortDash",
    };

    private zoomHappening?: boolean;

    public constructor(props: MarqueeZoomProps) {
        super(props);
        this.terminate = this.terminate.bind(this);
        this.state = {
            rect: null,
        };
    }

    public terminate() {
        this.zoomHappening = false;
        this.setState({
            x1y1: null,
            start: null,
            end: null,
            rect: null,
        });
    }

    public render() {
        const { enabled } = this.props;
        if (!enabled) {
            return null;
        }

        return (
            <GenericChartComponent
                disablePan={enabled}
                canvasToDraw={getMouseCanvas}
                canvasDraw={this.drawOnCanvas}
                onMouseDown={this.handleZoomStart}
                onMouseMove={this.handleDrawSquare}
                onClick={this.handleZoomComplete}
                drawOn={["mousemove", "pan", "drag"]}
            />
        );
    }

    private readonly drawOnCanvas = (ctx: CanvasRenderingContext2D) => {
        const { rect } = this.state;
        if (rect === null) {
            return;
        }

        const { x, y, height, width } = rect;
        const { strokeStyle, fillStyle, strokeDashArray } = this.props;

        const dashArray = getStrokeDasharrayCanvas(strokeDashArray);

        ctx.strokeStyle = strokeStyle || "#000000";
        ctx.fillStyle = fillStyle || "rgba(0, 120, 200, 0.2)";
        ctx.setLineDash(dashArray);
        ctx.beginPath();
        ctx.fillRect(x, y, width, height);
        ctx.strokeRect(x, y, width, height);
    };

    private readonly handleZoomStart = (_: React.MouseEvent, moreProps: any) => {
        this.zoomHappening = false;
        const {
            mouseXY: [, mouseY],
            currentItem,
            chartConfig: { yScale },
            xAccessor,
            xScale,
        } = moreProps;

        const x1y1 = [xScale(xAccessor(currentItem)), mouseY];

        this.setState({
            x1y1,
            start: {
                item: currentItem,
                xValue: xAccessor(currentItem),
                yValue: yScale.invert(mouseY),
            },
        });
    };

    private readonly handleDrawSquare = (_: React.MouseEvent, moreProps: any) => {
        if (this.state.x1y1 == null) {
            return;
        }

        this.zoomHappening = true;

        const {
            mouseXY: [, mouseY],
            currentItem,
            chartConfig: { yScale },
            xAccessor,
            xScale,
        } = moreProps;

        const [x2, y2] = [xScale(xAccessor(currentItem)), mouseY];

        const {
            x1y1: [x1, y1],
        } = this.state;

        const x = Math.min(x1, x2);
        const y = Math.min(y1, y2);
        const height = Math.abs(y2 - y1);
        const width = Math.abs(x2 - x1);

        this.setState({
            end: {
                item: currentItem,
                xValue: xAccessor(currentItem),
                yValue: yScale.invert(mouseY),
            },
            rect: {
                x,
                y,
                height,
                width,
            },
        });
    };

    private readonly handleZoomComplete = (_: React.MouseEvent, moreProps: any) => {
        if (this.zoomHappening) {
            const { start, end } = this.state;
            const { onZoom } = this.props;

            if (onZoom && start && end) {
                const xExtents: [number, number] = [start.xValue, end.xValue].sort((a, b) => a - b) as [number, number];
                const yExtents: [number, number] = [start.yValue, end.yValue].sort((a, b) => a - b) as [number, number];
                onZoom(xExtents, yExtents);
            }
        }

        this.setState({
            rect: null,
            start: null,
            end: null,
            x1y1: null,
        });
    };
}
