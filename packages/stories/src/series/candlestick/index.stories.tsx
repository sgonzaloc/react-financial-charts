import * as React from "react";
import { CandlestickSeries } from "../../../../series/src/CandlestickSeries";
import { Daily, Intraday } from "./BasicCandlestick";

export default {
    component: CandlestickSeries,
    title: "Chart Types/Candles",
};

export const daily = () => <Daily />;

export const intraday = () => <Intraday />;
