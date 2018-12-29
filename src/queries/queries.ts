import { Query, location } from "@buildo/bento/data";
import * as API from "API";
import { locationToView, GeoJson } from "model";
import * as stringToColor from "string-to-color";
import * as geoJsonLength from "geojson-length";

function getElevationGain(
  coordinates: GeoJson["features"][number]["geometry"]["coordinates"]
): number {
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
  params: {},
  fetch: () => API.getRoutes()
});

export const collection = Query({
  dependencies: { routes },
  params: {},
  fetch: ({ routes }): Promise<GeoJson> => {
    const emptyGeoJson: GeoJson = {
      type: "FeatureCollection",
      features: []
    };

    const collection: GeoJson = routes.reduce(
      (acc, route) => ({
        ...acc,
        features: acc.features.concat(
          route.features.map(f => ({
            ...f,
            properties: {
              ...f.properties,
              color: stringToColor(f.properties.name),
              length: (geoJsonLength(f.geometry) / 1000).toFixed(1),
              elevationGain: Math.round(
                getElevationGain(f.geometry.coordinates)
              )
            }
          }))
        )
      }),
      emptyGeoJson
    );

    return Promise.resolve(collection);
  }
});
