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

        if (!points || points.length < 2) {
            return;
        }

        ctx.beginPath();
        ctx.strokeStyle = color || "#FF9800";
        ctx.lineWidth = (selected ? (lineWidth || 2) + 1 : lineWidth) || 2;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";

        const firstPoint = points[0];
        ctx.moveTo(xScale(firstPoint.x), yScale(firstPoint.y));
        for (let i = 1; i < points.length; i++) {
            ctx.lineTo(xScale(points[i].x), yScale(points[i].y));
        }
        ctx.stroke();
    };

    private distanceToSegment(
        p: { x: number; y: number },
        a: { x: number; y: number },
        b: { x: number; y: number },
    ): number {
        const ax = b.x - a.x;
        const ay = b.y - a.y;
        const t = ((p.x - a.x) * ax + (p.y - a.y) * ay) / (ax * ax + ay * ay);

        if (t < 0) {
            return Math.hypot(p.x - a.x, p.y - a.y);
        }
        if (t > 1) {
            return Math.hypot(p.x - b.x, p.y - b.y);
        }

        const projX = a.x + t * ax;
        const projY = a.y + t * ay;
        return Math.hypot(p.x - projX, p.y - projY);
    }

    private readonly isHover = (moreProps: any) => {
        const { points, lineWidth } = this.props;
        const {
            mouseXY,
            xScale,
            chartConfig: { yScale },
        } = moreProps;

        if (!points || points.length < 2) {
            return false;
        }

        const [mouseX, mouseY] = mouseXY;
        const tolerance = (lineWidth || 2) + 4;

        for (let i = 0; i < points.length - 1; i++) {
            const a = {
                x: xScale(points[i].x),
                y: yScale(points[i].y),
            };
            const b = {
                x: xScale(points[i + 1].x),
                y: yScale(points[i + 1].y),
            };
            const mousePoint = { x: mouseX, y: mouseY };

            const distance = this.distanceToSegment(mousePoint, a, b);
            if (distance <= tolerance) {
                return true;
            }
        }

        return false;
    };
}
