import * as React from "react";
import cx from "classnames";
import View from "../View";
import { Route as RouteT, viewToLocation } from "../../model";
import { Option, some } from "fp-ts/lib/Option";
import Button from "@buildo/bento/components/Button";
import { doUpdateLocation } from "../../commands";
import { declareCommands } from "react-avenger";

import "./sideBar.scss";
import "@buildo/bento/components/button.scss";

const Route = (props: {
  route: RouteT;
  onClick: () => void;
  isSelected: boolean;
  onDetailsClick: (e: React.SyntheticEvent<HTMLDivElement, Event>) => void;
}) => (
  <View
    className={cx("route", { "is-selected": props.isSelected })}
    column
    onClick={props.onClick}
    shrink={false}
  >
    <View className="name">{props.route.properties.name}</View>
    <View className="distance" vAlignContent="bottom">
      <label>Distance</label> {props.route.properties.length} km
    </View>
    <View className="min-elevation" vAlignContent="bottom">
      <label>Elev (min)</label>{" "}
      {Math.round(props.route.properties.minElevation)} m
    </View>
    <View className="max-elevation" vAlignContent="bottom">
      <label>Elev (max)</label>{" "}
      {Math.round(props.route.properties.maxElevation)} m
    </View>

    <View className="actions">
      <Button size="tiny" label="Details" onClick={props.onDetailsClick} />
    </View>
  </View>
);

const commands = declareCommands({ doUpdateLocation });

type Props = typeof commands.Props & {
  routes: RouteT[];
  onRouteClick: (route: RouteT) => void;
  selectedRoute: Option<RouteT>;
};

class SideBar extends React.PureComponent<Props> {
  render() {
    return (
      <View className="side-bar" column shrink={false}>
        <View column shrink={false} className="navigationGpx">
          <h2>Navigation (GPX)</h2>

          <input
            type="file"
            accept=".gpx"
            onChange={e => {
              const file = e.target.files![0];

              const reader = new FileReader();
              reader.addEventListener("load", event => {
                (window as any).gpxFile = event.target!.result;

                this.props.doUpdateLocation(
                  viewToLocation({ view: "navigation", routeId: some("gpx") })
                );
              });
              reader.readAsText(file);
            }}
          />
        </View>

        <View column shrink={false} className="routes">
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
              onDetailsClick={e => {
                e.stopPropagation();
                this.props.doUpdateLocation(
                  viewToLocation({ view: "details", routeId: some(route.id) })
                );
              }}
            />
          ))}
        </View>
      </View>
    );
  }
}

export default commands(SideBar);
