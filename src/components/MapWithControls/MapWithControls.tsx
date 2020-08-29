import * as React from "react";
import * as ReactDOM from "react-dom";
import cx from "classnames";
import View from "../View";
import Map, { Props as MapProps } from "../Map/Map";
import { none, some, Option, fromNullable } from "fp-ts/lib/Option";
import NoSleep from "nosleep.js";
import ElevationProfile from "../ElevationProfile";
import mapboxgl from "mapbox-gl";
import { Route } from "../../model";
import throttle from "lodash/throttle";
import CheapRuler from "cheap-ruler";
import { identity } from "fp-ts/lib/function";

import "./mapWithControls.scss";

/* eslint-disable array-callback-return */

const noSleep = new NoSleep();

type Props = Omit<MapProps, "navigating"> & {
  noSleep: boolean;
  geoLocateControl: boolean;
  altimeter: boolean;
  speedometer: boolean;
  navigatingRoute: Option<Route>;
  altitudeControl: boolean;
  scale: boolean;
};

type State = {
  position: Option<Position>;
  deviceBearing: Option<number>;
  showElevationProfile: boolean;
  geoLocationState:
    | "Off"
    | "North"
    | "NorthTracking"
    | "Compass"
    | "CompassTracking";
};

class MapWithControls extends React.Component<Props, State> {
  map: Option<mapboxgl.Map> = none;
  positionWatch: Option<number> = none;

  compassIcon: React.RefObject<SVGSVGElement> = React.createRef();

  interacting: boolean = false;

  userLocationMarker: Option<mapboxgl.Marker> = none;

  state: State = {
    position: none,
    deviceBearing: none,
    showElevationProfile: false,
    geoLocationState: "Off"
  };

  componentDidMount() {
    if (this.props.noSleep) {
      noSleep.enable();
    }

    this.positionWatch = some(
      navigator.geolocation.watchPosition(
        position => {
          localStorage.setItem("start_lat", String(position.coords.latitude));
          localStorage.setItem("start_lng", String(position.coords.longitude));

          this.setState({ position: some(position) });
        },
        () => {},
        { enableHighAccuracy: true }
      )
    );

    if (this.props.navigatingRoute.isSome())
      window.addEventListener(
        "deviceorientationabsolute",
        this.onDeviceOrientation,
        true
      );

    if (this.props.startPosition === "userLocation") {
      this.setState({ geoLocationState: "NorthTracking" });
    }
  }

  componentWillUnmount() {
    if (this.props.noSleep) {
      noSleep.disable();
    }

    this.positionWatch.map(positionWatch =>
      navigator.geolocation.clearWatch(positionWatch)
    );

    window.removeEventListener(
      "deviceorientationabsolute",
      this.onDeviceOrientation,
      true
    );
  }

  getClosestRoutePoint = (
    position: Position
  ): Option<{ distance: number; index: number }> => {
    return this.props.navigatingRoute.map(route => {
      const hPixels = window.innerWidth * window.devicePixelRatio;
      const steps = hPixels / 5;

      const closestRoutePoint = route.geometry.coordinates
        .filter(
          (_, i) =>
            i %
              Math.max(
                1,
                Math.round(route.geometry.coordinates.length / steps)
              ) ===
            0
        )
        .reduce(
          (acc, coordinates, index) => {
            const userLat = coordinates[1];
            const userLng = coordinates[0];

            const ruler = new CheapRuler(userLat, "meters");

            const distance = ruler.distance(
              [userLat, userLng],
              [position.coords.latitude, position.coords.longitude]
            );

            return distance < 200 && distance < acc.distance
              ? { distance, index, coordinates }
              : acc;
          },
          {
            distance: Infinity,
            index: -1
          }
        );

      return closestRoutePoint;
    });
  };

  updateInnerRef = (map: mapboxgl.Map) => {
    this.props.innerRef && this.props.innerRef(map);

    if (this.map.isNone()) {
      this.map = some(map);

      if (this.props.scale) {
        map.addControl(new mapboxgl.ScaleControl());
      }

      map.on("touchstart", () => {
        this.interacting = true;
      });

      map.on("touchend", () => {
        this.interacting = false;
      });

      map.on("dragstart", () => {
        if (this.state.geoLocationState === "NorthTracking") {
          this.setState({
            geoLocationState: "North"
          });
        } else if (this.state.geoLocationState === "CompassTracking") {
          this.setState({
            geoLocationState: "Compass"
          });
        }
      });

      map.on("dragend", () => {
        this.props.onSortRoutes && this.props.onSortRoutes();
      });
    }
  };

