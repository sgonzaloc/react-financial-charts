import * as React from "react";
import StockChart, { MinutesStockChart, SecondsStockChart } from "./TimeResolutions";

export default {
    component: StockChart,
    title: "Handling Data & Edge Cases/Time Resolutions",
};

export const daily = () => <StockChart />;

export const minutes = () => <MinutesStockChart dateTimeFormat="%H:%M" />;

export const seconds = () => <SecondsStockChart dateTimeFormat="%H:%M:%S" />;
