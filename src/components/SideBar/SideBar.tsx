import * as React from "react";
import * as cx from "classnames";
import View from "View";
import { Route } from "model";

import "./sideBar.scss";
import { Option } from "fp-ts/lib/Option";

const Route = (props: {
  route: Route;
  onClick: () => void;
  isSelected: boolean;
}) => (
  <View
    className={cx("route", { "is-selected": props.isSelected })}
    column
    onClick={props.onClick}
  >
    <View className="name">{props.route.properties.name}</View>
    <View className="distance" vAlignContent="bottom">
      <label>Distance</label> {props.route.properties.length} km
    </View>
    <View className="elevation" vAlignContent="bottom">
      <label>Elevation</label> {props.route.properties.elevationGain} m
    </View>

    <View className="actions">
      <a
        className="github-button"
        href={props.route.properties.url}
        target="_blank"
      >
        See on GitHub
      </a>
    </View>
  </View>
);

type Props = {
  routes: Route[];
  onRouteClick: (route: Route) => void;
  selectedRoute: Option<Route>;
};

class SideBar extends React.Component<Props> {
  render() {
    return (
      <View className="side-bar" column shrink={false}>
        <h2>Routes</h2>
        {this.props.routes.map((route, index) => (
          <Route
            key={index}
            route={route}
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