  rotateUserLocationDot = () => {
    this.map.map(map => {
      this.state.deviceBearing.map(bearing => {
        fromNullable(document.getElementById("userLocationDotWrapper")).map(
          htmlElement => {
            const degree =
              this.state.geoLocationState === "CompassTracking"
                ? 0
                : bearing - map.getBearing();

            const transformRotation = `rotate(${degree}deg)`;

            htmlElement.style.transform = transformRotation;
          }
        );
      });
    });
  };

  updateUserLocationDotMarker = () => {
    this.map.map(map => {
      this.state.position.map(position => {
        const lngLat: mapboxgl.LngLatLike = {
          lng: position.coords.longitude,
          lat: position.coords.latitude
        };

        if (
          this.state.geoLocationState !== "Off" &&
          this.userLocationMarker.isNone()
        ) {
          // ADD MARKER
          const element = document.createElement("div");
          element.className = "userLocationDotMarker";

          ReactDOM.render(
            <View column id="userLocationDotWrapper">
              <View shrink={false} className="triangle"></View>
              <View shrink={false} className="userLocationDot"></View>
            </View>,
            element
          );

          const marker: mapboxgl.Marker = new mapboxgl.Marker({
            element
          }).setLngLat(lngLat);

          marker.addTo(map);

          this.userLocationMarker = some(marker);
        } else if (
          this.state.geoLocationState !== "Off" &&
          this.userLocationMarker.isSome()
        ) {
          // UPDATE MARKER
          this.userLocationMarker.value.setLngLat(lngLat);
        } else if (
          this.state.geoLocationState === "Off" &&
          this.userLocationMarker.isSome()
        ) {
          // REMOVE MARKER
          this.userLocationMarker.value.remove();
          this.userLocationMarker = none;
        }
      });
    });
  };

  centerOnUserLocation = (options: {
    bearing: number;
    animate: boolean;
    zoom?: number;
  }) => {
    this.map.map(map => {
      this.state.position.map(position => {
        const animationDurationMS = 1000;

        map.flyTo({
          duration: animationDurationMS,
          center: {
            lng: position.coords.longitude,
            lat: position.coords.latitude
          },
          essential: true,
          ...options
        });

        if (options.animate) {
          // smooth animation
          this.interacting = true;
          setTimeout(() => (this.interacting = false), animationDurationMS + 5);
        }
      });
    });
  };

  onNorthTrackingClick = () => {
    if (this.state.geoLocationState !== "NorthTracking") {
      this.setState({ geoLocationState: "NorthTracking" });
    } else if (this.state.geoLocationState === "NorthTracking") {
      this.setState({ geoLocationState: "Off" });
    }
  };

  onCompassTrackingClick = () => {
    if (this.state.geoLocationState !== "CompassTracking") {
      this.setState({ geoLocationState: "CompassTracking" });
    } else if (this.state.geoLocationState === "CompassTracking") {
      this.setState({ geoLocationState: "Off" });
    }
  };

  onDeviceOrientation = throttle((e: DeviceOrientationEvent) => {
    this.setState(
      {
        deviceBearing: fromNullable(e.alpha).map(alpha => -alpha) // bearing is the opposite of alpha
      },
      this.rotateUserLocationDot
    );
  }, 16);

  componentDidUpdate(_: unknown, prevState: State) {
    this.updateUserLocationDotMarker();

    if (!this.interacting && this.state.geoLocationState === "NorthTracking") {
      this.centerOnUserLocation({
        bearing: 0,
        animate: prevState.geoLocationState !== "NorthTracking"
        // zoom:
        //   prevState.geoLocationState === "Off" &&
        //   this.props.navigatingRoute.isSome()
        //     ? 15
        //     : undefined
      });
    }

    if (
      !this.interacting &&
      this.state.geoLocationState === "CompassTracking"
    ) {
      this.centerOnUserLocation({
        bearing: this.state.deviceBearing.fold(0, identity),
        animate: prevState.geoLocationState !== "CompassTracking"
        // zoom:
        //   prevState.geoLocationState === "Off" &&
        //   this.props.navigatingRoute.isSome()
        //     ? 15
        //     : undefined
      });
    }
  }

