import * as React from "react";
import View from "View";
import { GeoJson } from "model";

import "./popup.scss";

type Feature = GeoJson["features"][number];

export default (props: { feature: Feature }) => (
  <View className="popup" column>
    <View className="name">{props.feature.properties.name}</View>
    <View className="distance" vAlignContent="bottom">
      <label>Distance</label> {props.feature.properties.length} km
    </View>
    <View className="elevation" vAlignContent="bottom">
      <label>Elevation</label> {props.feature.properties.elevationGain} m
    </View>
  </View>
);
