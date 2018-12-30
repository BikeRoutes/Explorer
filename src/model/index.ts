import { HistoryLocation } from "@buildo/bento/data";

export { HistoryLocation };

export type CurrentView = "home" | "hello";

export function locationToView(location: HistoryLocation): CurrentView {
  switch (location.pathname) {
    case "/hello":
      return "hello";
    default:
      return "home";
  }
}

export function viewToLocation(view: CurrentView): HistoryLocation {
  switch (view) {
    case "hello":
      return { pathname: "/hello", search: {} };
    default:
      return { pathname: "/", search: {} };
  }
}

export type Content = {
  name: string;
  type: "dir" | "file";
  url: string;
  download_url: string;
  html_url: string;
};

export type Feature = {
  type: "Feature";
  properties: {
    name: string;
    color: string;
    length: string;
    elevationGain: number;
    url: string;
  };
  geometry: {
    type: "LineString";
    coordinates: Array<[number, number, number]>;
  };
};

export type GeoJson = {
  type: "FeatureCollection";
  features: [Feature];
};
