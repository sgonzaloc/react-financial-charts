import * as React from "react";
import { getXValue } from "@react-financial-charts/core/lib/utils/ChartDataUtil";
import { saveNodeType } from "../utils";
import { HoverTextNearMouse, Text as TextComponent } from "../components";
import { noop } from "@react-financial-charts/core";

export interface EachTextProps {
    readonly index?: number;
    readonly position?: any;
    readonly bgFill?: string;
    readonly bgStrokeWidth?: number;
    readonly bgStroke?: string;
    readonly textFill?: string;
    readonly fontWeight?: string;
    readonly fontFamily?: string;
    readonly fontStyle?: string;
    readonly fontSize?: number;
    readonly text: string;
    readonly selected: boolean;
    readonly onDrag?: (e: React.MouseEvent, index: number | undefined, xyValue: number[]) => void;
    readonly onDragComplete?: (e: React.MouseEvent, moreProps: any) => void;
    readonly onEdit?: (e: KeyboardEvent, index: number, newText: string) => void;
    readonly hoverText: {
        readonly enable: boolean;
        readonly fontFamily: string;
        readonly fontSize: number;
        readonly fill: string;
        readonly text: string;
        readonly selectedText: string;
        readonly bgFill: string;
        readonly bgOpacity: number;
        readonly bgWidth: number | string;
        readonly bgHeight: number | string;
    };
    readonly onSelect?: (e: React.MouseEvent, index: number | undefined, moreProps: any) => void;
    readonly isEditingGlobal?: boolean;
    readonly onRequestEdit?: (index: number) => void;
    readonly onEndEdit?: () => void;
}

interface EachTextState {
    hover: boolean;
    editingText: string;
    cursorVisible: boolean;
}

export class EachText extends React.Component<EachTextProps, EachTextState> {
    public static defaultProps = {
        bgStrokeWidth: 1,
        bgFill: "transparent",
        textFill: "#000000",
        fontWeight: "normal",
        fontFamily: "-apple-system, system-ui, Roboto, 'Helvetica Neue', Ubuntu, sans-serif",
        fontStyle: "normal",
        fontSize: 12,
        selected: false,
        hoverText: {
            ...HoverTextNearMouse.defaultProps,
            enable: true,
            bgHeight: "auto",
            bgWidth: "auto",
            text: "Click to select object",
        },
        onSelect: noop,
        onEdit: noop,
    };

    private dragStartPosition: any;
    private saveNodeType: any;
    private cursorInterval: number | null = null;

    public constructor(props: EachTextProps) {
        super(props);
        this.handleHover = this.handleHover.bind(this);
        this.handleDragStart = this.handleDragStart.bind(this);
        this.handleDrag = this.handleDrag.bind(this);
        this.handleDoubleClick = this.handleDoubleClick.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
        this.saveNodeType = saveNodeType.bind(this);
        this.state = {
            hover: false,
            editingText: props.text,
            cursorVisible: true,
        };
    }

    public componentDidUpdate(prevProps: EachTextProps) {
        if (this.props.isEditingGlobal && !prevProps.isEditingGlobal) {
            window.addEventListener("keydown", this.handleKeyPress);
            this.startCursorBlink();
        } else if (!this.props.isEditingGlobal && prevProps.isEditingGlobal) {
            window.removeEventListener("keydown", this.handleKeyPress);
            this.stopCursorBlink();
        }
    }

    public componentWillUnmount() {
        window.removeEventListener("keydown", this.handleKeyPress);
        this.stopCursorBlink();
    }

    private startCursorBlink() {
        this.cursorInterval = window.setInterval(() => {
            this.setState((prev) => ({ cursorVisible: !prev.cursorVisible }));
        }, 500);
    }

    private stopCursorBlink() {
        if (this.cursorInterval) {
            clearInterval(this.cursorInterval);
            this.cursorInterval = null;
        }
    }

