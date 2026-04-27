import * as React from "react";
import StockChart, { MinutesStockChart, SecondsStockChart } from "./Intro";

export default {
    component: StockChart,
    title: "Introduction/Intro",
};

export const daily = () => <StockChart />;

export const minutes = () => <MinutesStockChart dateTimeFormat="%H:%M" />;

export const seconds = () => <SecondsStockChart dateTimeFormat="%H:%M:%S" />;
