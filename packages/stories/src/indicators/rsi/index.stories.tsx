import * as React from "react";
import { RSISeries } from "../../../../series/src/RSISeries";
import RSIIndicator from "./RsiIndicator";

export default {
    title: "Technical Indicators/RSI",
    component: RSISeries,
};

export const basic = () => <RSIIndicator />;
