import * as React from "react";
import { declareQueries } from "@buildo/bento/data";
import { route } from "../../queries";
import View from "../View";
import Map from "../Map/Map";
import { none, some, Option } from "fp-ts/lib/Option";
import NoSleep from "nosleep.js";
import { declareCommands } from "react-avenger";
import { doUpdateLocation } from "../../commands";
import { viewToLocation } from "../../model";
import ElevationProfile from "../ElevationProfile";
import * as mapboxgl from "mapbox-gl";

import "react-responsive-carousel/lib/styles/carousel.min.css";
import "./navigation.scss";

const noSleep = new NoSleep();

const queries = declareQueries({ route });
const commands = declareCommands({ doUpdateLocation });

type Props = typeof queries.Props & typeof commands.Props;

type State = {
  position: Option<Position>;
};

class Navigation extends React.Component<Props, State> {
  map: Option<mapboxgl.Map> = none;
  positionWatch: Option<number> = none;

  state: State = {
    position: none
  };

  componentDidMount() {
    noSleep.enable();

    this.positionWatch = some(
      navigator.geolocation.watchPosition(position => {
        localStorage.setItem("start_lat", String(position.coords.latitude));
        localStorage.setItem("start_lng", String(position.coords.longitude));

        this.setState({
          position: some(position)
        });
      })
    );
  }

  componentWillUnmount() {
    noSleep.disable();

    this.positionWatch.map(positionWatch =>
      navigator.geolocation.clearWatch(positionWatch)
    );
  }

  getClosestRoutePoint = (position: Position) => {
    return this.map.chain(map => {
      return this.props.route.fold(
        none,
        () => none,
        route =>
          route.map(route => {
            return route.geometry.coordinates.reduce(
              (acc, coordinates, index) => {
                const point = map.project(
                  new mapboxgl.LngLat(
                    position.coords.longitude,
                    position.coords.latitude
                  )
                );
                const routePoint = map.project(
                  new mapboxgl.LngLat(coordinates[0], coordinates[1])
                );
                const distance = Math.sqrt(
                  Math.pow(Math.abs(point.x - routePoint.x), 2) +
                    Math.pow(Math.abs(point.y - routePoint.y), 2)
                );
                return distance < 200 && distance < acc.distance
                  ? { distance, index }
                  : acc;
              },
              {
                distance: Infinity,
                index: -1
              }
            );
          })
      );
    });
  };

  render() {
    return this.props.route.fold(
      null,
      () => null,
      route => {
        if (route.isNone()) {
          return null;
        } else {
          return (
            <View className="navigation" height="100%" grow column>
              <View
                className="exit-navigation"
                onClick={() => {
                  this.props.doUpdateLocation(
                    viewToLocation({
                      view: "details",
                      routeId: some(route.value.id)
                    })
                  );
                }}
                hAlignContent="center"
                vAlignContent="center"
              >
                <svg width="29" height="29" viewBox="0 0 29 29">
                  <path
                    fill="black"
                    d="M18.5 16c-1.75 0-2.5.75-2.5 2.5V24h1l1.5-3 5.5 4 1-1-4-5.5 3-1.5v-1h-5.5zM13 18.5c0-1.75-.75-2.5-2.5-2.5H5v1l3 1.5L4 24l1 1 5.5-4 1.5 3h1v-5.5zm3-8c0 1.75.75 2.5 2.5 2.5H24v-1l-3-1.5L25 5l-1-1-5.5 4L17 5h-1v5.5zM10.5 13c1.75 0 2.5-.75 2.5-2.5V5h-1l-1.5 3L5 4 4 5l4 5.5L5 12v1h5.5z"
                  ></path>
                </svg>
              </View>

              <View className="elevation-profile-wrapper">
                <ElevationProfile
                  route={route.value}
                  activeRoutePointIndex={this.state.position
                    .chain(position =>
                      this.getClosestRoutePoint(position).map(
                        activeRoutePointIndex => activeRoutePointIndex.index
                      )
                    )
                    .toUndefined()}
                />
              </View>

              <View shrink={false} className="map-wrapper">
                <Map
                  routes={[route.value]}
                  startPosition="firstRoute"
                  navigating
                  hoveredRoute={route} // fixed blue color that is easily visible
                  innerRef={map => {
                    if (this.map.isNone()) {
                      this.map = map;
                      this.forceUpdate();
                    }
                  }}
                  // fake props
                  selectedRoute={none}
                  onRouteHover={() => {}}
                  onRouteSelect={() => {}}
                />
              </View>
            </View>
          );
        }
      }
    );
  }
}

export default commands(queries(Navigation));
