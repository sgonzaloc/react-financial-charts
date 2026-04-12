import * as React from "react";
import { getMouseCanvas, GenericChartComponent } from "@react-financial-charts/core";

export interface FreehandBrushProps {
    readonly points: { x: number; y: number }[];
    readonly color?: string;
    readonly lineWidth?: number;
    readonly selected?: boolean;
    readonly onDragStart?: (e: React.MouseEvent, moreProps: any) => void;
    readonly onDrag?: (e: React.MouseEvent, moreProps: any) => void;
    readonly onDragComplete?: (e: React.MouseEvent, moreProps: any) => void;
}

export class FreehandBrush extends React.Component<FreehandBrushProps> {
    public static defaultProps = {
        color: "#FF9800",
        lineWidth: 2,
        selected: false,
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
        const { points, color, lineWidth, selected } = this.props;
        const {
            xScale,
            chartConfig: { yScale },
        } = moreProps;

        if (!points || points.length < 2) return;

        ctx.beginPath();
        ctx.strokeStyle = color || "#FF9800";
        ctx.lineWidth = (selected ? (lineWidth || 2) + 1 : lineWidth) || 2;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";

        ctx.moveTo(xScale(points[0].x), yScale(points[0].y));
        for (let i = 1; i < points.length; i++) {
            ctx.lineTo(xScale(points[i].x), yScale(points[i].y));
        }
        ctx.stroke();
    };

    private readonly isHover = (moreProps: any) => {
        const { points } = this.props;
        const {
            mouseXY,
            xScale,
            chartConfig: { yScale },
        } = moreProps;
        const [mouseX, mouseY] = mouseXY;
        const tolerance = 4;

        if (!points || points.length < 2) return false;

        let minX = Infinity,
            maxX = -Infinity,
            minY = Infinity,
            maxY = -Infinity;

        for (const point of points) {
            const x = xScale(point.x);
            const y = yScale(point.y);
            minX = Math.min(minX, x);
            maxX = Math.max(maxX, x);
            minY = Math.min(minY, y);
            maxY = Math.max(maxY, y);
        }

        return (
            mouseX >= minX - tolerance &&
            mouseX <= maxX + tolerance &&
            mouseY >= minY - tolerance &&
            mouseY <= maxY + tolerance
        );
    };
}
