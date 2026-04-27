import * as React from "react";
import { StochasticSeries } from "../../../../series/src/StochasticSeries";
import StoIndicator from "./StoIndicator";

export default {
    title: "Technical Indicators/Stochastic Oscillator",
    component: StochasticSeries,
};

export const basic = () => <StoIndicator />;
