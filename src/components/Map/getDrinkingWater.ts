export type DrinkingWaterNode = { id: number; lat: number; lon: number };

export default async (options: {
  around: number;
  lat: number;
  lng: number;
}): Promise<DrinkingWaterNode[]> => {
  // round to closest even decimal (ex: 45.53 -> 45.6; 45.49 -> 45.4)
  const roundedLat = Math.round(options.lat * 5) / 5;
  const roundedLng = Math.round(options.lng * 5) / 5;

  const formData = `
    [out:json];
    (node["amenity"="drinking_water"](around:${options.around},${roundedLat},${roundedLng}););
    out;>;out;
  `;

  return fetch(
    `https://overpass-api.de/api/interpreter?data=${formData}&output&cache-only=true`
  )
    .then((res): Promise<{ elements: DrinkingWaterNode[] }> => res.json())
    .then(res => res.elements);
};
