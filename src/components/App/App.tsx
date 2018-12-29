import * as React from "react";
import * as ReactDOMServer from "react-dom/server";
import { declareQueries } from "@buildo/bento/data";
import { collection } from "queries";
import { GeoJson } from "model";
import * as leaflet from "leaflet";

import "leaflet/dist/leaflet.css";
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

  componentDidMount() {
    this.map = leaflet.map("map");
  }

  componentDidUpdate() {
    if (this.props.collection.ready) {
      const onEachFeature = (feature: Feature, layer: any) => {
        layer.bindPopup(
          ReactDOMServer.renderToString(<Popup feature={feature} />)
        );
      };

      const style = (feature: Feature) => ({
        color: feature.properties.color
      });

      // init map with mapbox tiles
      leaflet
        .tileLayer(
          "https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}",
          {
            id: "mapbox.streets",
            accessToken:
              "pk.eyJ1IjoiZnJhbmNlc2NvY2lvcmlhIiwiYSI6ImNqcThzMDJrejJ1bzgzeGxjZTZ2aXR0cHMifQ.qzCmhZEf3Ta1YHvAfli3bA"
          } as any
        )
        .addTo(this.map);

      // add geojson
      const layer = leaflet
        .geoJSON(this.props.collection.value, {
          onEachFeature,
          style
        })
        .addTo(this.map);

      // update map size
      this.map.fitBounds(layer.getBounds());
    }
  }

  render() {
    return <div id="map" style={{ height: "100%", width: "100%" }} />;
  }
}

export default queries(App);
