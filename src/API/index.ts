import { Content, GeoJSONFeatureCollection, GeoJSONFeature } from "../model";
import flatten from "lodash/flatten";

type FileContent = Content & { type: "file" };

function getGeoJSONs(contents: Content[]): Promise<GeoJSONFeatureCollection[]> {
  const folders = contents.filter((c) => c.type === "dir");
  if (folders.length > 0) {
    return Promise.all(
      folders.map((f) => fetch(f.url).then((r) => r.json()) as Promise<Content>)
    )
      .then(flatten)
      .then(getGeoJSONs);
  } else {
    const files = contents.filter(
      (c) => c.type === "file" && c.name.includes(".geojson")
    ) as FileContent[];

    return Promise.all(
      files.map((f) =>
        fetch(f.download_url)
          .then((r) => r.json() as Promise<GeoJSONFeatureCollection>)
          .then((x) => ({
            ...x,
            features: [
              {
                ...x.features[0],
                properties: {
                  ...x.features[0].properties,
                  url: f.html_url
                }
              }
            ]
          }))
      )
    );
  }
}

export const getRoutes = (): Promise<GeoJSONFeature[]> => {
  return fetch("https://api.github.com/repos/BikeRoutes/Milano/contents")
    .then((res) => res.json())
    .then(getGeoJSONs)
    .then((geoJSONs) => geoJSONs.map((route) => route.features[0]));
};
