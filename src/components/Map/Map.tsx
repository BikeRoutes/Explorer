import * as React from "react";
import * as ReactDOMServer from "react-dom/server";
import * as ReactDOM from "react-dom";
import throttle from "lodash/throttle";
import mapboxgl from "mapbox-gl";
import Popup from "../Popup/Popup";
import Marker from "../Marker/Marker";
import View from "../View";
import { Option, none, some, fromNullable } from "fp-ts/lib/Option";
import { Route } from "../../model";
import mobileDetect from "@buildo/bento/utils/mobileDetect";
import { identity } from "fp-ts/lib/function";
import cx from "classnames";

import "mapbox-gl/dist/mapbox-gl.css";
import "./map.scss";

/* eslint-disable array-callback-return */

const md = mobileDetect();

const popupSettings: mapboxgl.PopupOptions = {
  closeButton: false,
  closeOnClick: false,
  offset: [0, -40],
  anchor: "bottom"
};

export const getRouteDistanceInPixels = (
  route: Route,
  lngLat: { lng: number; lat: number },
  map: mapboxgl.Map
): number => {
  return route.geometry.coordinates.reduce((acc, coordinates) => {
    const point = map.project(new mapboxgl.LngLat(lngLat.lng, lngLat.lat));
    const routePoint = map.project(
      new mapboxgl.LngLat(coordinates[0], coordinates[1])
    );
    const distance = Math.sqrt(
      Math.pow(Math.abs(point.x - routePoint.x), 2) +
        Math.pow(Math.abs(point.y - routePoint.y), 2)
    );
    return distance < acc ? distance : acc;
  }, Infinity);
};

export type Props = {
  routes: Route[];
  selectedRoute: Option<Route>;
  hoveredRoute: Option<Route>;
  onRouteHover?: (route: Option<Route>) => void;
  onRouteSelect?: (route: Route) => void;
  innerRef?: (map: mapboxgl.Map) => void;
  onSortRoutes?: () => void;
  startPosition: "userLocation" | "firstRoute";
  navigating: boolean;
};

class Map extends React.PureComponent<Props> {
  map: Option<mapboxgl.Map> = none;
  popupSelectedRoute: mapboxgl.Popup = new mapboxgl.Popup(popupSettings);
  popupHoveredRoute: mapboxgl.Popup = new mapboxgl.Popup(popupSettings);
  positionWatch: Option<number> = none;

  geoLocateControl: mapboxgl.GeolocateControl = new mapboxgl.GeolocateControl({
    positionOptions: {
      enableHighAccuracy: true
    },
    trackUserLocation: true,
    showUserLocation: true,
    showAccuracyCircle: true,

    fitBoundsOptions: {
      maxZoom: this.props.navigating ? 15 : 11
    }
  });

  centerUserLocation = () => {
    fromNullable(
      document.querySelector<HTMLButtonElement>(
        ".mapboxgl-ctrl-geolocate:not(.mapboxgl-ctrl-geolocate-active)"
      )
    ).map(el => el.click());
  };

  initializeMap() {
    (mapboxgl as any).accessToken =
      "pk.eyJ1IjoiZnJhbmNlc2NvY2lvcmlhIiwiYSI6ImNqcThyejR6ODA2ZDk0M25rZzZjcGo4ZmcifQ.yRWHQbG1dJjDp43d01bBOw";

    const map = new mapboxgl.Map({
      container: "map",
      style:
        "mapbox://styles/francescocioria/cjqi3u6lmame92rmw6aw3uyhm?optimize=true",
      center: {
        lat: parseFloat(localStorage.getItem("start_lat") || "45.46"),
        lng: parseFloat(localStorage.getItem("start_lng") || "9.19")
      },
      zoom: 11.0,
      scrollZoom: false
    });

    map.on("load", () => {
      this.map = some(map);

      this.addLayers();
      this.addMarkers();

      if (this.props.startPosition === "userLocation") {
        this.centerUserLocation();
      }

      if (
        this.props.startPosition === "firstRoute" &&
        this.props.routes.length > 0
      ) {
        this.flyToRoute(this.props.routes[0], { animate: false, padding: 80 });
      }
    });

    if (md.isDesktop) {
      map.on("mousemove", this.onMouseMove);
    }

    this.props.innerRef && this.props.innerRef(map);
  }

  getRouteColor(route: Route): string {
    return (this.props.selectedRoute.isSome() &&
      route === this.props.selectedRoute.value) ||
      (this.props.hoveredRoute.isSome() &&
        route === this.props.hoveredRoute.value) ||
      this.props.navigating
      ? "#387ddf"
      : route.properties.color;
  }

