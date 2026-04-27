import * as React from "react";
import { SARSeries } from "../../../../series/src/SARSeries";
import SARIndicator from "./SarIndicator";

export default {
    title: "Technical Indicators/SAR",
    component: SARSeries,
};

export const basic = () => <SARIndicator />;
