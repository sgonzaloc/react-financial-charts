import * as React from "react";
import AutoSizer, { Props as AutoSizerProps } from "react-virtualized-auto-sizer";

export interface WithSizeProps {
    readonly width: number;
    readonly height: number;
}

type AutoSizerChildParams = { height: number; width: number };

export const withSize = (props?: Omit<AutoSizerProps, "children">) => {
    return <TProps extends WithSizeProps>(OriginalComponent: React.ComponentClass<TProps>) => {
        return class WithSize extends React.Component<Omit<TProps, "width" | "height">> {
            public render() {
                const { disableHeight, disableWidth, ...restProps } = props || {};
                return (
                    <AutoSizer {...restProps}>
                        {({ height, width }: AutoSizerChildParams) => {
                            return <OriginalComponent {...(this.props as TProps)} height={height} width={width} />;
                        }}
                    </AutoSizer>
                );
            }
        };
    };
};
