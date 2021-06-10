import * as React from "react";
import * as ReactDOM from "react-dom";
import cx from "classnames";
import { Marker } from "mapbox-gl";
import View from "../View";
import Map, { Props as MapProps } from "../Map/Map";
import { none, some, Option, fromNullable } from "fp-ts/lib/Option";
import NoSleep from "nosleep.js";
import ElevationProfile from "../ElevationProfile";
import { Route } from "../../model";
import throttle from "lodash/throttle";
import CheapRuler from "cheap-ruler";
import { identity } from "fp-ts/lib/function";
import DrinkingWaterMarker from "../DrinkingWaterMarker";

import "./mapWithControls.scss";

const mapboxgl = require("mapbox-gl/dist/mapbox-gl-csp");

/* eslint-disable array-callback-return */

const noSleep = new NoSleep();

type Props = Omit<MapProps, "navigating" | "showDrinkingWater"> & {
  noSleep: boolean;
  geoLocateControl: boolean;
  altimeter: boolean;
  speedometer: boolean;
  navigatingRoute: Option<Route>;
  altitudeControl: boolean;
  drinkingWaterControl: boolean;
  scale: boolean;
};

type State = {
  position: Option<Position>;
  deviceBearing: Option<number>;
  showElevationProfile: boolean;
  showDrinkingWater: boolean;
  geoLocationState:
    | "Off"
    | "North"
    | "NorthTracking"
    | "Compass"
    | "CompassTracking";
};

class MapWithControls extends React.Component<Props, State> {
  map: Option<mapboxgl.Map> = none;
  userLocationMarker: Option<mapboxgl.Marker> = none;

  positionWatch: Option<number> = none;
  positionWatchCheckInterval: Option<number> = none;

  compassIcon: React.RefObject<SVGSVGElement> = React.createRef();

  interacting: boolean = false;

  previousClosestRoutePoint: Option<{
    distance: number;
    index: number;
  }> = none;

  state: State = {
    position: none,
    deviceBearing: none,
    showElevationProfile: false,
    showDrinkingWater: false,
    geoLocationState:
      this.props.startPosition === "userLocation" ? "NorthTracking" : "Off"
  };

  startWatchingPosition = () => {
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

    this.positionWatchCheckInterval = some(
      window.setInterval(() => {
        this.state.position.map(position => {
          // no update for > 15s
          if (Date.now() - position.timestamp > 60000) {
            this.stopWatchingPosition();
            this.startWatchingPosition();
          }
        });
      }, 30000)
    );
  };

  stopWatchingPosition = () => {
    this.positionWatch.map(positionWatch =>
      navigator.geolocation.clearWatch(positionWatch)
    );

    this.positionWatchCheckInterval.map(positionWatchCheckInterval => {
      window.clearInterval(positionWatchCheckInterval);
    });
  };

  startWatchingDeviceOrientation = () => {
    window.addEventListener(
      "deviceorientationabsolute",
      this.onDeviceOrientation,
      true
    );
  };

  stopWatchingDeviceOrientation = () => {
    window.removeEventListener(
      "deviceorientationabsolute",
      this.onDeviceOrientation,
      true
    );
  };

  onVisibilityChange = () => {
    if (document.hidden) {
      this.stopWatchingDeviceOrientation();
      this.stopWatchingPosition();
    } else {
      this.startWatchingDeviceOrientation();
      if (this.state.geoLocationState !== "Off") {
        this.startWatchingPosition();
      }
    }
  };

  componentDidMount() {
    if (this.props.noSleep) {
      noSleep.enable();
    }

    this.startWatchingDeviceOrientation();
    if (this.state.geoLocationState !== "Off") {
      this.startWatchingPosition();
    }

    document.addEventListener("visibilitychange", this.onVisibilityChange);
  }

  componentWillUnmount() {
    if (this.props.noSleep) {
      noSleep.disable();
    }

    this.stopWatchingDeviceOrientation();
    this.stopWatchingPosition();

    document.removeEventListener("visibilitychange", this.onVisibilityChange);
  }

