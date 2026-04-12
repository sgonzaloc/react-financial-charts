import * as React from "react";
import { noop, getMouseCanvas, GenericChartComponent } from "@react-financial-charts/core";
import { HoverTextNearMouse } from "./components";
import { saveNodeType } from "./utils";
import { EachFreehandBrush } from "./wrapper/EachFreehandBrush";

export interface FreehandBrushProps {
    readonly enabled: boolean;
    readonly color?: string;
    readonly lineWidth?: number;
    readonly onComplete?: (e: React.MouseEvent, newDrawings: any[], moreProps: any) => void;
    readonly onSelect?: (e: React.MouseEvent, interactives: any[], moreProps: any) => void;
    readonly hoverText?: any;
    readonly drawings: any[];
}

interface FreehandBrushState {
    drawing: boolean;
    hasMoved: boolean;
    currentPoints: { x: number; y: number }[];
    override?: any;
}

export class FreehandBrush extends React.Component<FreehandBrushProps, FreehandBrushState> {
    public static defaultProps = {
        color: "#FF9800",
        lineWidth: 2,
        onSelect: noop,
        hoverText: {
            ...HoverTextNearMouse.defaultProps,
            enable: true,
            bgHeight: 18,
            bgWidth: 120,
            text: "Click to select drawing",
        },
        drawings: [],
    };

    private saveNodeType: any;

    public constructor(props: FreehandBrushProps) {
        super(props);
        this.saveNodeType = saveNodeType.bind(this);
        this.state = {
            drawing: false,
            hasMoved: false,
            currentPoints: [],
        };
    }

    public render() {
        const { color, lineWidth, drawings, enabled, hoverText } = this.props;
        const { currentPoints, drawing, override } = this.state;

        const tempDrawing =
            drawing && currentPoints.length > 1 ? (
                <EachFreehandBrush
                    key="temp-brush"
                    index={-1}
                    points={currentPoints}
                    selected={false}
                    color={color}
                    lineWidth={lineWidth}
                    hoverText={hoverText || FreehandBrush.defaultProps.hoverText}
                />
            ) : null;

        return (
            <g>
                {drawings.map((each, idx) => {
                    const points = override && override.index === idx ? override.points : each.points;
                    return (
                        <EachFreehandBrush
                            key={idx}
                            ref={this.saveNodeType(idx)}
                            index={idx}
                            points={points}
                            selected={each.selected}
                            color={each.color || color}
                            lineWidth={each.lineWidth || lineWidth}
                            hoverText={hoverText || FreehandBrush.defaultProps.hoverText}
                            onDrag={this.handleDrag}
                            onDragComplete={this.handleDragComplete}
                            onSelect={this.handleSelect}
                        />
                    );
                })}
                {tempDrawing}
                {enabled && (
                    <GenericChartComponent
                        canvasToDraw={getMouseCanvas}
                        canvasDraw={this.drawOnCanvas}
                        disablePan={true}
                        onMouseDown={this.handleMouseDown}
                        onMouseMove={this.handleMouseMove}
                        onClick={this.handleMouseUp}
                        drawOn={["mousemove", "pan", "drag", "clickº"]}
                    />
                )}
            </g>
        );
    }

    private readonly drawOnCanvas = (ctx: CanvasRenderingContext2D, moreProps: any) => {
        const { currentPoints } = this.state;
        const { color, lineWidth } = this.props;
        const {
            xScale,
            chartConfig: { yScale },
        } = moreProps;

        if (!currentPoints || currentPoints.length < 2) {
            return;
        }

        ctx.beginPath();
        ctx.strokeStyle = color || "#FF9800";
        ctx.lineWidth = lineWidth || 2;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";

        ctx.moveTo(xScale(currentPoints[0].x), yScale(currentPoints[0].y));
        for (let i = 1; i < currentPoints.length; i++) {
            ctx.lineTo(xScale(currentPoints[i].x), yScale(currentPoints[i].y));
        }
        ctx.stroke();
    };

    private readonly handleMouseDown = (_: React.MouseEvent, moreProps: any) => {
        const { enabled } = this.props;
        if (!enabled) {
            return;
        }

        const point = this.getFreePoint(moreProps);
        this.setState({
            drawing: true,
            hasMoved: false,
            currentPoints: [point],
        });
    };

    private readonly handleMouseMove = (_: React.MouseEvent, moreProps: any) => {
        const { drawing } = this.state;
        if (!drawing) {
            return;
        }

        this.setState({ hasMoved: true });
        const newPoint = this.getFreePoint(moreProps);
        this.setState((prev) => ({
            currentPoints: [...prev.currentPoints, newPoint],
        }));
    };

    private readonly handleMouseUp = (e: React.MouseEvent, moreProps: any) => {
        const { drawing, hasMoved, currentPoints } = this.state;
        const { drawings, color, lineWidth, onComplete } = this.props;

        if (!drawing) {
            return;
        }

        if (hasMoved && currentPoints.length > 1) {
            const newDrawings = [
                ...drawings.map((d) => ({ ...d, selected: false })),
                {
                    points: [...currentPoints],
                    selected: true,
                    color,
                    lineWidth,
                },
            ];

            if (onComplete) {
                onComplete(e, newDrawings, moreProps);
            }
            this.setState({ drawing: false, currentPoints: [] });
        }
    };

    private readonly getFreePoint = (moreProps: any): { x: number; y: number } => {
        const {
            mouseXY,
            xScale,
            chartConfig: { yScale },
        } = moreProps;
        return {
            x: xScale.invert(mouseXY[0]),
            y: yScale.invert(mouseXY[1]),
        };
    };

    private readonly handleDrag = (_: React.MouseEvent, index: any, points: any) => {
        this.setState({
            override: { index, points },
        });
    };

    private readonly handleDragComplete = (e: React.MouseEvent, moreProps: any) => {
        const { override } = this.state;
        const { drawings, onComplete } = this.props;
        if (override) {
            const newDrawings = drawings.map((each, idx) =>
                idx === override.index
                    ? { ...each, points: override.points, selected: true }
                    : { ...each, selected: false },
            );
            this.setState({ override: undefined }, () => {
                if (onComplete) {
                    onComplete(e, newDrawings, moreProps);
                }
            });
        }
    };

    private readonly handleSelect = (e: React.MouseEvent, index: number | undefined, moreProps: any) => {
        const { drawings, onSelect } = this.props;
        const newDrawings = drawings.map((d, i) => ({ ...d, selected: i === index }));
        if (onSelect) {
            onSelect(e, newDrawings, moreProps);
        }
    };
}