  render() {
    const speed = Math.round(
      this.state.position.fold(0, pos => {
        // speed is in m/s
        return pos.coords.speed ? (pos.coords.speed / 1000) * 3600 : 0;
      })
    );

    const altitude = Math.round(
      this.state.position.fold(0, pos => pos.coords.altitude || 0)
    );

    const showElevationProfile =
      this.state.showElevationProfile && this.props.navigatingRoute.isSome();

    return (
      <View
        className={cx("mapWithControls", {
          showElevationProfile,
          showScale: this.props.scale
        })}
        height="100%"
        grow
        column
      >
        <View className="info-wrapper">
          {this.props.speedometer && (
            <View
              className="speed-wrapper control-button"
              column
              vAlignContent="center"
              hAlignContent="center"
            >
              {speed}
              <span className="unit">km/h</span>
            </View>
          )}

          {this.props.altimeter && (
            <View
              className="altitude-wrapper control-button"
              column
              vAlignContent="center"
              hAlignContent="center"
            >
              {altitude}
              <span className="unit">msl</span>
            </View>
          )}
        </View>

        <View column className="controls-wrapper">
          {this.props.altitudeControl && (
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
                  fill={this.state.showElevationProfile ? "#5bb3e0" : "#393939"}
                />
              </svg>
            </View>
          )}
        </View>

        {this.props.geoLocateControl && (
          <View className="tracking-controls">
            <View
              className="geo-locate control-button"
              vAlignContent="center"
              hAlignContent="center"
              onClick={this.onNorthTrackingClick}
            >
              {this.state.geoLocationState === "North" ? (
                <svg width="29" height="29" viewBox="0 0 20 20" fill="#5bb3e0">
                  <path d="M10 4C9 4 9 5 9 5v.1A5 5 0 005.1 9H5s-1 0-1 1 1 1 1 1h.1A5 5 0 009 14.9v.1s0 1 1 1 1-1 1-1v-.1a5 5 0 003.9-3.9h.1s1 0 1-1-1-1-1-1h-.1A5 5 0 0011 5.1V5s0-1-1-1zm0 2.5a3.5 3.5 0 110 7 3.5 3.5 0 110-7z" />
                </svg>
              ) : (
                <svg
                  width="29"
                  height="29"
                  viewBox="0 0 20 20"
                  fill={
                    this.state.geoLocationState === "NorthTracking"
                      ? "#5bb3e0"
                      : "#393939"
                  }
                >
                  <path d="M10 4C9 4 9 5 9 5v.1A5 5 0 005.1 9H5s-1 0-1 1 1 1 1 1h.1A5 5 0 009 14.9v.1s0 1 1 1 1-1 1-1v-.1a5 5 0 003.9-3.9h.1s1 0 1-1-1-1-1-1h-.1A5 5 0 0011 5.1V5s0-1-1-1zm0 2.5a3.5 3.5 0 110 7 3.5 3.5 0 110-7z" />
                  <circle cx="10" cy="10" r="2" />
                </svg>
              )}
            </View>

            <View
              className="compass-reset control-button"
              vAlignContent="center"
              hAlignContent="center"
              onClick={this.onCompassTrackingClick}
            >
              <svg
                width="29"
                height="29"
                xmlns="http://www.w3.org/2000/svg"
                fill="#333333"
                ref={this.compassIcon}
              >
                <path d="M10.5 14l4-8 4 8h-8z" />
                <path d="M10.5 16l4 8 4-8h-8z" fill="#e1e1e1" />
              </svg>
            </View>
          </View>
        )}

        {showElevationProfile && this.props.navigatingRoute.isSome() && (
          <View className="elevation-profile-wrapper">
            <ElevationProfile
              route={this.props.navigatingRoute.value}
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

        <View grow>
          <Map
            routes={this.props.routes}
            startPosition={this.props.startPosition}
            navigating={this.props.navigatingRoute.isSome()}
            innerRef={this.updateInnerRef}
            hoveredRoute={this.props.hoveredRoute}
            selectedRoute={this.props.selectedRoute}
            onRouteHover={this.props.onRouteHover}
            onRouteSelect={this.props.onRouteSelect}
            onSortRoutes={this.props.onSortRoutes}
          />
        </View>
      </View>
    );
  }
}

export default MapWithControls;
