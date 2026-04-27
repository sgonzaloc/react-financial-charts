import * as React from "react";
import { KagiSeries } from "../../../../series/src/KagiSeries";
import { Daily, Intraday } from "./BasicKagiSeries";

export default {
    component: KagiSeries,
    title: "Chart Types/Kagi",
};

export const daily = () => <Daily />;

export const intraday = () => <Intraday />;
