import * as React from "react";
import { ElderRaySeries } from "../../../../series/src/ElderRaySeries";
import ElderRayIndicator from "./ElderRayIndicator";

export default {
    title: "Technical Indicators/Elder Ray",
    component: ElderRaySeries,
};

export const basic = () => <ElderRayIndicator />;
