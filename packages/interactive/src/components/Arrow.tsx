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
    readonly onDragStart?: (e: React.MouseEvent, moreProps: any) => void;
    readonly onDrag?: (e: React.MouseEvent, moreProps: any) => void;
    readonly onDragComplete?: (e: React.MouseEvent, moreProps: any) => void;
    readonly selected?: boolean;
    readonly tolerance?: number;
}

export class Arrow extends React.Component<ArrowProps> {
    public static defaultProps = {
        color: "#1E53E5",
        lineWidth: 2,
        dashArray: [],
        selected: false,
        tolerance: 4,
    };

    public render() {
        const { selected, onDragStart, onDrag, onDragComplete } = this.props;

        return (
            <GenericChartComponent
                isHover={this.isHover}
                canvasToDraw={getMouseCanvas}
                canvasDraw={this.drawOnCanvas}
                selected={selected}
                enableDragOnHover={true}
                onDragStart={onDragStart}
                onDrag={onDrag}
                onDragComplete={onDragComplete}
                drawOn={["mousemove", "mouseleave", "pan", "drag"]}
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

    private readonly isHover = (moreProps: any) => {
        const { tolerance = 4, x1, y1, x2, y2 } = this.props;
        const {
            mouseXY,
            xScale,
            chartConfig: { yScale },
        } = moreProps;

        const startX = xScale(x1);
        const startY = yScale(y1);
        const endX = xScale(x2);
        const endY = yScale(y2);

        const [mouseX, mouseY] = mouseXY;

        // Calcular bounding box de la flecha
        const left = Math.min(startX, endX);
        const right = Math.max(startX, endX);
        const top = Math.min(startY, endY);
        const bottom = Math.max(startY, endY);

        return (
            mouseX >= left - tolerance &&
            mouseX <= right + tolerance &&
            mouseY >= top - tolerance &&
            mouseY <= bottom + tolerance
        );
    };
}