  addLayers() {
    this.map.map(map => {
      this.props.routes.forEach(route => {
        const layer: mapboxgl.Layer = {
          id: route.properties.url,
          type: "line",
          source: {
            type: "geojson",
            data: route as any
          },
          layout: {
            "line-join": "round",
            "line-cap": "round"
          },
          paint: {
            "line-width": 3,
            "line-color": this.getRouteColor(route)
          }
        };

        map.on("click", layer.id, () => {
          this.props.onRouteSelect && this.props.onRouteSelect(route);
        });

        map.addLayer(layer);
      });
    });
  }

  addMarkers() {
    this.map.map(map => {
      this.props.routes.forEach(route => {
        const coordinates = route.geometry.coordinates[0];

        const element = document.createElement("div");
        ReactDOM.render(
          <Marker
            onClick={() =>
              this.props.onRouteSelect && this.props.onRouteSelect(route)
            }
          />,
          element
        );

        const marker: mapboxgl.Marker = new mapboxgl.Marker({
          element
        }).setLngLat([coordinates[0], coordinates[1]]);

        marker.addTo(map);
      });
    });
  }

  onMouseMove = throttle((e: mapboxgl.MapMouseEvent) => {
    type ClosestRoute = {
      distance: number;
      route: Route;
    };

    this.map.map(map => {
      const closestRoute: ClosestRoute = this.props.routes.reduce(
        (acc, route) => {
          const distance = getRouteDistanceInPixels(route, e.lngLat, map);

          return distance < acc.distance ? { distance, route } : acc;
        },
        { distance: Infinity } as ClosestRoute
      );

      if (closestRoute.distance < 25) {
        this.props.onRouteHover &&
          this.props.onRouteHover(some(closestRoute.route));
      } else {
        this.props.hoveredRoute.map(() => {
          this.props.onRouteHover && this.props.onRouteHover(none);
        });
      }
    });
  }, 100);

  updateLayers() {
    this.map.map(map => {
      this.props.routes.forEach(route => {
        // update color
        map.setPaintProperty(route.id, "line-color", this.getRouteColor(route));
      });
    });
  }

  flyToRoute(route: Route, options?: mapboxgl.FitBoundsOptions) {
    this.map.map(map => {
      const coordinates = route.geometry.coordinates as [number, number][];
      const bounds = coordinates
        .map(coord => new mapboxgl.LngLatBounds(coord, coord))
        .reduce((bounds, coord) => {
          return bounds.extend(coord);
        });

      map.fitBounds(bounds, { padding: 50, ...options });
    });
  }

  showPopup(route: Route, popup: mapboxgl.Popup) {
    this.map.map(map => {
      const latLng: mapboxgl.LngLat = new mapboxgl.LngLat(
        route.geometry.coordinates[0][0],
        route.geometry.coordinates[0][1]
      );

      popup
        .setLngLat(latLng)
        .setHTML(ReactDOMServer.renderToString(<Popup route={route} />))
        .addTo(map);
    });
  }

  updateSelectedRoutePopup() {
    if (this.props.selectedRoute.isSome()) {
      this.showPopup(this.props.selectedRoute.value, this.popupSelectedRoute);
    } else {
      this.popupSelectedRoute.remove();
    }
  }

  updateHoveredRoutePopup() {
    const { hoveredRoute } = this.props;
    if (
      hoveredRoute.isSome() &&
      hoveredRoute.value !== this.props.selectedRoute.fold(null, identity)
    ) {
      this.showPopup(hoveredRoute.value, this.popupHoveredRoute);
    } else {
      this.popupHoveredRoute.remove();
    }
  }

  componentDidMount() {
    this.initializeMap();
  }

  componentDidUpdate(prevProps: Props) {
    this.updateLayers();
    this.updateSelectedRoutePopup();
    this.updateHoveredRoutePopup();

    if (
      this.props.selectedRoute.isSome() &&
      (prevProps.selectedRoute.isNone() ||
        prevProps.selectedRoute.value !== this.props.selectedRoute.value)
    ) {
      this.flyToRoute(this.props.selectedRoute.value);
    }

    setTimeout(() => this.map.map(map => map.resize()), 30);
  }

  render() {
    return (
      <View
        grow
        id="map"
        className={cx({ isNavigating: this.props.navigating })}
      />
    );
  }
}

export default Map;
