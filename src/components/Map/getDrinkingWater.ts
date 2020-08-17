import { parseStringPromise } from "xml2js";

type OSMNode = {
  $: {
    lat: string;
    lon: string;
  };
};

export default async (options: {
  around: number;
  lat: number;
  lng: number;
}) => {
  const formData = `
    (node["amenity"="drinking_water"](around:${options.around},${options.lat},${options.lng}););out;>;out;
    `;

  return fetch(`https://overpass-api.de/api/interpreter?data=${formData}`)
    .then(res => res.text())
    .then(
      (xml): Promise<{ osm: { node: OSMNode[] } }> => parseStringPromise(xml)
    );
};
