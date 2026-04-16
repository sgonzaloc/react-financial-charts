import * as React from "react";
import { ChartContext, GenericChartComponent, getMouseCanvas, isDefined, noop } from "@react-financial-charts/core";
import { HoverTextNearMouse } from "./components";
import { getValueFromOverride, saveNodeType } from "./utils";
import { EachText } from "./wrapper";

interface TextProps {
    readonly onChoosePosition: (e: React.MouseEvent, newText: any, moreProps: any) => void;
    readonly onDragComplete?: (e: React.MouseEvent, newTextList: any[], moreProps: any) => void;
    readonly onSelect?: (e: React.MouseEvent, interactives: any[], moreProps: any) => void;
    readonly onEdit?: (e: KeyboardEvent | React.MouseEvent, index: number, newText: string, moreProps: any) => void;
    readonly appearance: {
        readonly bgFill?: string;
        readonly bgOpacity?: number;
        readonly bgStrokeWidth?: number;
        readonly bgStroke?: string;
        readonly textFill?: string;
        readonly fontFamily?: string;
        readonly fontWeight?: string;
        readonly fontStyle?: string;
        readonly fontSize?: number;
    };
    readonly defaultText?: string;
    readonly hoverText: object;
    readonly textList: any[];
    readonly enabled: boolean;
}

interface TextState {
    current?: any;
    override?: any;
    editingIndex: number | null;
}

export class Text extends React.Component<TextProps, TextState> {
    public static defaultProps = {
        onSelect: noop,
        onEdit: noop,
        appearance: {
            bgFill: "transparent",
            bgOpacity: 1,
            bgStrokeWidth: 1,
            bgStroke: "#1E53E5",
            textFill: "#000000",
            fontFamily: "-apple-system, system-ui, Roboto, 'Helvetica Neue', Ubuntu, sans-serif",
            fontSize: 12,
            fontStyle: "normal",
            fontWeight: "normal",
        },
        defaultText: "Lorem ipsum...",
        hoverText: {
            ...HoverTextNearMouse.defaultProps,
            enable: true,
            bgHeight: "auto",
            bgWidth: "auto",
            text: "Click to select object",
            selectedText: "",
        },
        textList: [],
    };

    public static contextType = ChartContext;

    private saveNodeType: any;

    public constructor(props: TextProps) {
        super(props);
        this.saveNodeType = saveNodeType.bind(this);
        this.state = {
            editingIndex: null,
        };
    }
    public render() {
        const { textList, appearance, defaultText, hoverText, onEdit } = this.props;
        const { override, editingIndex } = this.state;
        return (
            <g>
                {textList.map((each, idx) => {
                    const defaultHoverText = Text.defaultProps.hoverText;
                    const props = {
                        ...appearance,
                        ...each,
                        text: each.text || defaultText,
                        hoverText: {
                            ...defaultHoverText,
                            ...hoverText,
                            ...(each.hoverText || {}),
                        },
                    };
                    return (
                        <EachText
                            key={idx}
                            ref={this.saveNodeType(idx)}
                            index={idx}
                            {...props}
                            selected={each.selected}
                            position={getValueFromOverride(override, idx, "position", each.position)}
                            onDrag={this.handleDrag}
                            onDragComplete={this.handleDragComplete}
                            edgeInteractiveCursor="react-financial-charts-move-cursor"
                            onSelect={this.handleSelect}
                            onEdit={onEdit ? this.handleEdit : undefined}
                            isEditingGlobal={editingIndex === idx}
                            onRequestEdit={this.handleRequestEdit}
                            onEndEdit={this.handleEndEdit}
                        />
                    );
                })}
                <GenericChartComponent
                    onClick={this.handleDraw}
                    canvasToDraw={getMouseCanvas}
                    drawOn={["mousemove", "pan"]}
                />
            </g>
        );
    }

    private readonly handleRequestEdit = (index: number) => {
        if (this.state.editingIndex === null || index > this.state.editingIndex) {
            this.setState({ editingIndex: index });
        }
    };

    private readonly handleEndEdit = () => {
        this.setState({ editingIndex: null });
    };

    private readonly handleEdit = (e: KeyboardEvent | React.MouseEvent, index: number, newText: string) => {
        const { onEdit } = this.props;
        if (onEdit) {
            const moreProps = this.context;
            onEdit(e, index, newText, moreProps);
        }
    };

    private readonly handleDraw = (e: React.MouseEvent, moreProps: any) => {
        const { enabled } = this.props;
        if (enabled) {
            const {
                mouseXY: [, mouseY],
                chartConfig: { yScale },
                xAccessor,
                currentItem,
            } = moreProps;
            const { appearance, defaultText, onChoosePosition } = this.props;
            if (onChoosePosition !== undefined) {
                const xyValue = [xAccessor(currentItem), yScale.invert(mouseY)];
                const newText = {
                    ...appearance,
                    text: defaultText,
                    position: xyValue,
                };
                onChoosePosition(e, newText, moreProps);
            }
        }
    };

    private readonly handleDragComplete = (e: React.MouseEvent, moreProps: any) => {
        const { override } = this.state;
        if (isDefined(override)) {
            const { textList } = this.props;
            const newTextList = textList.map((each, idx) => {
                const selected = idx === override.index;
                return selected ? { ...each, position: override.position, selected } : { ...each, selected };
            });
            this.setState({ override: null }, () => {
                const { onDragComplete } = this.props;
                if (onDragComplete !== undefined) {
                    onDragComplete(e, newTextList, moreProps);
                }
            });
        }
    };

    private readonly handleDrag = (_: React.MouseEvent, index: any, position: any) => {
        this.setState({ override: { index, position } });
    };

    private readonly handleSelect = (e: React.MouseEvent, index: number | undefined, moreProps: any) => {
        const { textList, onSelect } = this.props;
        const newTextList =
            index === undefined
                ? textList.map((d) => ({ ...d, selected: false }))
                : textList.map((d, dIdx) => ({ ...d, selected: dIdx === index }));
        if (onSelect) {
            onSelect(e, newTextList, moreProps);
        }
    };
}
