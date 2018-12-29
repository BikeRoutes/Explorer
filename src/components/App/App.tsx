import * as React from "react";
import * as ReactDOMServer from "react-dom/server";
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
          onEachFeature: (feature: Feature, layer: any) => {
            layer.bindPopup(
              ReactDOMServer.renderToString(<Popup feature={feature} />)
            );
          },
          style: (feature: Feature) => ({
            color: feature.properties.color
          })
        });

        this.map.addLayer(layer);
      });
    }
  }

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
