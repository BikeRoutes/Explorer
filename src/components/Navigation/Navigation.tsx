import * as React from "react";
import { declareQueries } from "@buildo/bento/data";
import { route } from "../../queries";
import View from "../View";
import Map from "../Map/Map";
import { none, some, Option } from "fp-ts/lib/Option";
import NoSleep from "nosleep.js";
import { declareCommands } from "react-avenger";
import { doUpdateLocation } from "../../commands";
import ElevationProfile from "../ElevationProfile";
import mapboxgl from "mapbox-gl";
import memoize from "memoize-one";
import { Route } from "../../model";

import "react-responsive-carousel/lib/styles/carousel.min.css";
import "./navigation.scss";

const noSleep = new NoSleep();

const queries = declareQueries({ route });
const commands = declareCommands({ doUpdateLocation });

type Props = typeof queries.Props & typeof commands.Props;

type State = {
  position: Option<Position>;
  showElevationProfile: boolean;
};

class Navigation extends React.Component<Props, State> {
  map: Option<mapboxgl.Map> = none;
  positionWatch: Option<number> = none;

  state: State = {
    position: none,
    showElevationProfile: false
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

  updateInnerRef = (map: Option<mapboxgl.Map>) => {
    if (this.map.isNone()) {
      this.map = map;
      this.forceUpdate();
    }
  };

  getRoutes = memoize(
    (route: Route) => {
      return [route];
    },
    (newArgs: Route[], prevArgs: Route[]): boolean =>
      newArgs[0].id === prevArgs[0].id
  );

  render() {
    return this.props.route.fold(
      null,
      () => null,
      route => {
        if (route.isNone()) {
          return null;
        } else {
          const speed = Math.round(
            this.state.position.fold(0, pos => {
              // speed is in m/s
              return pos.coords.speed ? (pos.coords.speed / 1000) * 3600 : 0;
            })
          );

          const altitude = Math.round(
            this.state.position.fold(0, pos => pos.coords.altitude || 0)
          );

          return (
            <View className="navigation" height="100%" grow column>
              <View
                className="toggle-elevation control-button"
                onClick={() => {
                  this.setState({
                    showElevationProfile: !this.state.showElevationProfile
                  });
                }}
                hAlignContent="center"
                vAlignContent="center"
              >
                <svg width="29" height="29" viewBox="0 0 15 15">
                  <path
                    id="path5571"
                    d="M7.5,2C7.2,2,7.1,2.2,6.9,2.4&#10;&#9;l-5.8,9.5C1,12,1,12.2,1,12.3C1,12.8,1.4,13,1.7,13h11.6c0.4,0,0.7-0.2,0.7-0.7c0-0.2,0-0.2-0.1-0.4L8.2,2.4C8,2.2,7.8,2,7.5,2z&#10;&#9; M7.5,3.5L10.8,9H10L8.5,7.5L7.5,9l-1-1.5L5,9H4.1L7.5,3.5z"
                    fill={
                      this.state.showElevationProfile ? "#5bb3e0" : undefined
                    }
                  />
                </svg>
              </View>

              {this.state.showElevationProfile && (
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
              )}

              <View className="speed-wrapper" column hAlignContent="center">
                {speed}
                <span className="unit">km/h</span>
              </View>

              <View className="altitude-wrapper" column hAlignContent="center">
                {altitude}
                <span className="unit">msl</span>
              </View>

              <View shrink={false} className="map-wrapper">
                <Map
                  routes={this.getRoutes(route.value)}
                  startPosition="firstRoute"
                  navigating
                  innerRef={this.updateInnerRef}
                  hoveredRoute={none}
                  selectedRoute={none}
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
