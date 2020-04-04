import * as t from "io-ts";
import { some, none } from "fp-ts/lib/Option";
import { tryCatch, TaskEither, taskEither } from "fp-ts/lib/TaskEither";
import { flatten, catOptions, array } from "fp-ts/lib/Array";
import { GeoJSONFeatureCollection, GeoJSONFeature } from "../src/model";
import { query, contents, Contents, ContentEntry, BlobEntry } from "./graphql";

const traverseTaskEither = array.traverse(taskEither);

const getGeoJSONsEntries = (acc: {
  path: string;
  entries: ContentEntry[];
}): Array<BlobEntry & { path: string }> => {
  if (acc.entries.every((e) => e.type === "blob")) {
    return acc.entries
      .filter((e) => e.name.includes(".geojson"))
      .map((e) => ({ ...e, path: `${acc.path}/${e.name}` })) as Array<
      BlobEntry & { path: string }
    >;
  } else {
    return flatten(
      catOptions(
        acc.entries.map((parentEntry) =>
          parentEntry.type === "tree"
            ? some(
                getGeoJSONsEntries({
                  path: `${acc.path}/${parentEntry.name}`,
                  entries: parentEntry.object.entries
                })
              )
            : none
        )
      )
    );
  }
};

const geoJSONFeatureFromGeoJSONFeatureCollection = (
  collection: GeoJSONFeatureCollection,
  url: string
): GeoJSONFeature => {
  const feature = collection.features[0];
  return {
    ...feature,
    properties: { ...feature.properties, url }
  };
};

function getGeoJSONs(contents: Contents): TaskEither<string, GeoJSONFeature[]> {
  const geoJSONsEntries = getGeoJSONsEntries({
    path: "",
    entries: (contents.repository.object.entries as any) as ContentEntry[]
  });

  return traverseTaskEither(geoJSONsEntries, (entry) => {
    const url = `https://github.com/BikeRoutes/BikeRoutes/blob/master${entry.path}`;

    if (!entry.object.isTruncated) {
      const featureCollection = JSON.parse(
        entry.object.text
      ) as GeoJSONFeatureCollection;
      return taskEither.of<string, GeoJSONFeature>(
        geoJSONFeatureFromGeoJSONFeatureCollection(featureCollection, url)
      );
    } else {
      return tryCatch(
        () =>
          fetch(
            `https://raw.githubusercontent.com/BikeRoutes/BikeRoutes/master${entry.path}`
          )
            .then((res) => res.json() as Promise<GeoJSONFeatureCollection>)
            .then((featureCollection) =>
              geoJSONFeatureFromGeoJSONFeatureCollection(featureCollection, url)
            ),
        () => `Raw githubusercontent response error for entry "${entry.path}"`
      );
    }
  });
}

export const getRoutes = (): Promise<GeoJSONFeature[]> => {
  return query(contents, {}, Contents)
    .chain(getGeoJSONs)
    .fold((e) => {
      console.log(e);
      return [];
    }, t.identity)
    .run();
};
