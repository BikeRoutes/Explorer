import * as React from "react";
import View from "../View";
import { Route } from "../../model";

import "./popup.scss";

export default (props: { route: Route }) => (
  <View className="popup" column>
    <View className="name">{props.route.properties.name}</View>
    <View className="distance" vAlignContent="bottom">
      <label>Distance</label> {props.route.properties.length} km
    </View>
    <View className="elevation" vAlignContent="bottom">
      <label>Elevation</label> {props.route.properties.elevationGain} m
    </View>
  </View>
);
