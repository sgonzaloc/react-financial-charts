import * as React from "react";
import { isDefined, noop } from "@react-financial-charts/core";
import { getXValue } from "@react-financial-charts/core/lib/utils/ChartDataUtil";
import { saveNodeType } from "../utils";
import { ClickableCircle, HoverTextNearMouse, Arrow } from "../components";

export interface EachArrowProps {
    readonly startXY: number[];
    readonly endXY: number[];
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
        readonly color?: string;
        readonly lineWidth?: number;
        readonly dashArray?: number[];
    };
    readonly index?: number;
    readonly onDrag: (e: React.MouseEvent, index: number | undefined, moreProps: any) => void;
    readonly onDragComplete?: (e: React.MouseEvent, moreProps: any) => void;
    readonly onSelect?: (e: React.MouseEvent, index: number | undefined, moreProps: any) => void;
}

interface EachArrowState {
    hover: boolean;
}

export class EachArrow extends React.Component<EachArrowProps, EachArrowState> {
    public static defaultProps = {
        selected: false,
        onDrag: noop,
        onSelect: noop,
        hoverText: { enable: false },
        appearance: {
            color: "#FF9800",
            lineWidth: 2,
            dashArray: [],
        },
    };

    private dragStart: any;
    private saveNodeType: any;

    public constructor(props: EachArrowProps) {
        super(props);
        this.saveNodeType = saveNodeType.bind(this);
        this.state = { hover: false };
    }

    handleDragStart = (e: React.MouseEvent) => {
        const { startXY, endXY, index, onSelect } = this.props;
        this.dragStart = { startXY, endXY };
        if (onSelect) {
            onSelect(e, index, {});
        }
    };

    public render() {
        const { startXY, endXY } = this.props;
        const { hoverText, appearance, selected } = this.props;
        const { onDragComplete } = this.props;
        const { hover } = this.state;
        const { enable: hoverTextEnabled, ...restHoverTextProps } = hoverText;
        const { color = "#1E53E5", lineWidth = 2, dashArray = [] } = appearance;

        const edge1 =
            isDefined(startXY) && isDefined(endXY) ? (
                <ClickableCircle
                    ref={this.saveNodeType(`edge1_${this.props.index}`)}
                    show={selected || hover}
                    cx={startXY[0]}
                    cy={startXY[1]}
                    r={5}
                    fillStyle="#FFFFFF"
                    strokeStyle={color}
                    strokeWidth={lineWidth}
                    interactiveCursorClass="react-financial-charts-move-cursor"
                    onDragStart={this.handleDragStart}
                    onDrag={this.handleEdge1Drag}
                    onDragComplete={onDragComplete}
                />
            ) : null;

        const edge2 =
            isDefined(startXY) && isDefined(endXY) ? (
                <ClickableCircle
                    ref={this.saveNodeType(`edge2_${this.props.index}`)}
                    show={selected || hover}
                    cx={endXY[0]}
                    cy={endXY[1]}
                    r={5}
                    fillStyle="#FFFFFF"
                    strokeStyle={color}
                    strokeWidth={lineWidth}
                    interactiveCursorClass="react-financial-charts-move-cursor"
                    onDragStart={this.handleDragStart}
                    onDrag={this.handleEdge2Drag}
                    onDragComplete={onDragComplete}
                />
            ) : null;

        return (
            <g>
                <Arrow
                    ref={this.saveNodeType(`arrow_${this.props.index}`)}
                    x1={startXY[0]}
                    y1={startXY[1]}
                    x2={endXY[0]}
                    y2={endXY[1]}
                    color={color}
                    lineWidth={lineWidth}
                    dashArray={dashArray}
                    onDragStart={this.handleDragStart}
                />
                {edge1}
                {edge2}
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
        const { startXY } = this.dragStart;
        const [x, y] = this.getXY(moreProps);
        onDrag(e, index, { startXY, endXY: [x, y] });
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
}
