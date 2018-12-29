import * as React from "react";
import View from "View";
import { GeoJson } from "model";

import "./popup.scss";

type Feature = GeoJson["features"][number];

export default (props: { feature: Feature }) => (
  <View className="popup" column>
    <View className="name">{props.feature.properties.name}</View>
    <View className="distance">
      <label>Distance</label> {props.feature.properties.length} km
    </View>
    <View className="elevation">
      <label>Elevation</label> {props.feature.properties.elevationGain} m
    </View>
    <a
      className="github-button"
      href={props.feature.properties.url}
      target="_blank"
    >
      See on GitHub
    </a>
  </View>
);
