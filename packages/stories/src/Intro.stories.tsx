import * as React from "react";
import StockChart from "./features/StockChart";

export default {
    title: "Intro",
};

export const intro = () => (
    <div>
        <h1>React Financial Charts</h1>
        <p>Charts dedicated to finance.</p>
        <h2>Features</h2>
        <ul>
            <li>integrates multiple chart types</li>
            <li>technical indicators and overlays</li>
            <li>drawing objects</li>
        </ul>
        <StockChart />
    </div>
);
