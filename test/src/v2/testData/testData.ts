import {
  departureFavoritesTestDataType,
  serviceJourneyTestDataType,
  stopsDetailsTestDataType,
  stopsNearestTestDataType,
  tripsTestDataType,
} from '../types';
import {filteredTripsTestDataType} from '../types/testData';

export const stopsNearestTestData: stopsNearestTestDataType = {
  scenarios: [
    {
      query: {
        lon: '10.314600011575415',
        lat: '63.287662848427736',
        distance: 400,
      },
      expectedResult: {
        stopPlaces: ['NSR:StopPlace:42912'],
      },
    },
    {
      query: {
        lon: '10.314600011575415',
        lat: '63.287662848427736',
        distance: 500,
      },
      expectedResult: {
        stopPlaces: ['NSR:StopPlace:42912', 'NSR:StopPlace:41942'],
      },
    },
  ],
};

export const stopsDetailsTestData: stopsDetailsTestDataType = {
  scenarios: [
    {
      query: {
        stopPlaceIds: ['NSR:StopPlace:42912'],
      },
      expectedResults: [
        {
          stopPlaceId: 'NSR:StopPlace:42912',
          stopPlaceName: 'Loddgårdstrøa',
          quays: [
            {
              id: 'NSR:Quay:73575',
              name: 'Loddgårdstrøa',
              publicCode: null,
              description: null,
            },
            {
              id: 'NSR:Quay:73576',
              name: 'Loddgårdstrøa',
              publicCode: null,
              description: null,
            },
          ],
        },
      ],
    },
    {
      query: {
        stopPlaceIds: ['NSR:StopPlace:42912', 'NSR:StopPlace:41613'],
      },
      expectedResults: [
        {
          stopPlaceId: 'NSR:StopPlace:42912',
          stopPlaceName: 'Loddgårdstrøa',
          quays: [
            {
              id: 'NSR:Quay:73575',
              name: 'Loddgårdstrøa',
              publicCode: null,
              description: null,
            },
            {
              id: 'NSR:Quay:73576',
              name: 'Loddgårdstrøa',
              publicCode: null,
              description: null,
            },
          ],
        },
        {
          stopPlaceId: 'NSR:StopPlace:41613',
          stopPlaceName: 'Prinsens gate',
          quays: [
            {
              id: 'NSR:Quay:71181',
              name: 'Prinsens gate',
              publicCode: 'P2',
              description: 'ved AtB Kundesenter',
            },
            {
              id: 'NSR:Quay:71184',
              name: 'Prinsens gate',
              publicCode: 'P1',
              description: 'ved Bunnpris',
            },
            {
              id: 'NSR:Quay:107493',
              name: 'Prinsens gate',
              publicCode: 'P3',
              description: null,
            },
          ],
        },
      ],
    },
  ],
};

export const departureFavoritesTestData: departureFavoritesTestDataType = {
  scenarios: [
    {
      favorites: [
        {
          lineId: 'ATB:Line:2_82',
          quayId: 'NSR:Quay:73576',
          quayName: 'Loddgårdstrøa',
          stopId: 'NSR:StopPlace:42912',
          lineNumber: '82',
          lineName: 'Hesttrøa',
          lineTransportationMode: 'bus',
          lineTransportationSubMode: 'localBus',
        },
      ],
    },
    {
      favorites: [
        {
          lineId: 'ATB:Line:2_82',
          quayId: 'NSR:Quay:73576',
          quayName: 'Loddgårdstrøa',
          stopId: 'NSR:StopPlace:42912',
          lineNumber: '82',
          lineName: 'Hesttrøa',
          lineTransportationMode: 'bus',
          lineTransportationSubMode: 'localBus',
          quayPublicCode: '',
        },
        {
          lineId: 'ATB:Line:2_82',
          quayId: 'NSR:Quay:71786',
          quayName: 'Uglevegen',
          stopId: 'NSR:StopPlace:41942',
          lineNumber: '82',
          lineName: 'Melhus',
          lineTransportationMode: 'bus',
          lineTransportationSubMode: 'localBus',
          quayPublicCode: '',
        },
      ],
    },
  ],
};

// Search from a service journey's start to end
export const serviceJourneyTestData: serviceJourneyTestDataType = {
  scenarios: [
    {
      query: {
        to: {
          name: 'Melhus skysstasjon',
          coordinates: {
            latitude: 63.284753,
            longitude: 10.277964,
          },
          place: 'NSR:StopPlace:42547',
        },
        from: {
          name: 'Hesttrøa',
          coordinates: {
            latitude: 63.294611,
            longitude: 10.332289,
          },
          place: 'NSR:StopPlace:41699',
        },
        when: '',
        arriveBy: false,
      },
    },
  ],
};

export const filteredTripsTestData: filteredTripsTestDataType = {
  to: {
    name: 'Trondheim lufthavn',
    coordinates: {
      latitude: 63.454052,
      longitude: 10.917269,
    },
    place: 'NSR:StopPlace:44286',
  },
  from: {
    name: 'Trondheim S',
    coordinates: {
      latitude: 63.436107,
      longitude: 10.40108,
    },
    place: 'NSR:StopPlace:41742',
  },
  when: '',
  arriveBy: false,
  modes: {
    accessMode: 'foot',
    directMode: 'foot',
    egressMode: 'foot',
    transportModes: [],
  },
};

export const tripsTestData: tripsTestDataType = {
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
        when: '',
        arriveBy: false,
      },
      expectedResult: {
        legModes: [
          {pattern: 0, modes: ['foot']},
          {pattern: 1, modes: ['bus']},
          {pattern: 2, modes: ['bus']},
        ],
        minimumTripPatterns: 4,
      },
    },
    {
      query: {
        to: {
          name: 'Eddaparken',
          coordinates: {
            latitude: 63.422287048884975,
            longitude: 10.394009646391378,
          },
        },
        from: {
          name: 'Trondheim Torg',
          coordinates: {
            latitude: 63.42987338669995,
            longitude: 10.393239260988398,
          },
        },
        when: '',
        arriveBy: false,
      },
      expectedResult: {
        legModes: [
          {pattern: 0, modes: ['foot']},
          {pattern: 1, modes: ['foot', 'bus', 'foot']},
          {pattern: 2, modes: ['foot', 'bus', 'foot']},
        ],
        minimumTripPatterns: 4,
      },
    },
    {
      query: {
        from: {
          name: 'Skansen',
          coordinates: {
            latitude: 63.43060811850891,
            longitude: 10.376745476594767,
          },
        },
        to: {
          name: 'Melhus',
          coordinates: {
            latitude: 63.284594,
            longitude: 10.27745,
          },
        },
        when: '',
        arriveBy: false,
      },
      expectedResult: {
        legModes: null,
        minimumTripPatterns: 1,
      },
    },
  ],
};
