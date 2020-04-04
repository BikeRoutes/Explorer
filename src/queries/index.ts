import { Query, location, available } from "@buildo/bento/data";
import { locationToView, Geometry, Route, GeoJSONFeature } from "../model";
import * as stringToColor from "string-to-color";
import * as geoJsonLength from "geojson-length";
import { Option, fromNullable, none, some } from "fp-ts/lib/Option";

function getElevationGain(coordinates: Geometry["coordinates"]): number {
  return coordinates.reduce((acc, c, index) => {
    const prevAltitude = index > 0 ? coordinates[index - 1][2] : undefined;
    const altitude = c[2];

    if (altitude && prevAltitude && altitude > prevAltitude) {
      return acc + altitude - prevAltitude;
    }

    return acc;
  }, 0);
}

export { location };

export const currentView = Query({
  params: {},
  dependencies: { location: location },
  fetch: ({ location }) => Promise.resolve(locationToView(location))
});

export const routes = Query({
  cacheStrategy: available,
  params: {},
  fetch: (): Promise<Route[]> =>
    fetch(
      `${
        process.env.NODE_ENV === "development"
          ? "http://localhost:8081/"
          : "https://open-bike-routes.herokuapp.com/"
      }`
    )
      .then((res) => res.json() as Promise<GeoJSONFeature[]>)
      .then((features) =>
        features.map((feature) => {
          const richFeature: Route = {
            id: feature.properties.url,
            ...feature,
            properties: {
              ...feature.properties,
              color: stringToColor(feature.properties.name),
              length: (geoJsonLength(feature.geometry) / 1000).toFixed(1),
              elevationGain: Math.round(
                getElevationGain(feature.geometry.coordinates)
              )
            }
          };

          console.log(feature, richFeature);

          return richFeature;
        })
      )
});

export const route = Query({
  params: {},
  dependencies: { currentView, routes },
  fetch: ({ currentView, routes }): Promise<Option<Route>> => {
    if (currentView.view === "details" && currentView.routeId.isSome()) {
      const routeId = currentView.routeId.value;
      return Promise.resolve(
        fromNullable(routes.find((r) => r.id === routeId))
      );
    }

    return Promise.resolve(none);
  }
});

export const routeReadme = Query({
  params: {},
  dependencies: { route },
  fetch: ({ route }): Promise<Option<string>> => {
    if (route.isSome()) {
      const res = /BikeRoutes.+master\/(.+)\/.+$/.exec(
        route.value.properties.url
      )!;

      const readmeUrl = `https://raw.githubusercontent.com/BikeRoutes/BikeRoutes/master/${res[1]}/README.md`;

      return fetch(readmeUrl)
        .then((r) => r.text())
        .then((text) => some(text));
    }
    return Promise.resolve(none);
  }
});
