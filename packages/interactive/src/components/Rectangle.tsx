import * as React from "react";
import { getMouseCanvas, GenericChartComponent } from "@react-financial-charts/core";

export interface RectangleProps {
    readonly startXY: number[];
    readonly endXY: number[];
    readonly interactiveCursorClass?: string;
    readonly strokeStyle: string;
    readonly strokeWidth: number;
    readonly fillStyle: string;
    readonly onDragStart?: (e: React.MouseEvent, moreProps: any) => void;
    readonly onDrag?: (e: React.MouseEvent, moreProps: any) => void;
    readonly onDragComplete?: (e: React.MouseEvent, moreProps: any) => void;
    readonly onHover?: (e: React.MouseEvent, moreProps: any) => void;
    readonly onUnHover?: (e: React.MouseEvent, moreProps: any) => void;
    readonly selected: boolean;
    readonly tolerance?: number;
}

export class Rectangle extends React.Component<RectangleProps> {
    public static defaultProps = {
        strokeWidth: 1,
        tolerance: 4,
        selected: false,
    };

    public shouldComponentUpdate(nextProps: RectangleProps) {
        return (
            this.props.selected !== nextProps.selected ||
            this.props.startXY !== nextProps.startXY ||
            this.props.endXY !== nextProps.endXY
        );
    }

    public render() {
        const { selected, interactiveCursorClass, onDragStart, onDrag, onDragComplete, onHover, onUnHover } =
            this.props;

        return (
            <GenericChartComponent
                isHover={this.isHover}
                canvasToDraw={getMouseCanvas}
                canvasDraw={this.drawOnCanvas}
                interactiveCursorClass={interactiveCursorClass}
                selected={selected}
                enableDragOnHover={true}
                onDragStart={onDragStart}
                onDrag={onDrag}
                onDragComplete={onDragComplete}
                onHover={onHover}
                onUnHover={onUnHover}
                drawOn={["mousemove", "mouseleave", "pan", "drag"]}
            />
        );
    }

    private readonly drawOnCanvas = (ctx: CanvasRenderingContext2D, moreProps: any) => {
        const { strokeStyle, strokeWidth, fillStyle, startXY, endXY } = this.props;
        const {
            xScale,
            chartConfig: { yScale },
        } = moreProps;

        if (!startXY || !endXY) {
            return;
        }

        const x1 = xScale(startXY[0]);
        const y1 = yScale(startXY[1]);
        const x2 = xScale(endXY[0]);
        const y2 = yScale(endXY[1]);

        ctx.beginPath();
        ctx.rect(x1, y1, x2 - x1, y2 - y1);
        ctx.fillStyle = fillStyle;
        ctx.fill();
        if (strokeWidth > 0) {
            ctx.strokeStyle = strokeStyle;
            ctx.lineWidth = strokeWidth;
            ctx.stroke();
        }
    };

    private readonly isHover = (moreProps: any) => {
        const { tolerance = 4, startXY, endXY } = this.props;
        const {
            mouseXY,
            xScale,
            chartConfig: { yScale },
        } = moreProps;

        if (!startXY || !endXY) {
            return false;
        }

        const [mouseX, mouseY] = mouseXY;
        const x1 = xScale(startXY[0]);
        const y1 = yScale(startXY[1]);
        const x2 = xScale(endXY[0]);
        const y2 = yScale(endXY[1]);

        const left = Math.min(x1, x2);
        const right = Math.max(x1, x2);
        const top = Math.min(y1, y2);
        const bottom = Math.max(y1, y2);

        return (
            mouseX >= left - tolerance &&
            mouseX <= right + tolerance &&
            mouseY >= top - tolerance &&
            mouseY <= bottom + tolerance
        );
    };
}
