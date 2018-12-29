import * as React from "react";
import * as ReactDOMServer from "react-dom/server";
import { declareQueries } from "@buildo/bento/data";
import { collection } from "queries";
import { GeoJson } from "model";

import "./app.scss";

declare const L: any;

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
  componentDidUpdate() {
    if (this.props.collection.ready) {
      const onEachFeature = (feature: Feature, layer: any) => {
        if (feature.properties) {
          layer.bindPopup(
            ReactDOMServer.renderToString(<Popup feature={feature} />)
          );
        }
      };

      const style = (feature: Feature) => ({
        color: feature.properties.color
      });

      const map = L.map("map");
      L.tileLayer(
        "https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}",
        {
          id: "mapbox.streets",
          accessToken:
            "pk.eyJ1IjoiZnJhbmNlc2NvY2lvcmlhIiwiYSI6ImNqcThzMDJrejJ1bzgzeGxjZTZ2aXR0cHMifQ.qzCmhZEf3Ta1YHvAfli3bA"
        }
      ).addTo(map);
      const layer = L.geoJson(this.props.collection.value, {
        onEachFeature,
        style
      }).addTo(map);
      map.fitBounds(layer.getBounds());
    }
  }

  render() {
    const { collection } = this.props;

    if (!collection.ready) {
      return null;
    }

    return <div id="map" style={{ height: "100%", width: "100%" }} />;
  }
}

export default queries(App);
