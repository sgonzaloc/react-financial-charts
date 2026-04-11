import * as React from "react";
import { isDefined, isNotDefined, noop } from "@react-financial-charts/core";
import { HoverTextNearMouse, MouseLocationIndicator } from "./components";
import { saveNodeType } from "./utils";
import { EachArrow } from "./wrapper/EachArrow";

export interface InteractiveArrowProps {
    readonly enabled: boolean;
    readonly onStart?: () => void;
    readonly onComplete: (e: React.MouseEvent, newArrows: any[], moreProps: any) => void;
    readonly onSelect?: (e: React.MouseEvent, interactives: any[], moreProps: any) => void;
    readonly currentPositionStroke?: string;
    readonly currentPositionStrokeWidth?: number;
    readonly currentPositionOpacity?: number;
    readonly currentPositionRadius?: number;
    readonly hoverText: object;
    readonly arrows: any[];
    readonly appearance: {
        readonly color?: string;
        readonly lineWidth?: number;
        readonly dashArray?: number[];
    };
}

interface InteractiveArrowState {
    current?: any;
    override?: any;
}

export class InteractiveArrow extends React.Component<InteractiveArrowProps, InteractiveArrowState> {
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
            text: "Click to select arrow",
        },
        arrows: [],
        appearance: {
            color: "#1E53E5",
            lineWidth: 2,
            dashArray: [],
        },
    };

    private saveNodeType: any;
    private mouseMoved: any;

    public constructor(props: InteractiveArrowProps) {
        super(props);
        this.saveNodeType = saveNodeType.bind(this);
        this.state = {};
    }

    public render() {
        const {
            appearance,
            arrows,
            currentPositionOpacity,
            currentPositionRadius = InteractiveArrow.defaultProps.currentPositionRadius,
            currentPositionStroke,
            currentPositionStrokeWidth,
            enabled,
            hoverText,
        } = this.props;

        const { current, override } = this.state;
        const overrideIndex = isDefined(override) ? override.index : null;

        const tempArrow =
            isDefined(current) && isDefined(current.endXY) ? (
                <EachArrow
                    key="temp-arrow"
                    index={-1}
                    interactive={false}
                    {...current}
                    appearance={appearance}
                    hoverText={hoverText}
                />
            ) : null;

        return (
            <g>
                {arrows.map((each, idx) => {
                    const eachAppearance = isDefined(each.appearance)
                        ? { ...appearance, ...each.appearance }
                        : appearance;

                    return (
                        <EachArrow
                            key={idx}
                            ref={this.saveNodeType(idx)}
                            index={idx}
                            selected={each.selected}
                            hoverText={hoverText}
                            {...(idx === overrideIndex ? override : each)}
                            appearance={eachAppearance}
                            onDrag={this.handleDragArrow}
                            onDragComplete={this.handleDragArrowComplete}
                            onSelect={this.handleSelect}
                        />
                    );
                })}
                {tempArrow}
                <MouseLocationIndicator
                    enabled={enabled}
                    snap={false}
                    r={currentPositionRadius}
                    stroke={currentPositionStroke}
                    opacity={currentPositionOpacity}
                    strokeWidth={currentPositionStrokeWidth}
                    onMouseDown={this.handleStart}
                    onClick={this.handleEnd}
                    onMouseMove={this.handleDrawArrow}
                />
            </g>
        );
    }

    private readonly handleDragArrow = (_: React.MouseEvent, index: any, newXYValue: any) => {
        this.setState({
            override: {
                index,
                ...newXYValue,
            },
        });
    };

    private readonly handleDragArrowComplete = (e: React.MouseEvent, moreProps: any) => {
        const { override } = this.state;
        const { arrows } = this.props;

        if (isDefined(override)) {
            const { index, ...rest } = override;
            const newArrows = arrows.map((each, idx) =>
                idx === index ? { ...each, ...rest, selected: true } : { ...each, selected: false },
            );

            this.setState({ override: null }, () => {
                const { onComplete } = this.props;
                if (onComplete) {
                    onComplete(e, newArrows, moreProps);
                }
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
                    if (onStart) {
                        onStart();
                    }
                },
            );
        }
    };

    private readonly handleEnd = (e: React.MouseEvent, _: any, moreProps: any) => {
        const { current } = this.state;
        const { arrows, appearance } = this.props;

        if (this.mouseMoved && isDefined(current) && isDefined(current.startXY)) {
            const newArrows = [
                ...arrows.map((d) => ({ ...d, selected: false })),
                {
                    ...current,
                    selected: true,
                    appearance: {
                        ...InteractiveArrow.defaultProps.appearance,
                        ...appearance,
                    },
                },
            ];

            this.setState({ current: null }, () => {
                const { onComplete } = this.props;
                if (onComplete) {
                    onComplete(e, newArrows, moreProps);
                }
            });
        }
    };

    private readonly handleDrawArrow = (_: React.MouseEvent, xyValue: any) => {
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
        const { arrows, onSelect } = this.props;
        const newArrows =
            index === undefined
                ? arrows.map((d) => ({ ...d, selected: false }))
                : arrows.map((d, dIdx) => ({ ...d, selected: dIdx === index }));

        if (onSelect) {
            onSelect(e, newArrows, moreProps);
        }
    };
}
