import { HistoryLocation as HistoryLocationT } from "@buildo/bento/data";
import { Option, fromNullable } from "fp-ts/lib/Option";

export type HistoryLocation = HistoryLocationT;

export type CurrentView =
  | { view: "explorer" }
  | { view: "details"; routeId: Option<string> }
  | { view: "navigation"; routeId: Option<string> };

export function locationToView(location: HistoryLocation): CurrentView {
  switch (location.search.view) {
    case "details":
      return {
        view: "details",
        routeId: fromNullable(location.search.routeId)
      };
    case "navigation":
      return {
        view: "navigation",
        routeId: fromNullable(location.search.routeId)
      };
    default:
      return { view: "explorer" };
  }
}

export function viewToLocation(view: CurrentView): HistoryLocation {
  switch (view.view) {
    case "details":
      return {
        pathname: "/Explorer",
        search: { view: "details", routeId: view.routeId.getOrElse("") }
      };
    case "navigation":
      return {
        pathname: "/Explorer",
        search: { view: "navigation", routeId: view.routeId.getOrElse("") }
      };
    case "explorer":
      return { pathname: "/Explorer", search: {} };
  }
}

export type Content = {
  name: string;
  type: "dir" | "file";
  url: string;
  download_url: string;
  html_url: string;
};

export type Geometry = {
  type: "LineString";
  coordinates: Array<[number, number, number?]>;
};

export type GeoJSONFeature = {
  type: "Feature";
  properties: {
    name: string;
    color: string;
    length: number;
    elevationGain: number;
    minElevation: number;
    maxElevation: number;
    url: string;
  };
  geometry: Geometry;
};
export type GeoJSONFeatureCollection = {
  type: "FeatureCollection";
  features: GeoJSONFeature[];
};

export type Route = GeoJSONFeature & { id: string };
