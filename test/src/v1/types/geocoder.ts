export type GeocoderFeatureResponseType = Array<{
  type: string;
  geometry: {
    type: string;
    coordinates: Array<number>;
  };
  properties: {
    id: string;
    gid: string;
    layer: string;
    source: string;
    source_id: string;
    name: string;
    street: string;
    distance: 1.895;
    accuracy: string;
    country_a: string;
    county: string;
    county_gid: string;
    locality: string;
    locality_gid: string;
    label: string;
    category: Array<string>;
  };
}>;

export type GeocoderReverseResponseType = Array<{
  type: string;
  geometry: {
    type: string;
    coordinates: Array<number>;
  };
  properties: {
    id: string;
    gid: string;
    layer: string;
    source: string;
    source_id: string;
    name: string;
    street: string;
    confidence: string;
    distance: 1.895;
    accuracy: string;
    country_a: string;
    county: string;
    county_gid: string;
    locality: string;
    locality_gid: string;
    borough: string;
    borough_gid: string;
    label: string;
    category: Array<string>;
  };
}>;