  getCoordinatesSubset = (
    coordinates: Route["geometry"]["coordinates"]
  ): Route["geometry"]["coordinates"] => {
    const hPixels = window.innerWidth * window.devicePixelRatio;
    const steps = hPixels / 5;

    return coordinates.filter(
      (_, i) => i % Math.max(1, Math.round(coordinates.length / steps)) === 0
    );
  };

  getClosestRoutePoint = (): Option<{ distance: number; index: number }> => {
    if (this.interacting) {
      return this.previousClosestRoutePoint;
    }

    return this.state.position.chain(position =>
      this.props.navigatingRoute.chain(route => {
        const closestRoutePoint = this.getCoordinatesSubset(
          route.geometry.coordinates
        ).reduce(
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

        this.previousClosestRoutePoint =
          closestRoutePoint.index >= 0 ? some(closestRoutePoint) : none;

        return this.previousClosestRoutePoint;
      })
    );
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

          const marker: Marker = new mapboxgl.Marker({
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

  compassHeading(alpha: number, beta: number, gamma: number): number {
    // https://stackoverflow.com/questions/18112729/calculate-compass-heading-from-deviceorientation-event-api
    // Convert degrees to radians
    const alphaRad = alpha * (Math.PI / 180);
    const betaRad = beta * (Math.PI / 180);
    const gammaRad = gamma * (Math.PI / 180);

    // Calculate equation components
    const cA = Math.cos(alphaRad);
    const sA = Math.sin(alphaRad);
    // const cB = Math.cos(betaRad);
    const sB = Math.sin(betaRad);
    const cG = Math.cos(gammaRad);
    const sG = Math.sin(gammaRad);

    // Calculate A, B, C rotation components
    const rA = -cA * sG - sA * sB * cG;
    const rB = -sA * sG + cA * sB * cG;
    // const rC = -cB * cG;

    // Calculate compass heading
    let compassHeading = Math.atan(rA / rB);

    // Convert from half unit circle to whole unit circle
    if (rB < 0) {
      compassHeading += Math.PI;
    } else if (rA < 0) {
      compassHeading += 2 * Math.PI;
    }

    // Convert radians to degrees
    compassHeading *= 180 / Math.PI;

    return compassHeading;
  }

  onDeviceOrientation = throttle((e: DeviceOrientationEvent) => {
    this.setState(
      {
        deviceBearing: fromNullable(e.alpha).chain(alpha =>
          fromNullable(e.beta).chain(beta =>
            fromNullable(e.gamma).map(gamma =>
              this.compassHeading(alpha, beta, gamma)
            )
          )
        )
      },
      this.rotateUserLocationDot
    );
  }, 16);

  componentDidUpdate(_: unknown, prevState: State) {
    // start watching position
    if (
      prevState.geoLocationState === "Off" &&
      this.state.geoLocationState !== "Off"
    ) {
      this.startWatchingPosition();
    }

    // stop watching position
    if (
      prevState.geoLocationState !== "Off" &&
      this.state.geoLocationState === "Off"
    ) {
      this.stopWatchingPosition();
    }

    // add, remove or update the position of the user location "dot" marker
    this.updateUserLocationDotMarker();

    // center the map on user position and point North
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

    // center the map on user position and point to the device "heading"
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
              style={{
                background: this.state.showElevationProfile
                  ? "#f8f8f8"
                  : undefined
              }}
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

          {this.props.drinkingWaterControl && (
            <View
              className="toggle-drinking-water control-button"
              onClick={() => {
                this.setState({
                  showDrinkingWater: !this.state.showDrinkingWater
                });
              }}
              hAlignContent="center"
              vAlignContent="center"
              style={{
                background: this.state.showDrinkingWater ? "#f8f8f8" : undefined
              }}
            >
              <DrinkingWaterMarker
                color={this.state.showDrinkingWater ? "#5bb3e0" : "#393939"}
              />
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
              style={{
                background:
                  this.state.geoLocationState === "NorthTracking"
                    ? "#f8f8f8"
                    : undefined
              }}
            >
              {this.state.geoLocationState === "North" ? (
                <svg
                  width="25px"
                  height="25px"
                  viewBox="0 0 511.48 511.48"
                  fill="#5bb3e0"
                >
                  <path d="M287.74,287.48c-8.832,0-16,7.168-16,16v60.224l-33.696-67.392c-0.352-0.704-0.96-1.152-1.376-1.76    c-0.672-0.96-1.28-1.952-2.176-2.752c-0.736-0.672-1.568-1.088-2.368-1.6c-0.928-0.576-1.792-1.216-2.816-1.6    c-0.992-0.384-2.016-0.448-3.072-0.608c-0.832-0.16-1.6-0.512-2.496-0.512c-0.192,0-0.352,0.096-0.544,0.096    c-0.992,0.032-1.92,0.384-2.912,0.608c-1.12,0.256-2.208,0.384-3.232,0.864c-0.16,0.064-0.32,0.032-0.48,0.128    c-0.704,0.352-1.152,0.96-1.792,1.408c-0.96,0.672-1.92,1.28-2.72,2.112c-0.704,0.768-1.152,1.632-1.664,2.496    c-0.544,0.864-1.152,1.696-1.536,2.688c-0.384,1.056-0.48,2.144-0.64,3.264c-0.128,0.8-0.48,1.504-0.48,2.336v128    c0,8.832,7.168,16,16,16c8.832,0,16-7.168,16-16v-60.224l33.696,67.36c0.16,0.32,0.512,0.448,0.704,0.768    c1.152,1.952,2.656,3.584,4.512,4.896c0.544,0.384,1.024,0.768,1.632,1.088c2.24,1.248,4.704,2.112,7.456,2.112    c2.432,0,4.672-0.608,6.72-1.568c0.128-0.064,0.288-0.032,0.448-0.096c0.704-0.352,1.152-0.96,1.792-1.408    c0.96-0.672,1.92-1.28,2.72-2.112c0.704-0.736,1.152-1.632,1.664-2.496c0.544-0.896,1.152-1.696,1.536-2.688    c0.384-1.056,0.48-2.176,0.672-3.264c0.096-0.832,0.448-1.536,0.448-2.368v-128C303.74,294.648,296.572,287.48,287.74,287.48z" />
                  <path d="M255.74,223.48c-79.392,0-144,64.608-144,144s64.608,144,144,144s144-64.608,144-144S335.132,223.48,255.74,223.48z     M255.74,479.48c-61.76,0-112-50.24-112-112s50.24-112,112-112s112,50.24,112,112S317.5,479.48,255.74,479.48z" />
                  <path d="M397.084,216.088L269.404,7.128c-5.824-9.504-21.504-9.504-27.328,0l-127.68,208.96    c-4.16,6.784-2.656,15.616,3.456,20.704c6.208,5.056,15.104,4.832,21.024-0.544c31.552-28.864,73.056-44.768,116.864-44.768    s85.312,15.904,116.864,44.768c3.072,2.784,6.944,4.192,10.816,4.192c3.584,0,7.232-1.216,10.176-3.648    C399.74,231.704,401.244,222.872,397.084,216.088z M255.74,159.48c-27.36,0-54.016,5.28-78.592,15.296L255.74,46.168    l78.592,128.608C309.756,164.76,283.1,159.48,255.74,159.48z" />
                </svg>
              ) : (
                <svg
                  width="25px"
                  height="25px"
                  viewBox="0 0 512 512"
                  fill={
                    this.state.geoLocationState === "NorthTracking"
                      ? "#5bb3e0"
                      : "#393939"
                  }
                >
                  <path
                    d="M397.344,216.64L269.664,7.68C266.752,2.912,261.568,0,256,0s-10.752,2.912-13.664,7.648l-127.68,208.96
			c-4.16,6.784-2.656,15.616,3.488,20.704c6.112,5.024,15.072,4.832,20.96-0.544C170.688,207.904,212.224,192,256,192
			s85.312,15.904,116.896,44.768c5.856,5.344,14.784,5.568,20.96,0.544C400,232.224,401.504,223.392,397.344,216.64z"
                  />

                  <path
                    d="M256,224c-79.392,0-144,64.608-144,144s64.608,144,144,144s144-64.608,144-144S335.392,224,256,224z M304,432
			c0,7.392-5.088,13.888-12.32,15.552c-1.248,0.32-2.464,0.448-3.68,0.448c-5.984,0-11.552-3.328-14.304-8.832L240,371.776V432
			c0,8.832-7.168,16-16,16c-8.832,0-16-7.168-16-16V304c0-7.392,5.12-13.888,12.32-15.552c7.136-1.856,14.656,1.792,17.984,8.416
			L272,364.224V304c0-8.832,7.168-16,16-16c8.832,0,16,7.168,16,16V432z"
                  />
                </svg>
              )}
            </View>

            <View
              className="compass-reset control-button"
              vAlignContent="center"
              hAlignContent="center"
              onClick={this.onCompassTrackingClick}
              style={{
                paddingTop: 5,
                paddingRight: 8,
                background:
                  this.state.geoLocationState === "NorthTracking"
                    ? "#f8f8f8"
                    : undefined
              }}
            >
              {this.state.geoLocationState === "Compass" ? (
                <svg height="25" viewBox="0 0 64 64" width="25" fill="#5bb3e0">
                  <path d="m32 28c-2.206 0-4 1.794-4 4s1.794 4 4 4 4-1.794 4-4-1.794-4-4-4zm0 6c-1.103 0-2-.897-2-2s.897-2 2-2 2 .897 2 2-.897 2-2 2z" />
                  <path d="m39.433 29.308-6.543-12.764c-.342-.668-1.438-.668-1.779 0l-6.543 12.764c-.016.03-.03.061-.042.093-.888 2.274-.648 4.782.657 6.88 1.325 2.128 3.533 3.473 6.06 3.688.249.02.502.031.757.031s.508-.011.76-.032c2.525-.215 4.733-1.56 6.058-3.688 1.306-2.098 1.545-4.605.657-6.88-.012-.032-.026-.062-.042-.092zm-2.313 5.915c-.989 1.588-2.64 2.592-4.528 2.753-.391.031-.796.031-1.183 0-1.89-.161-3.541-1.165-4.53-2.753-.96-1.542-1.145-3.381-.509-5.05l5.63-10.981 5.629 10.98c.636 1.67.451 3.509-.509 5.051z" />
                  <path d="m63 32c0-17.094-13.907-31-31-31s-31 13.906-31 31 13.907 31 31 31c4.451 0 8.736-.931 12.751-2.748 1.938 1.705 4.471 2.748 7.249 2.748 6.065 0 11-4.935 11-11 0-2.778-1.043-5.311-2.748-7.249 1.817-4.015 2.748-8.298 2.748-12.751zm-60 0c0-15.99 13.009-29 29-29s29 13.01 29 29c0 3.935-.775 7.729-2.291 11.302-1.055-.816-2.257-1.448-3.566-1.839 1.231-3 1.857-6.177 1.857-9.463 0-13.785-11.215-25-25-25s-25 11.215-25 25 11.215 25 25 25c3.286 0 6.462-.626 9.463-1.856.391 1.308 1.023 2.51 1.838 3.565-3.573 1.516-7.367 2.291-11.301 2.291-15.991 0-29-13.01-29-29zm38 20c0 .384.021.764.059 1.138-2.559 1.1-5.262 1.717-8.059 1.835v-2.973h-2v2.975c-11.888-.512-21.463-10.087-21.975-21.975h3.975v-2h-3.975c.512-11.888 10.087-21.463 21.975-21.975v3.975h2v-3.975c11.888.512 21.463 10.087 21.975 21.975h-3.975v2h3.973c-.118 2.797-.735 5.5-1.835 8.059-.374-.038-.754-.059-1.138-.059-6.065 0-11 4.935-11 11zm11 9c-4.962 0-9-4.037-9-9s4.038-9 9-9 9 4.037 9 9-4.038 9-9 9z" />
                  <path d="m54 53-4.2-5.6c-.258-.345-.708-.486-1.116-.349-.409.137-.684.518-.684.949v9h2v-6l4.2 5.6c.192.257.491.4.8.4.105 0 .212-.017.316-.052.409-.136.684-.517.684-.948v-9h-2z" />
                </svg>
              ) : (
                <svg
                  height="25"
                  viewBox="0 0 64 64"
                  width="25"
                  fill={
                    this.state.geoLocationState === "CompassTracking"
                      ? "#5bb3e0"
                      : "#393939"
                  }
                >
                  <circle cx="32" cy="32" r="2" />
                  <path d="m32 19.192-5.629 10.98c-.636 1.669-.451 3.508.509 5.05.989 1.588 2.64 2.592 4.53 2.753.387.031.792.031 1.183 0 1.888-.161 3.539-1.165 4.528-2.753.96-1.542 1.145-3.381.509-5.05zm0 16.808c-2.206 0-4-1.794-4-4s1.794-4 4-4 4 1.794 4 4-1.794 4-4 4z" />
                  <path d="m32 57c-13.785 0-25-11.215-25-25s11.215-25 25-25 25 11.215 25 25c0 3.286-.626 6.463-1.857 9.463 1.308.391 2.51 1.023 3.566 1.839 1.516-3.573 2.291-7.367 2.291-11.302 0-15.99-13.009-29-29-29s-29 13.01-29 29 13.009 29 29 29c3.934 0 7.728-.775 11.302-2.292-.815-1.055-1.447-2.257-1.838-3.565-3.002 1.231-6.178 1.857-9.464 1.857z" />
                  <path d="m54.975 31c-.512-11.888-10.087-21.463-21.975-21.975v3.975h-2v-3.975c-11.888.512-21.463 10.087-21.975 21.975h3.975v2h-3.975c.512 11.888 10.087 21.463 21.975 21.975v-2.975h2v2.973c2.797-.118 5.5-.735 8.059-1.835-.038-.374-.059-.754-.059-1.138 0-6.065 4.935-11 11-11 .384 0 .764.021 1.139.059 1.1-2.559 1.717-5.262 1.835-8.059h-3.974v-2zm-16.157 5.28c-1.325 2.128-3.533 3.473-6.058 3.688-.252.021-.505.032-.76.032s-.508-.011-.758-.032c-2.527-.215-4.735-1.56-6.06-3.688-1.306-2.098-1.545-4.605-.657-6.88.012-.032.026-.062.042-.093l6.543-12.764c.342-.668 1.438-.668 1.779 0l6.543 12.764c.016.03.03.061.042.093.889 2.275.65 4.783-.656 6.88z" />
                  <path d="m52 43c-4.962 0-9 4.037-9 9s4.038 9 9 9 9-4.037 9-9-4.038-9-9-9zm4 13c0 .431-.275.812-.684.948-.104.035-.211.052-.316.052-.309 0-.607-.144-.8-.4l-4.2-5.6v6h-2v-9c0-.431.275-.812.684-.948.408-.138.858.004 1.116.349l4.2 5.599v-6h2z" />
                </svg>
              )}
            </View>
          </View>
        )}

        {showElevationProfile && this.props.navigatingRoute.isSome() && (
          <View className="elevation-profile-wrapper">
            <ElevationProfile
              route={this.props.navigatingRoute.value}
              activeRoutePointIndex={this.getClosestRoutePoint()
                .map(activeRoutePointIndex => activeRoutePointIndex.index)

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
            showDrinkingWater={this.state.showDrinkingWater}
          />
        </View>
      </View>
    );
  }
}

export default MapWithControls;
