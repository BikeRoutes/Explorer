import { Content, GeoJSONFeatureCollection, GeoJSONFeature } from "model";
import flatten = require("lodash/flatten");

export const getRoutes = (): Promise<GeoJSONFeature[]> => {
  return fetch("https://api.github.com/repos/BikeRoutes/Milano/contents")
    .then(res => res.json())
    .then((contents: Content[]) => {
      const folders = contents.filter(c => c.type === "dir");
      return Promise.all(
        folders.map(f =>
          fetch(f.url).then(res => res.json() as Promise<Content[]>)
        )
      );
    })
    .then(flatten)
    .then(contents =>
      contents.filter(c => c.type === "file" && c.name.includes(".geojson"))
    )
    .then(contents => {
      return Promise.all(
        contents.map(c =>
          fetch(c.download_url)
            .then(r => r.json() as Promise<GeoJSONFeatureCollection>)
            .then(route => {
              const feature = route.features[0];
              const geoJson: GeoJSONFeature = {
                ...feature,
                properties: {
                  ...feature.properties,
                  url: c.html_url
                }
              };

              return geoJson;
            })
        )
      );
    });
};
