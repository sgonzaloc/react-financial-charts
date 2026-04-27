import * as React from "react";
import { MACDSeries } from "../../../../series/src/MACDSeries";
import MACDIndicator from "./MacdIndicator";

export default {
    title: "Technical Indicators/MACD",
    component: MACDSeries,
};

export const basic = () => <MACDIndicator />;
