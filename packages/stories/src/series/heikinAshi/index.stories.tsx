import * as React from "react";
import { CandlestickSeries } from "../../../../series/src/CandlestickSeries";
import { Daily, Intraday } from "./BasicHeikinAshiSeries";

export default {
    component: CandlestickSeries,
    title: "Chart Types/Heikin Ashi",
};

export const daily = () => <Daily />;

export const intraday = () => <Intraday />;
