import {geocoderTestDataType} from '../types';

export const geocoderFeaturesTestData: geocoderTestDataType = {
  scenarios: [
    {
      query: {
        latitude: 63.287663,
        longitude: 10.3146,
        searchString: 'Melhus',
      },
      expectedResults: [
        {
          id: 'NSR:StopPlace:214',
          name: 'Melhus skysstasjon',
          category: 'railStation',
        },
        {
          id: 'NSR:StopPlace:42547',
          name: 'Melhus skysstasjon',
          category: 'onstreetBus',
        },
      ],
      moreResults: true,
    },
    {
      query: {
        latitude: 63.287663,
        longitude: 10.3146,
        searchString: 'Melhus skysstasjon',
      },
      expectedResults: [
        {
          id: 'NSR:StopPlace:214',
          name: 'Melhus skysstasjon',
          category: 'railStation',
        },
        {
          id: 'NSR:StopPlace:42547',
          name: 'Melhus skysstasjon',
          category: 'onstreetBus',
        },
      ],
      moreResults: false,
    },
    {
      query: {
        latitude: 63.429878,
        longitude: 10.372896,
        searchString: 'Skansen',
      },
      expectedResults: [
        {
          id: 'NSR:StopPlace:60891',
          name: 'Skansen',
          category: 'onstreetTram',
        },
        {
          id: 'OSM:TopographicPlace:277265385',
          name: 'Skansen stasjonspark',
          category: 'park',
        },
      ],
      moreResults: true,
    },
  ],
};

export const geocoderReverseTestData: geocoderTestDataType = {
  scenarios: [
    {
      query: {
        latitude: 63.287779,
        longitude: 10.317456,
      },
      expectedResults: [
        {
          id: 'NSR:StopPlace:41942',
          name: 'Uglevegen',
          category: 'onstreetBus',
        },
        {
          id: 'KVE:TopographicPlace:5028-Uglevegen',
          name: 'Uglevegen',
          category: 'street',
        },
      ],
      moreResults: true,
    },
    {
      query: {
        latitude: 63.431354,
        longitude: 10.392882,
      },
      expectedResults: [
        {
          id: 'KVE:TopographicPlace:5001-Bersvendveita',
          name: 'Bersvendveita',
          category: 'street',
        },
        {
          id: 'NSR:StopPlace:43501',
          name: 'Dronningens gate',
          category: 'onstreetBus',
        },
      ],
      moreResults: true,
    },
  ],
};
