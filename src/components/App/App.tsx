import * as React from "react";
import * as ReactDOMServer from "react-dom/server";
import { declareQueries } from "@buildo/bento/data";
import { collection } from "queries";
import { GeoJson } from "model";
import * as leaflet from "leaflet";

// import "leaflet/dist/leaflet.css";
import "./app.scss";

const queries = declareQueries({ collection });

type Feature = GeoJson["features"][number];

const Popup = (props: { feature: Feature }) => (
  <div>
    <div>Name: {props.feature.properties.name}</div>
    <div>Length: {props.feature.properties.length} km</div>
    <div>Elevation gain: {props.feature.properties.elevationGain} m</div>
  </div>
);

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
    if (this.props.collection.ready) {
      // create new layer
      const layer = leaflet.geoJSON(this.props.collection.value, {
        onEachFeature: (feature: Feature, layer: any) => {
          layer.bindPopup(
            ReactDOMServer.renderToString(<Popup feature={feature} />)
          );
        },
        style: (feature: Feature) => ({
          color: feature.properties.color
        })
      });

      // replace previous layer with new one
      this.map.eachLayer(layer => {
        if (layer !== this.tileLayer) {
          this.map.removeLayer(layer);
        }
      });
      this.map.addLayer(layer);
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
