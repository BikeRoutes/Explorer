import * as React from "react";
import * as ReactDOMServer from "react-dom/server";
import throttle = require("lodash/throttle");
import { declareQueries } from "@buildo/bento/data";
import { routes } from "queries";
import { GeoJson } from "model";
import * as leaflet from "leaflet";
import Popup from "Popup/Popup";

// import "leaflet/dist/leaflet.css";
import "./app.scss";

const queries = declareQueries({ routes });

type Feature = GeoJson["features"][number];

class App extends React.Component<typeof queries.Props> {
  map: leaflet.Map;
  tileLayer: leaflet.Layer;
  popup = leaflet.popup({
    closeButton: false
  });

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
    if (this.props.routes.ready) {
      // clear previous layers
      this.map.eachLayer(layer => {
        if (layer !== this.tileLayer) {
          this.map.removeLayer(layer);
        }
      });

      this.props.routes.value.map(route => {
        const layer = leaflet.geoJSON(route, {
          style: (feature: Feature) => ({
            color: feature.properties.color
          })
        });

        this.map.addLayer(layer);
      });
    }

    this.map.on("mousemove", this.onMouseMove);
  }

  onMouseMove = throttle((e: leaflet.LeafletMouseEvent) => {
    if (this.props.routes.ready) {
      type ClosestRoute = {
        distance: number;
        point: leaflet.LatLng;
        route: GeoJson;
      };

      const closestRoute: ClosestRoute = this.props.routes.value.reduce(
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

      if (closestRoute.distance < 50) {
        this.popup
          .setLatLng(closestRoute.point)
          .setContent(
            ReactDOMServer.renderToString(
              <Popup feature={closestRoute.route.features[0]} />
            )
          )
          .openOn(this.map);
      } else {
        this.map.closePopup(this.popup);
      }
    }
  }, 30);

  componentDidMount() {
    this.initializeMap();
  }

  componentDidUpdate() {
    this.updateMap();
  }

  render() {
    return <div id="map" />;
  }
}

export default queries(App);
