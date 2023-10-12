import {
  departuresGroupedTestDataType,
  geocoderTestDataType,
  serviceJourneyTestDataType,
  tripTestDataType,
} from '../types';

export const departuresGroupedTestData: departuresGroupedTestDataType = {
  scenarios: [
    {
      query: {
        location: {
          layer: 'address',
          coordinates: {
            latitude: 63.287662848427736,
            longitude: 10.314600011575415,
          },
        },
      },
      expectedResults: [
        {
          stopPlace: 'NSR:StopPlace:42912',
          quays: ['NSR:Quay:73575', 'NSR:Quay:73576'],
          shouldHaveDepartures: true,
        },
        {
          stopPlace: 'NSR:StopPlace:41942',
          quays: ['NSR:Quay:71785', 'NSR:Quay:71786'],
          shouldHaveDepartures: true,
        },
      ],
    },
    {
      query: {
        location: {
          id: 'NSR:StopPlace:42582',
          layer: 'venue',
        },
      },
      expectedResults: [
        {
          stopPlace: 'NSR:StopPlace:42582',
          quays: ['NSR:Quay:72946', 'NSR:Quay:72955'],
          shouldHaveDepartures: true,
        },
      ],
    },
  ],
};

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
          id: 'KVE:TopographicPlace:5028-Spurvevegen',
          name: 'Spurvevegen',
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

// Only use bust stop to bus stop here
export const tripTestData: tripTestDataType = {
  scenarios: [
    {
      query: {
        to: {
          name: 'Studentersamfundet',
          coordinates: {
            latitude: 63.422568,
            longitude: 10.394852,
          },
          place: 'NSR:StopPlace:42660',
        },
        from: {
          name: 'Prinsens gate',
          coordinates: {
            latitude: 63.431034,
            longitude: 10.392007,
          },
          place: 'NSR:StopPlace:41613',
        },
        searchDate: '',
        limit: 10,
        arriveBy: false,
      },
    },
  ],
};

export const serviceJourneyTestData: serviceJourneyTestDataType = {
  scenarios: [
    {
      query: {
        to: {
          name: 'Nidarosdomen',
          coordinates: {
            latitude: 63.426015,
            longitude: 10.393437,
          },
          place: 'NSR:StopPlace:41609',
        },
        from: {
          name: 'Prinsens gate',
          coordinates: {
            latitude: 63.431034,
            longitude: 10.392007,
          },
          place: 'NSR:StopPlace:41613',
        },
        searchDate: '',
        arriveBy: false,
        modes: ['bus'],
        limit: 1,
      },
    },
  ],
};
