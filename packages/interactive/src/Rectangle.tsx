import * as React from "react";
import { isDefined, isNotDefined, noop } from "@react-financial-charts/core";
import { HoverTextNearMouse, MouseLocationIndicator } from "./components";
import { saveNodeType } from "./utils";
import { EachRectangle } from "./wrapper";

export interface RectangleProps {
    readonly enabled: boolean;
    readonly onStart?: () => void;
    readonly onComplete: (e: React.MouseEvent, newRectangles: any[], moreProps: any) => void;
    readonly onSelect?: (e: React.MouseEvent, interactives: any[], moreProps: any) => void;
    readonly currentPositionStroke?: string;
    readonly currentPositionStrokeWidth?: number;
    readonly currentPositionOpacity?: number;
    readonly currentPositionRadius?: number;
    readonly hoverText: object;
    readonly rectangles: any[];
    readonly appearance: {
        readonly strokeStyle?: string;
        readonly strokeWidth?: number;
        readonly fill?: string;
        readonly fillOpacity?: number;
        readonly edgeStroke?: string;
        readonly edgeFill?: string;
        readonly edgeStrokeWidth?: number;
        readonly r?: number;
    };
}

interface RectangleState {
    current?: any;
    override?: any;
}

export class Rectangle extends React.Component<RectangleProps, RectangleState> {
    public static defaultProps = {
        onSelect: noop,
        currentPositionStroke: "#000000",
        currentPositionOpacity: 1,
        currentPositionStrokeWidth: 3,
        currentPositionRadius: 4,
        hoverText: {
            ...HoverTextNearMouse.defaultProps,
            enable: true,
            bgHeight: 18,
            bgWidth: 120,
            text: "Click to select object",
        },
        rectangles: [],
        appearance: {
            strokeStyle: "#000000",
            strokeWidth: 1,
            fill: "#8AAFE2",
            fillOpacity: 0.5,
            edgeStroke: "#000000",
            edgeFill: "#FFFFFF",
            edgeStrokeWidth: 1,
            r: 5,
        },
    };

    private saveNodeType: any;
    private mouseMoved: any;

    public constructor(props: RectangleProps) {
        super(props);
        this.saveNodeType = saveNodeType.bind(this);
        this.state = {};
    }

    public render() {
        const {
            appearance,
            rectangles,
            currentPositionOpacity,
            currentPositionRadius = Rectangle.defaultProps.currentPositionRadius,
            currentPositionStroke,
            currentPositionStrokeWidth,
            enabled,
            hoverText,
        } = this.props;

        const { current, override } = this.state;
        const overrideIndex = isDefined(override) ? override.index : null;

        const tempRectangle =
            isDefined(current) && isDefined(current.endXY) ? (
                <EachRectangle
                    key="temp-rectangle"
                    index={-1}
                    interactive={false}
                    {...current}
                    appearance={appearance}
                    hoverText={hoverText}
                />
            ) : null;

        return (
            <g>
                {rectangles.map((each, idx) => {
                    const eachAppearance = isDefined(each.appearance)
                        ? { ...appearance, ...each.appearance }
                        : appearance;

                    return (
                        <EachRectangle
                            key={idx}
                            ref={this.saveNodeType(idx)}
                            index={idx}
                            selected={each.selected}
                            hoverText={hoverText}
                            {...(idx === overrideIndex ? override : each)}
                            appearance={eachAppearance}
                            onDrag={this.handleDragRectangle}
                            onDragComplete={this.handleDragRectangleComplete}
                            onSelect={this.handleSelect}
                        />
                    );
                })}
                {tempRectangle}
                <MouseLocationIndicator
                    enabled={enabled}
                    snap={false}
                    r={currentPositionRadius}
                    stroke={currentPositionStroke}
                    opacity={currentPositionOpacity}
                    strokeWidth={currentPositionStrokeWidth}
                    onMouseDown={this.handleStart}
                    onClick={this.handleEnd}
                    onMouseMove={this.handleDrawRectangle}
                />
            </g>
        );
    }

    private readonly handleDragRectangle = (_: React.MouseEvent, index: any, newXYValue: any) => {
        this.setState({
            override: {
                index,
                ...newXYValue,
            },
        });
    };

    private readonly handleDragRectangleComplete = (e: React.MouseEvent, moreProps: any) => {
        const { override } = this.state;
        const { rectangles } = this.props;

        if (isDefined(override)) {
            const { index, ...rest } = override;
            const newRectangles = rectangles.map((each, idx) =>
                idx === index ? { ...each, ...rest, selected: true } : { ...each, selected: false },
            );

            this.setState({ override: null }, () => {
                const { onComplete } = this.props;
                if (onComplete) onComplete(e, newRectangles, moreProps);
            });
        }
    };

    private readonly handleStart = (_: React.MouseEvent, xyValue: any) => {
        const { current } = this.state;

        if (isNotDefined(current) || isNotDefined(current.startXY)) {
            this.mouseMoved = false;
            this.setState(
                {
                    current: {
                        startXY: xyValue,
                        endXY: null,
                    },
                },
                () => {
                    const { onStart } = this.props;
                    if (onStart) onStart();
                },
            );
        }
    };

    private readonly handleEnd = (e: React.MouseEvent, _: any, moreProps: any) => {
        const { current } = this.state;
        const { rectangles, appearance } = this.props;

        if (this.mouseMoved && isDefined(current) && isDefined(current.startXY)) {
            const newRectangles = [
                ...rectangles.map((d) => ({ ...d, selected: false })),
                {
                    ...current,
                    selected: true,
                    appearance: {
                        ...Rectangle.defaultProps.appearance,
                        ...appearance,
                    },
                },
            ];

            this.setState({ current: null }, () => {
                const { onComplete } = this.props;
                if (onComplete) onComplete(e, newRectangles, moreProps);
            });
        }
    };

    private readonly handleDrawRectangle = (_: React.MouseEvent, xyValue: any) => {
        const { current } = this.state;

        if (isDefined(current) && isDefined(current.startXY)) {
            this.mouseMoved = true;
            this.setState({
                current: {
                    startXY: current.startXY,
                    endXY: xyValue,
                },
            });
        }
    };

    private readonly handleSelect = (e: React.MouseEvent, index: number | undefined, moreProps: any) => {
        const { rectangles, onSelect } = this.props;
        const newRectangles =
            index === undefined
                ? rectangles.map((d) => ({ ...d, selected: false }))
                : rectangles.map((d, dIdx) => ({ ...d, selected: dIdx === index }));

        if (onSelect) onSelect(e, newRectangles, moreProps);
    };
}
