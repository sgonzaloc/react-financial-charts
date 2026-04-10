import * as React from "react";
import { getMouseCanvas, GenericChartComponent } from "@react-financial-charts/core";

export interface TextProps {
    readonly children: string;
    readonly fontFamily: string;
    readonly fontSize: number;
    readonly fillStyle: string;
    readonly selected?: boolean;
    readonly xyProvider: (moreProps: any) => number[];
    readonly textAnchor?: "start" | "middle" | "end";
}

export class Text extends React.Component<TextProps> {
    public static defaultProps = {
        selected: false,
        textAnchor: "start",
    };

    public render() {
        const { selected } = this.props;

        return (
            <GenericChartComponent
                isHover={this.isHover}
                selected={selected}
                canvasToDraw={getMouseCanvas}
                canvasDraw={this.drawOnCanvas}
                drawOn={["mousemove", "pan", "drag"]}
            />
        );
    }

    private readonly isHover = () => {
        return false;
    };

    private readonly drawOnCanvas = (ctx: CanvasRenderingContext2D, moreProps: any) => {
        const { xyProvider, fontFamily, fontSize, fillStyle, children, textAnchor } = this.props;

        const [x, y] = xyProvider(moreProps);

        if (textAnchor === "middle") {
            ctx.font = `${fontSize}px ${fontFamily}`;
            const textWidth = ctx.measureText(children).width;
            x = x - textWidth / 2;
        } else if (textAnchor === "end") {
            ctx.font = `${fontSize}px ${fontFamily}`;
            const textWidth = ctx.measureText(children).width;
            x = x - textWidth;
        }

        ctx.font = `${fontSize}px ${fontFamily}`;
        ctx.fillStyle = fillStyle;

        ctx.beginPath();
        ctx.fillText(children, x, y);
    };
}
