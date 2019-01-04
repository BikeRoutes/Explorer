import { Query, location, available } from "@buildo/bento/data";
import * as API from "API";
import { locationToView, Geometry, Route } from "model";
import * as stringToColor from "string-to-color";
import * as geoJsonLength from "geojson-length";

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
    API.getRoutes().then(features =>
      features.map(feature => {
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

        return richFeature;
      })
    )
});
