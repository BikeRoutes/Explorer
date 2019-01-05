import * as React from "react";
import * as ReactDOMServer from "react-dom/server";
import * as ReactDOM from "react-dom";
import throttle = require("lodash/throttle");
import * as mapboxgl from "mapbox-gl";
import Popup from "Popup/Popup";
import Marker from "Marker/Marker";
import View from "View";
import { Option, none, some } from "fp-ts/lib/Option";
import { Route } from "model";

import "mapbox-gl/dist/mapbox-gl.css";

type Props = {
  routes: Route[];
  selectedRoute: Option<Route>;
  hoveredRoute: Option<Route>;
  onRouteHover: (route: Option<Route>) => void;
  onRouteSelect: (route: Route) => void;
};

class App extends React.PureComponent<Props> {
  map: Option<mapboxgl.Map> = none;
  popup: mapboxgl.Popup = new mapboxgl.Popup({
    closeButton: false,
    closeOnClick: true,
    offset: [0, -40],
    anchor: "bottom"
  });

  initializeMap() {
    (mapboxgl as any).accessToken =
      "pk.eyJ1IjoiZnJhbmNlc2NvY2lvcmlhIiwiYSI6ImNqcThyejR6ODA2ZDk0M25rZzZjcGo4ZmcifQ.yRWHQbG1dJjDp43d01bBOw";

    const map = new mapboxgl.Map({
      container: "map",
      style: "mapbox://styles/francescocioria/cjqi3u6lmame92rmw6aw3uyhm",
      zoom: 11.0
    });

    map.on("load", () => {
      this.map = some(map);

      this.addLayers();
      this.addMarkers();

      navigator.geolocation.getCurrentPosition(position => {
        map.setCenter(
          new mapboxgl.LngLat(
            position.coords.longitude,
            position.coords.latitude
          )
        );
      });
    });

    map.on("mousemove", this.onMouseMove);
  }

  getRouteColor(route: Route): string {
    return (this.props.selectedRoute.isSome() &&
      route === this.props.selectedRoute.value) ||
      (this.props.hoveredRoute.isSome() &&
        route === this.props.hoveredRoute.value)
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
          this.props.onRouteSelect(route);
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
          <Marker onClick={() => this.props.onRouteSelect(route)} />,
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
          const closestPoint: ClosestRoute = route.geometry.coordinates.reduce(
            (acc, coordinates) => {
              const point = map.project(
                new mapboxgl.LngLat(coordinates[0], coordinates[1])
              );
              const mousePoint = map.project(
                new mapboxgl.LngLat(e.lngLat.lng, e.lngLat.lat)
              );
              const distance = Math.sqrt(
                Math.pow(Math.abs(point.x - mousePoint.x), 2) +
                  Math.pow(Math.abs(point.y - mousePoint.y), 2)
              );
              return distance < acc.distance ? { distance, route } : acc;
            },
            { distance: Infinity } as ClosestRoute
          );

          return closestPoint.distance < acc.distance ? closestPoint : acc;
        },
        { distance: Infinity } as ClosestRoute
      );

      if (closestRoute.distance < 25) {
        const startPointCoordinates =
          closestRoute.route.geometry.coordinates[0];

        const latLng: mapboxgl.LngLat = new mapboxgl.LngLat(
          startPointCoordinates[0],
          startPointCoordinates[1]
        );

        this.popup
          .setLngLat(latLng)
          .setHTML(
            ReactDOMServer.renderToString(<Popup route={closestRoute.route} />)
          )
          .addTo(map);

        this.props.onRouteHover(some(closestRoute.route));
      } else {
        this.props.onRouteHover(none);
        this.popup.remove();
      }
    });
  }, 60);

  updateLayers() {
    this.map.map(map => {
      this.props.routes.forEach(route => {
        // update color
        map.setPaintProperty(route.id, "line-color", this.getRouteColor(route));
      });
    });
  }

  flyToRoute(route: Route) {
    this.map.map(map => {
      const coordinates = route.geometry.coordinates as [number, number][];
      const bounds = coordinates
        .map(coord => new mapboxgl.LngLatBounds(coord, coord))
        .reduce((bounds, coord) => {
          return bounds.extend(coord);
        });

      map.fitBounds(bounds, { padding: 50 });
    });
  }

  componentDidMount() {
    this.initializeMap();
  }

  componentDidUpdate(prevProps: Props) {
    this.updateLayers();

    if (
      this.props.selectedRoute.isSome() &&
      (prevProps.selectedRoute.isNone() ||
        prevProps.selectedRoute.value !== this.props.selectedRoute.value)
    ) {
      this.flyToRoute(this.props.selectedRoute.value);
    }
  }

  render() {
    return <View grow id="map" />;
  }
}

export default App;
