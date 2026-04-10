import * as React from "react";
import { isDefined, noop } from "@react-financial-charts/core";
import { getXValue } from "@react-financial-charts/core/lib/utils/ChartDataUtil";
import { saveNodeType } from "../utils";
import { ClickableCircle, HoverTextNearMouse, Rectangle } from "../components";

export interface EachRectangleProps {
    readonly startXY: number[];
    readonly endXY: number[];
    readonly interactive: boolean;
    readonly selected: boolean;
    readonly hoverText: {
        readonly enable: boolean;
        readonly fontFamily: string;
        readonly fontSize: number;
        readonly fill: string;
        readonly text: string;
        readonly bgFill: string;
        readonly bgOpacity: number;
        readonly bgWidth: number | string;
        readonly bgHeight: number | string;
    };
    readonly appearance: {
        readonly strokeStyle: string;
        readonly strokeWidth: number;
        readonly fill: string;
        readonly edgeStroke: string;
        readonly edgeFill: string;
        readonly edgeStrokeWidth: number;
        readonly r: number;
    };
    readonly index?: number;
    readonly onDrag: (e: React.MouseEvent, index: number | undefined, moreProps: any) => void;
    readonly onDragComplete?: (e: React.MouseEvent, moreProps: any) => void;
    readonly onSelect?: (e: React.MouseEvent, index: number | undefined, moreProps: any) => void;
}

interface EachRectangleState {
    hover: boolean;
}

export class EachRectangle extends React.Component<EachRectangleProps, EachRectangleState> {
    public static defaultProps = {
        interactive: true,
        selected: false,
        onDrag: noop,
        onSelect: noop,
        hoverText: { enable: false },
        appearance: {
            strokeStyle: "#000000",
            strokeWidth: 1,
            fill: "#8AAFE2",
            edgeStroke: "#000000",
            edgeFill: "#FFFFFF",
            edgeStrokeWidth: 1,
            r: 5,
        },
    };

    private dragStart: any;
    private saveNodeType: any;

    public constructor(props: EachRectangleProps) {
        super(props);
        this.saveNodeType = saveNodeType.bind(this);
        this.state = { hover: false };
    }

    public render() {
        const { startXY, endXY } = this.props;
        const { interactive, hoverText, appearance, selected } = this.props;
        const { onDragComplete } = this.props;
        const { hover } = this.state;
        const { enable: hoverTextEnabled, ...restHoverTextProps } = hoverText;
        const { strokeStyle, strokeWidth, fill, edgeFill, edgeStroke, edgeStrokeWidth, r } = appearance;

        const hoverHandler = interactive ? { onHover: this.handleHover, onUnHover: this.handleHover } : {};

        const handleDragStart = (e: React.MouseEvent, moreProps: any) => {
            const { startXY, endXY, index, onSelect } = this.props;
            this.dragStart = { startXY, endXY };
            if (onSelect) {
                onSelect(e, index, {});
            }
        };

        // Círculo para esquina superior izquierda (startXY)
        const edge1 =
            isDefined(startXY) && isDefined(endXY) ? (
                <ClickableCircle
                    ref={this.saveNodeType(`edge1_${this.props.index}`)}
                    show={selected || hover}
                    cx={startXY[0]}
                    cy={startXY[1]}
                    r={r}
                    fillStyle={edgeFill}
                    strokeStyle={edgeStroke}
                    strokeWidth={edgeStrokeWidth}
                    interactiveCursorClass="react-financial-charts-move-cursor"
                    onDragStart={handleDragStart}
                    onDrag={this.handleEdge1Drag}
                    onDragComplete={onDragComplete}
                />
            ) : null;

        // Círculo para esquina superior derecha
        const edge2 =
            isDefined(startXY) && isDefined(endXY) ? (
                <ClickableCircle
                    ref={this.saveNodeType(`edge2_${this.props.index}`)}
                    show={selected || hover}
                    cx={endXY[0]}
                    cy={startXY[1]}
                    r={r}
                    fillStyle={edgeFill}
                    strokeStyle={edgeStroke}
                    strokeWidth={edgeStrokeWidth}
                    interactiveCursorClass="react-financial-charts-move-cursor"
                    onDragStart={handleDragStart}
                    onDrag={this.handleEdge2Drag}
                    onDragComplete={onDragComplete}
                />
            ) : null;

        // Círculo para esquina inferior derecha (endXY)
        const edge3 =
            isDefined(startXY) && isDefined(endXY) ? (
                <ClickableCircle
                    ref={this.saveNodeType(`edge3_${this.props.index}`)}
                    show={selected || hover}
                    cx={endXY[0]}
                    cy={endXY[1]}
                    r={r}
                    fillStyle={edgeFill}
                    strokeStyle={edgeStroke}
                    strokeWidth={edgeStrokeWidth}
                    interactiveCursorClass="react-financial-charts-move-cursor"
                    onDragStart={handleDragStart}
                    onDrag={this.handleEdge3Drag}
                    onDragComplete={onDragComplete}
                />
            ) : null;

        // Círculo para esquina inferior izquierda
        const edge4 =
            isDefined(startXY) && isDefined(endXY) ? (
                <ClickableCircle
                    ref={this.saveNodeType(`edge4_${this.props.index}`)}
                    show={selected || hover}
                    cx={startXY[0]}
                    cy={endXY[1]}
                    r={r}
                    fillStyle={edgeFill}
                    strokeStyle={edgeStroke}
                    strokeWidth={edgeStrokeWidth}
                    interactiveCursorClass="react-financial-charts-move-cursor"
                    onDragStart={handleDragStart}
                    onDrag={this.handleEdge4Drag}
                    onDragComplete={onDragComplete}
                />
            ) : null;

        return (
            <g>
                <Rectangle
                    ref={this.saveNodeType(`rectangle_${this.props.index}`)}
                    selected={selected || hover}
                    {...hoverHandler}
                    startXY={startXY}
                    endXY={endXY}
                    strokeStyle={strokeStyle}
                    strokeWidth={hover || selected ? strokeWidth + 1 : strokeWidth}
                    fillStyle={fill}
                    interactiveCursorClass="react-financial-charts-move-cursor"
                    onDragStart={handleDragStart}
                    onDrag={this.handleRectangleDrag}
                    onDragComplete={onDragComplete}
                />
                {edge1}
                {edge2}
                {edge3}
                {edge4}
                <HoverTextNearMouse show={hoverTextEnabled && hover && !selected} {...restHoverTextProps} />
            </g>
        );
    }

