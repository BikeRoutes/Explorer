import { Query, location, available } from "@buildo/bento/data";
import {
  locationToView,
  Geometry,
  Route,
  GeoJSONFeature,
  GeoJSONFeatureCollection
} from "../model";
import * as stringToColor from "string-to-color";
import * as geoJsonLength from "geojson-length";
import { Option, fromNullable, none, some } from "fp-ts/lib/Option";

const toGeoJson = require("@mapbox/togeojson");

function getElevationGain(coordinates: Geometry["coordinates"]): number {
  return coordinates
    .filter(c => c[2])
    .reduce((acc, c, index) => {
      const prevAltitude = index > 0 ? coordinates[index - 1][2] : undefined;
      const altitude = c[2]!;

      if (prevAltitude && altitude > prevAltitude) {
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
    // fetch("http://localhost:8081/")
    fetch("https://or52hotxz1.execute-api.us-east-1.amazonaws.com/dev/")
      .then(res => res.json() as Promise<{ body: string }>)
      .then((res): GeoJSONFeature[] => JSON.parse(res.body))
      .then(features =>
        features.map(feature => {
          const minElevation = feature.geometry.coordinates.reduce(
            (acc: number, c) => (c[2] && c[2] < acc ? c[2] : acc),
            Number.MAX_SAFE_INTEGER
          );

          const maxElevation = feature.geometry.coordinates.reduce(
            (acc: number, c) => (c[2] && c[2] > acc ? c[2] : acc),
            Number.MIN_SAFE_INTEGER
          );

          const richFeature: Route = {
            id: feature.properties.url,
            ...feature,
            properties: {
              ...feature.properties,
              color: stringToColor(feature.properties.name),
              length: Math.round(geoJsonLength(feature.geometry) / 100) / 10,
              elevationGain: Math.round(
                getElevationGain(feature.geometry.coordinates)
              ),
              minElevation,
              maxElevation
            }
          };

          return richFeature;
        })
      )
});

export const route = Query({
  params: {},
  dependencies: { currentView, routes },
  fetch: ({ currentView, routes }): Promise<Option<Route>> => {
    if (
      (currentView.view === "details" || currentView.view === "navigation") &&
      currentView.routeId.isSome()
    ) {
      const routeId = currentView.routeId.value;

      if (routeId === "gpx") {
        const parser = new DOMParser();

        return Promise.resolve(
          fromNullable(localStorage.getItem("gpxFile")).map(gpx => {
            const featureCollection: GeoJSONFeatureCollection = toGeoJson.gpx(
              parser.parseFromString(gpx, "text/xml")
            );

            const geoJSONFeature: GeoJSONFeature = featureCollection.features
              .filter(f => f.geometry.type === "LineString")
              .reduce((acc, feature) => {
                return {
                  ...acc,

                  geometry: {
                    ...acc.geometry,
                    coordinates: acc.geometry.coordinates.concat(
                      feature.geometry.coordinates
                    )
                  }
                };
              });

            const minElevation = geoJSONFeature.geometry.coordinates.reduce(
              (acc: number, c) => (c[2] && c[2] < acc ? c[2] : acc),
              Number.MAX_SAFE_INTEGER
            );

            const maxElevation = geoJSONFeature.geometry.coordinates.reduce(
              (acc: number, c) => (c[2] && c[2] > acc ? c[2] : acc),
              Number.MIN_SAFE_INTEGER
            );

            return {
              ...geoJSONFeature,
              properties: {
                ...geoJSONFeature.properties,
                color: "#38ffcc",
                length:
                  Math.round(geoJsonLength(geoJSONFeature.geometry) / 100) / 10,
                elevationGain: Math.round(
                  getElevationGain(geoJSONFeature.geometry.coordinates)
                ),
                minElevation,
                maxElevation,
                url: "gpx"
              },
              id: "gpx"
            };
          })
        );
      } else {
        return Promise.resolve(
          fromNullable(routes.find(r => r.id === routeId))
        );
      }
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
        .then(r => r.text())
        .then(text => some(text));
    }
    return Promise.resolve(none);
  }
});
