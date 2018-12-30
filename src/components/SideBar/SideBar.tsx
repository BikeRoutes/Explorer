import * as React from "react";
import * as cx from "classnames";
import View from "View";
import { GeoJson, Feature } from "model";

import "./sideBar.scss";
import { Option } from "fp-ts/lib/Option";

const Route = (props: {
  feature: Feature;
  onClick: () => void;
  isSelected: boolean;
}) => (
  <View
    className={cx("route", { "is-selected": props.isSelected })}
    column
    onClick={props.onClick}
  >
    <View className="name">{props.feature.properties.name}</View>
    <View className="distance" vAlignContent="bottom">
      <label>Distance</label> {props.feature.properties.length} km
    </View>
    <View className="elevation" vAlignContent="bottom">
      <label>Elevation</label> {props.feature.properties.elevationGain} m
    </View>

    <View className="actions">
      <a
        className="github-button"
        href={props.feature.properties.url}
        target="_blank"
      >
        See on GitHub
      </a>
    </View>
  </View>
);

type Props = {
  routes: GeoJson[];
  onRouteClick: (route: GeoJson) => void;
  selectedRoute: Option<GeoJson>;
};

class SideBar extends React.Component<Props> {
  render() {
    return (
      <View className="side-bar" column shrink={false}>
        <h2>Routes</h2>
        {this.props.routes.map((route, index) => (
          <Route
            key={index}
            feature={route.features[0]}
            onClick={() => this.props.onRouteClick(route)}
            isSelected={
              this.props.selectedRoute.isSome() &&
              this.props.selectedRoute.value === route
            }
          />
        ))}
      </View>
    );
  }
}

export default SideBar;
