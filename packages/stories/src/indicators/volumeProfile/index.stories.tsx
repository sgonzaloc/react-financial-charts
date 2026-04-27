import * as React from "react";
import { VolumeProfileSeries } from "../../../../series/src/VolumeProfileSeries";
import VolumeProfile from "./VolumeProfile";

export default {
    title: "Technical Indicators/Volume Profile",
    component: VolumeProfileSeries,
};

export const basic = () => <VolumeProfile />;
