export const stopsNearestTestData = {
  scenarios: [
    {
      query: {
        lon: '10.314600011575415',
        lat: '63.287662848427736',
        distance: 400
      },
      expectedResult: {
        stopPlaces: ['NSR:StopPlace:42912']
      }
    },
    {
      query: {
        lon: '10.314600011575415',
        lat: '63.287662848427736',
        distance: 500
      },
      expectedResult: {
        stopPlaces: ['NSR:StopPlace:42912', 'NSR:StopPlace:41942']
      }
    }
  ]
};

export const stopsDetailsTestData = {
  scenarios: [
    {
      query: {
        stopPlaceIds: ['NSR:StopPlace:42912']
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
              description: null
            },
            {
              id: 'NSR:Quay:73576',
              name: 'Loddgårdstrøa',
              publicCode: null,
              description: null
            }
          ]
        }
      ]
    },
    {
      query: {
        stopPlaceIds: ['NSR:StopPlace:42912', 'NSR:StopPlace:41613']
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
              description: null
            },
            {
              id: 'NSR:Quay:73576',
              name: 'Loddgårdstrøa',
              publicCode: null,
              description: null
            }
          ]
        },
        {
          stopPlaceId: 'NSR:StopPlace:41613',
          stopPlaceName: 'Prinsens gate',
          quays: [
            {
              id: 'NSR:Quay:71181',
              name: 'Prinsens gate',
              publicCode: 'P2',
              description: 'ved AtB Kundesenter'
            },
            {
              id: 'NSR:Quay:71184',
              name: 'Prinsens gate',
              publicCode: 'P1',
              description: 'ved Bunnpris'
            }
          ]
        }
      ]
    }
  ]
};

export const departureFavoritesTestData = {
  scenarios: [
    {
      favorites: [
        {
          lineId: 'ATB:Line:2_82',
          quayId: 'NSR:Quay:73576',
          quayName: 'Loddgårdstrøa',
          stopId: 'NSR:StopPlace:42912',
          lineLineNumber: '82',
          lineName: 'Hesttrøa',
          lineTransportationMode: 'bus',
          lineTransportationSubMode: 'localBus'
        }
      ]
    },
    {
      favorites: [
        {
          lineId: 'ATB:Line:2_82',
          quayId: 'NSR:Quay:73576',
          quayName: 'Loddgårdstrøa',
          stopId: 'NSR:StopPlace:42912',
          lineLineNumber: '82',
          lineName: 'Hesttrøa',
          lineTransportationMode: 'bus',
          lineTransportationSubMode: 'localBus',
          quayPublicCode: ''
        },
        {
          lineId: 'ATB:Line:2_82',
          quayId: 'NSR:Quay:71786',
          quayName: 'Uglevegen',
          stopId: 'NSR:StopPlace:41942',
          lineLineNumber: '82',
          lineName: 'Melhus',
          lineTransportationMode: 'bus',
          lineTransportationSubMode: 'localBus',
          quayPublicCode: ''
        }
      ]
    }
  ]
};