    private readonly handleEdge1Drag = (e: React.MouseEvent, moreProps: any) => {
        const { index, onDrag } = this.props;
        const { endXY } = this.dragStart;
        const [x, y] = this.getXY(moreProps);
        onDrag(e, index, { startXY: [x, y], endXY });
    };

    private readonly handleEdge2Drag = (e: React.MouseEvent, moreProps: any) => {
        const { index, onDrag } = this.props;
        const { startXY, endXY } = this.dragStart;
        const [x, y] = this.getXY(moreProps);
        onDrag(e, index, { startXY: [startXY[0], y], endXY: [x, endXY[1]] });
    };

    private readonly handleEdge3Drag = (e: React.MouseEvent, moreProps: any) => {
        const { index, onDrag } = this.props;
        const { startXY } = this.dragStart;
        const [x, y] = this.getXY(moreProps);
        onDrag(e, index, { startXY, endXY: [x, y] });
    };

    private readonly handleEdge4Drag = (e: React.MouseEvent, moreProps: any) => {
        const { index, onDrag } = this.props;
        const { startXY, endXY } = this.dragStart;
        const [x, y] = this.getXY(moreProps);
        onDrag(e, index, { startXY: [x, startXY[1]], endXY: [endXY[0], y] });
    };

    private readonly handleRectangleDrag = (e: React.MouseEvent, moreProps: any) => {
        const { index, onDrag } = this.props;
        const { startXY, endXY } = this.dragStart;
        const { x1, y1, x2, y2 } = this.getDragValues(moreProps, startXY, endXY);
        onDrag(e, index, { startXY: [x1, y1], endXY: [x2, y2] });
    };

    private readonly getDragValues = (moreProps: any, startXY: number[], endXY: number[]) => {
        const {
            xScale,
            chartConfig: { yScale },
            xAccessor,
            fullData,
        } = moreProps;
        const { startPos, mouseXY } = moreProps;

        const x1 = xScale(startXY[0]);
        const y1 = yScale(startXY[1]);
        const x2 = xScale(endXY[0]);
        const y2 = yScale(endXY[1]);

        const dx = startPos[0] - mouseXY[0];
        const dy = startPos[1] - mouseXY[1];

        const newX1Value = getXValue(xScale, xAccessor, [x1 - dx, y1 - dy], fullData);
        const newY1Value = yScale.invert(y1 - dy);
        const newX2Value = getXValue(xScale, xAccessor, [x2 - dx, y2 - dy], fullData);
        const newY2Value = yScale.invert(y2 - dy);

        return { x1: newX1Value, y1: newY1Value, x2: newX2Value, y2: newY2Value };
    };

    private readonly getXY = (moreProps: any): [number, number] => {
        const {
            xScale,
            chartConfig: { yScale },
            xAccessor,
            fullData,
        } = moreProps;
        const { mouseXY } = moreProps;
        const x = getXValue(xScale, xAccessor, mouseXY, fullData);
        const y = yScale.invert(mouseXY[1]);
        return [x, y];
    };

    private readonly handleHover = (_: React.MouseEvent, moreProps: any) => {
        if (this.state.hover !== moreProps.hovering) {
            this.setState({ hover: moreProps.hovering });
        }
    };
}
