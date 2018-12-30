import * as React from "react";
import * as ReactDOMServer from "react-dom/server";
import throttle = require("lodash/throttle");
import { GeoJson } from "model";
import * as leaflet from "leaflet";
import Popup from "Popup/Popup";
import View from "View";
import { Option, none, some } from "fp-ts/lib/Option";

import "leaflet/dist/leaflet.css";
import "leaflet/dist/images/marker-shadow.png";
import "leaflet/dist/images/marker-icon-2x.png";

type Props = {
  routes: GeoJson[];
  selectedRoute: Option<GeoJson>;
  hoveredRoute: Option<GeoJson>;
  onRouteHover: (route: Option<GeoJson>) => void;
};

class App extends React.PureComponent<Props> {
  map: leaflet.Map;
  tileLayer: leaflet.Layer;
  popup: leaflet.Popup = leaflet.popup({
    closeButton: false
  });

  layers: leaflet.GeoJSON<GeoJson>[] = [];
  markers: leaflet.Marker[] = [];

  initializeMap() {
    // create map instance
    this.map = leaflet.map("map", { preferCanvas: false });

    // init map with mapbox tiles
    this.tileLayer = leaflet.tileLayer(
      "https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}",
      {
        id: "mapbox.streets",
        accessToken:
          "pk.eyJ1IjoiZnJhbmNlc2NvY2lvcmlhIiwiYSI6ImNqcThzMDJrejJ1bzgzeGxjZTZ2aXR0cHMifQ.qzCmhZEf3Ta1YHvAfli3bA"
      } as any
    );

    this.map.addLayer(this.tileLayer);

    navigator.geolocation.getCurrentPosition(position => {
      this.map.setView(
        leaflet.latLng(position.coords.latitude, position.coords.longitude),
        12
      );
    });
  }

  updateMap() {
    // clear previous layers and markers
    this.layers.forEach(layer => layer.remove());
    this.markers.forEach(marker => marker.remove());

    this.layers = this.props.routes.map(route => {
      const feature = route.features[0];
      const color =
        (this.props.selectedRoute.isSome() &&
          route === this.props.selectedRoute.value) ||
        (this.props.hoveredRoute.isSome() &&
          route === this.props.hoveredRoute.value)
          ? "#387ddf"
          : feature.properties.color;

      return leaflet.geoJSON(route, {
        style: () => ({ color })
      });
    });

    this.markers = this.layers.map(layer => {
      const route = (layer.toGeoJSON() as any) as GeoJson;
      const coordinates = route.features[0].geometry.coordinates[0];
      return leaflet.marker([coordinates[1], coordinates[0]], {});
    });

    this.layers.forEach(layer => this.map.addLayer(layer));
    this.markers.forEach(marker => marker.addTo(this.map));

    this.map.on("mousemove", this.onMouseMove);
  }

  onMouseMove = throttle((e: leaflet.LeafletMouseEvent) => {
    type ClosestRoute = {
      distance: number;
      point: leaflet.LatLng;
      route: GeoJson;
    };

    const closestRoute: ClosestRoute = this.props.routes.reduce(
      (acc, route) => {
        const closestPoint: ClosestRoute = route.features[0].geometry.coordinates.reduce(
          (acc, coordinates) => {
            const point = leaflet.latLng(coordinates[1], coordinates[0]);
            const distance = this.map
              .latLngToContainerPoint(
                leaflet.latLng(coordinates[1], coordinates[0])
              )
              .distanceTo(this.map.latLngToContainerPoint(e.latlng));

            return distance < acc.distance ? { distance, point, route } : acc;
          },
          { distance: Infinity } as ClosestRoute
        );

        return closestPoint.distance < acc.distance ? closestPoint : acc;
      },
      { distance: Infinity } as ClosestRoute
    );

    if (closestRoute.distance < 25) {
      const startPointCoordinates =
        closestRoute.route.features[0].geometry.coordinates[0];

      const latLng: leaflet.LatLng = leaflet.latLng(
        startPointCoordinates[1],
        startPointCoordinates[0]
      );

      this.popup
        .setLatLng(latLng)
        .setContent(
          ReactDOMServer.renderToString(
            <Popup feature={closestRoute.route.features[0]} />
          )
        )
        .openOn(this.map);

      this.props.onRouteHover(some(closestRoute.route));
    } else {
      this.props.onRouteHover(none);
      this.map.closePopup(this.popup);
    }
  }, 30);

  componentDidMount() {
    this.initializeMap();
    this.updateMap();
  }

  componentDidUpdate() {
    this.updateMap();
  }

  render() {
    return <View grow id="map" />;
  }
}

export default App;