    public render() {
        const {
            bgFill,
            bgStroke,
            bgStrokeWidth,
            textFill,
            fontFamily,
            fontSize,
            fontWeight,
            fontStyle,
            text,
            hoverText,
            selected,
            onDragComplete,
            isEditingGlobal,
        } = this.props;
        const { hover, editingText, cursorVisible } = this.state;

        const hoverHandler = {
            onHover: this.handleHover,
            onUnHover: this.handleHover,
        };

        const {
            enable: hoverTextEnabled,
            selectedText: hoverTextSelected,
            text: hoverTextUnselected,
            ...restHoverTextProps
        } = hoverText;

        const displayText = isEditingGlobal ? editingText : text;

        return (
            <g>
                <TextComponent
                    ref={this.saveNodeType("text")}
                    selected={selected || hover}
                    interactiveCursorClass="react-financial-charts-move-cursor"
                    {...hoverHandler}
                    onDragStart={this.handleDragStart}
                    onDrag={this.handleDrag}
                    onDragComplete={onDragComplete}
                    onDoubleClickWhenHover={this.handleDoubleClick}
                    position={this.props.position}
                    bgFillStyle={bgFill}
                    bgStroke={bgStroke || textFill}
                    bgStrokeWidth={bgStrokeWidth}
                    textFill={textFill}
                    fontFamily={fontFamily}
                    fontStyle={fontStyle}
                    fontWeight={fontWeight}
                    fontSize={fontSize}
                    text={displayText}
                    showCursor={isEditingGlobal && cursorVisible}
                    cursorCharIndex={isEditingGlobal ? editingText.length : -1}
                />
                <HoverTextNearMouse
                    show={hoverTextEnabled && hover && !isEditingGlobal}
                    {...restHoverTextProps}
                    text={selected ? hoverTextSelected : hoverTextUnselected}
                />
            </g>
        );
    }

    private readonly handleKeyPress = (e: KeyboardEvent) => {
        if (!this.props.isEditingGlobal) {
            return;
        }
        e.stopPropagation();

        const { onEdit, index } = this.props;
        let newText = this.state.editingText;

        if (e.key === "Backspace") {
            newText = newText.slice(0, -1);
        } else if (e.key.length === 1 && !e.ctrlKey && !e.altKey && !e.metaKey && e.key !== "Enter") {
            newText = newText + e.key;
        }

        if (newText !== this.state.editingText) {
            this.setState({ editingText: newText });
            if (onEdit) {
                onEdit(e, index!, newText);
            }
        }

        if (e.key === "Enter") {
            this.props.onEndEdit?.();
        }
    };

    private readonly handleDoubleClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();
        const { index, onRequestEdit } = this.props;
        onRequestEdit?.(index!);
        this.setState({
            editingText: this.props.text,
            cursorVisible: true,
        });
    };

    private readonly handleHover = (_: React.MouseEvent, moreProps: any) => {
        if (this.state.hover !== moreProps.hovering && !this.props.isEditingGlobal) {
            this.setState({ hover: moreProps.hovering });
        }
    };

    private readonly handleDrag = (e: React.MouseEvent, moreProps: any) => {
        const { index, onDrag } = this.props;
        if (onDrag === undefined) {
            return;
        }
        const {
            mouseXY: [, mouseY],
            chartConfig: { yScale },
            xAccessor,
            mouseXY,
            plotData,
            xScale,
        } = moreProps;
        const { dx, dy } = this.dragStartPosition;
        const xValue = xScale.invert(xScale(getXValue(xScale, xAccessor, mouseXY, plotData)) - dx);
        const xyValue = [xValue, yScale.invert(mouseY - dy)];
        onDrag(e, index, xyValue);
    };

    private readonly handleDragStart = (e: React.MouseEvent, moreProps: any) => {
        const { position, index, onSelect } = this.props;
        const { mouseXY } = moreProps;
        const {
            chartConfig: { yScale },
            xScale,
        } = moreProps;
        const [mouseX, mouseY] = mouseXY;
        const [textCX, textCY] = position;
        const dx = mouseX - xScale(textCX);
        const dy = mouseY - yScale(textCY);
        this.dragStartPosition = { position, dx, dy };
        if (onSelect) {
            onSelect(e, index, {});
        }
    };
}
