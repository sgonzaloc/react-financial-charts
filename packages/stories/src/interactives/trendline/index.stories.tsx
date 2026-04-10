import * as React from "react";
import TrendLineInteractive from "./TrendLineInteractive";

export default {
    title: "Interactives/Trend Line",
};

export const Line = () => <TrendLineInteractive type="LINE" />;

export const XLine = () => <TrendLineInteractive type="XLINE" />;

export const Ray = () => <TrendLineInteractive type="RAY" />;
