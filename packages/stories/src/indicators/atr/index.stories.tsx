import * as React from "react";
import { atr } from "@react-financial-charts/indicators";
import ATRIndicator from "./AtrIndicator";

export default {
    title: "Technical Indicators/ATR",
    component: atr,
    parameters: {
        componentSubtitle: "Average True Range (ATR) is an indicator that measures volatility.",
    },
};

export const basic = () => <ATRIndicator />;
