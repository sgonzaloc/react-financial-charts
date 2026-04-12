import * as React from "react";
import { noop } from "@react-financial-charts/core";
import { saveNodeType } from "../utils";
import { HoverTextNearMouse, ClickableCircle } from "../components";
import { FreehandBrush } from "../components/FreehandBrush";

export interface EachFreehandBrushProps {
    readonly points: { x: number; y: number }[];
    readonly selected: boolean;
    readonly color?: string;
    readonly lineWidth?: number;
    readonly index?: number;
    readonly onDrag?: (e: React.MouseEvent, index: number | undefined, points: { x: number; y: number }[]) => void;
    readonly onDragComplete?: (e: React.MouseEvent, moreProps: any) => void;
    readonly onSelect?: (e: React.MouseEvent, index: number | undefined, moreProps: any) => void;
    readonly hoverText: any;
}

interface EachFreehandBrushState {
    hover: boolean;
}

export class EachFreehandBrush extends React.Component<EachFreehandBrushProps, EachFreehandBrushState> {
    public static defaultProps = {
        selected: false,
        onDrag: noop,
        onSelect: noop,
        hoverText: { enable: false },
        color: "#FF9800",
        lineWidth: 2,
    };

    private dragStart: any;
    private saveNodeType: any;

    constructor(props: EachFreehandBrushProps) {
        super(props);
        this.saveNodeType = saveNodeType.bind(this);
        this.state = { hover: false };
    }

    public render() {
        const {
            points,
            selected,
            color = "#FF9800",
            lineWidth = 2,
            hoverText,
            onDragComplete,
            index,
            onSelect,
        } = this.props;
        const { hover } = this.state;
        const { enable: hoverTextEnabled, ...restHoverTextProps } = hoverText;

        const handleDragStart = (e: React.MouseEvent, moreProps: any) => {
            const { startPos } = moreProps;
            this.dragStart = { points, startPos };
            if (onSelect) onSelect(e, index, moreProps);
        };

        const handleDrag = (e: React.MouseEvent, moreProps: any) => {
            const { index, onDrag } = this.props;
            const { points: startPoints } = this.dragStart;
            const {
                xScale,
                chartConfig: { yScale },
                startPos,
                mouseXY,
            } = moreProps;

            if (!startPoints || startPoints.length === 0) return;

            const dx = startPos[0] - mouseXY[0];
            const dy = startPos[1] - mouseXY[1];

            const firstPoint = startPoints[0];
            const firstXpx = xScale(firstPoint.x);
            const firstYpx = yScale(firstPoint.y);
            const newFirstXpx = firstXpx - dx;
            const newFirstYpx = firstYpx - dy;
            const newFirstX = xScale.invert(newFirstXpx);
            const newFirstY = yScale.invert(newFirstYpx);
            const deltaX = newFirstX - firstPoint.x;
            const deltaY = newFirstY - firstPoint.y;

            const newPoints = startPoints.map((p: { x: number; y: number }) => ({
                x: p.x + deltaX,
                y: p.y + deltaY,
            }));

            if (onDrag) onDrag(e, index, newPoints);
        };

        const handleDragComplete = (e: React.MouseEvent, moreProps: any) => {
            if (onDragComplete) onDragComplete(e, moreProps);
        };

        const startPoint = points[0];
        const endPoint = points[points.length - 1];
        const hasValidStart = startPoint && typeof startPoint.x === "number" && typeof startPoint.y === "number";
        const hasValidEnd = endPoint && typeof endPoint.x === "number" && typeof endPoint.y === "number";

        return (
            <g>
                <FreehandBrush
                    ref={this.saveNodeType(`brush_${index}`)}
                    points={points}
                    color={color}
                    lineWidth={lineWidth}
                    selected={selected || hover}
                    onDragStart={handleDragStart}
                    onDrag={handleDrag}
                    onDragComplete={handleDragComplete}
                />
                {hasValidStart && (
                    <ClickableCircle
                        ref={this.saveNodeType(`edge_start_${index}`)}
                        show={selected || hover}
                        cx={startPoint.x}
                        cy={startPoint.y}
                        r={5}
                        fillStyle="#FFFFFF"
                        strokeStyle={color}
                        strokeWidth={2}
                        interactiveCursorClass="react-financial-charts-move-cursor"
                        onDragStart={handleDragStart}
                        onDrag={handleDrag}
                        onDragComplete={handleDragComplete}
                    />
                )}
                {hasValidEnd && points.length > 1 && (
                    <ClickableCircle
                        ref={this.saveNodeType(`edge_end_${index}`)}
                        show={selected || hover}
                        cx={endPoint.x}
                        cy={endPoint.y}
                        r={5}
                        fillStyle="#FFFFFF"
                        strokeStyle={color}
                        strokeWidth={2}
                        interactiveCursorClass="react-financial-charts-move-cursor"
                        onDragStart={handleDragStart}
                        onDrag={handleDrag}
                        onDragComplete={handleDragComplete}
                    />
                )}
                <HoverTextNearMouse show={hoverTextEnabled && hover && !selected} {...restHoverTextProps} />
            </g>
        );
    }
}
