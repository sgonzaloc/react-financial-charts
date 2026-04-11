import * as React from "react";
import { getMouseCanvas, GenericChartComponent } from "@react-financial-charts/core";

export interface ArrowProps {
    readonly x1: number;
    readonly y1: number;
    readonly x2: number;
    readonly y2: number;
    readonly color?: string;
    readonly lineWidth?: number;
    readonly dashArray?: number[];
}

export class Arrow extends React.Component<ArrowProps> {
    public static defaultProps = {
        color: "#1E53E5",
        lineWidth: 2,
        dashArray: [],
    };

    public render() {
        return (
            <GenericChartComponent
                canvasDraw={this.drawOnCanvas}
                canvasToDraw={getMouseCanvas}
                drawOn={["mousemove", "pan", "drag"]}
            />
        );
    }

    private readonly drawOnCanvas = (ctx: CanvasRenderingContext2D, moreProps: any) => {
        const {
            x1,
            y1,
            x2,
            y2,
            color = Arrow.defaultProps.color,
            lineWidth = Arrow.defaultProps.lineWidth,
            dashArray = Arrow.defaultProps.dashArray,
        } = this.props;
        const {
            xScale,
            chartConfig: { yScale },
        } = moreProps;

        const startX = xScale(x1);
        const startY = yScale(y1);
        const endX = xScale(x2);
        const endY = yScale(y2);

        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.strokeStyle = color;
        ctx.lineWidth = lineWidth;
        if (dashArray && dashArray.length > 0) {
            ctx.setLineDash(dashArray);
        }
        ctx.stroke();
        ctx.setLineDash([]);

        const dx = endX - startX;
        const dy = endY - startY;
        const length = Math.sqrt(dx * dx + dy * dy);

        if (length > 10) {
            const angle = Math.atan2(dy, dx);
            const arrowSize = 8;
            ctx.beginPath();
            ctx.moveTo(endX, endY);
            ctx.lineTo(
                endX - arrowSize * Math.cos(angle - Math.PI / 6),
                endY - arrowSize * Math.sin(angle - Math.PI / 6),
            );
            ctx.lineTo(
                endX - arrowSize * Math.cos(angle + Math.PI / 6),
                endY - arrowSize * Math.sin(angle + Math.PI / 6),
            );
            ctx.fillStyle = color;
            ctx.fill();
        }
    };
}
