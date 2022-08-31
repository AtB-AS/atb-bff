import {
  FavouriteCall,
  FavouriteDepartureAPIParam
} from '../../../../../types/departures';
import { FavouriteDepartureQuery } from '../../gql/jp3/favourite-departure.graphql-gen';
import {
  callMatchesQueriedLineName,
  extractLineInfos,
  extractStopPlaces
} from '../favorites';

const data = [
  {
    quays: [
      {
        id: 'NSR:Quay:73975',
        name: 'Solsiden',
        stopPlace: {
          id: 'NSR:StopPlace:43133',
          description: '',
          name: 'Solsiden',
          longitude: 10.413246,
          latitude: 63.434019
        },
        estimatedCalls: [
          {
            date: '2022-08-29',
            expectedDepartureTime: '2022-08-29T17:00:12+02:00',
            aimedDepartureTime: '2022-08-29T16:55:00+02:00',
            quay: {
              id: 'NSR:Quay:73975'
            },
            destinationDisplay: {
              frontText: 'Marienborg via sentrum'
            },
            serviceJourney: {
              id: 'ATB:ServiceJourney:12_220330132301513_128',
              line: {
                id: 'ATB:Line:2_12',
                publicCode: '12',
                transportMode: 'bus',
                transportSubmode: 'localBus',
                name: 'Dragvoll-Øya/Marienborg'
              }
            }
          },
          {
            date: '2022-08-29',
            expectedDepartureTime: '2022-08-29T17:05:09+02:00',
            aimedDepartureTime: '2022-08-29T17:05:00+02:00',
            quay: {
              id: 'NSR:Quay:73975'
            },
            destinationDisplay: {
              frontText: 'Marienborg via sentrum'
            },
            serviceJourney: {
              id: 'ATB:ServiceJourney:12_220330132301514_130',
              line: {
                id: 'ATB:Line:2_12',
                publicCode: '12',
                transportMode: 'bus',
                transportSubmode: 'localBus',
                name: 'Dragvoll-Øya/Marienborg'
              }
            }
          },
          {
            date: '2022-08-29',
            expectedDepartureTime: '2022-08-29T17:20:26+02:00',
            aimedDepartureTime: '2022-08-29T17:14:00+02:00',
            quay: {
              id: 'NSR:Quay:73975'
            },
            destinationDisplay: {
              frontText: 'Trondheim Spektrum via sentrum'
            },
            serviceJourney: {
              id: 'ATB:ServiceJourney:12_220330132301574_132',
              line: {
                id: 'ATB:Line:2_12',
                publicCode: '12',
                transportMode: 'bus',
                transportSubmode: 'localBus',
                name: 'Dragvoll-Øya/Marienborg'
              }
            }
          },
          {
            date: '2022-08-29',
            expectedDepartureTime: '2022-08-29T17:26:09+02:00',
            aimedDepartureTime: '2022-08-29T17:24:00+02:00',
            quay: {
              id: 'NSR:Quay:73975'
            },
            destinationDisplay: {
              frontText: 'Marienborg via sentrum'
            },
            serviceJourney: {
              id: 'ATB:ServiceJourney:12_220330132301515_134',
              line: {
                id: 'ATB:Line:2_12',
                publicCode: '12',
                transportMode: 'bus',
                transportSubmode: 'localBus',
                name: 'Dragvoll-Øya/Marienborg'
              }
            }
          },
          {
            date: '2022-08-29',
            expectedDepartureTime: '2022-08-29T17:36:08+02:00',
            aimedDepartureTime: '2022-08-29T17:34:00+02:00',
            quay: {
              id: 'NSR:Quay:73975'
            },
            destinationDisplay: {
              frontText: 'Marienborg via sentrum'
            },
            serviceJourney: {
              id: 'ATB:ServiceJourney:12_220330132301516_136',
              line: {
                id: 'ATB:Line:2_12',
                publicCode: '12',
                transportMode: 'bus',
                transportSubmode: 'localBus',
                name: 'Dragvoll-Øya/Marienborg'
              }
            }
          },
          {
            date: '2022-08-29',
            expectedDepartureTime: '2022-08-29T17:44:00+02:00',
            aimedDepartureTime: '2022-08-29T17:44:00+02:00',
            quay: {
              id: 'NSR:Quay:73975'
            },
            destinationDisplay: {
              frontText: 'Marienborg via sentrum'
            },
            serviceJourney: {
              id: 'ATB:ServiceJourney:12_220330132301517_138',
              line: {
                id: 'ATB:Line:2_12',
                publicCode: '12',
                transportMode: 'bus',
                transportSubmode: 'localBus',
                name: 'Dragvoll-Øya/Marienborg'
              }
            }
          },
          {
            date: '2022-08-29',
            expectedDepartureTime: '2022-08-29T17:56:06+02:00',
            aimedDepartureTime: '2022-08-29T17:54:00+02:00',
            quay: {
              id: 'NSR:Quay:73975'
            },
            destinationDisplay: {
              frontText: 'Trondheim Spektrum via sentrum'
            },
            serviceJourney: {
              id: 'ATB:ServiceJourney:12_220330132301575_140',
              line: {
                id: 'ATB:Line:2_12',
                publicCode: '12',
                transportMode: 'bus',
                transportSubmode: 'localBus',
                name: 'Dragvoll-Øya/Marienborg'
              }
            }
          },
          {
            date: '2022-08-29',
            expectedDepartureTime: '2022-08-29T18:04:00+02:00',
            aimedDepartureTime: '2022-08-29T18:04:00+02:00',
            quay: {
              id: 'NSR:Quay:73975'
            },
            destinationDisplay: {
              frontText: 'Marienborg via sentrum'
            },
            serviceJourney: {
              id: 'ATB:ServiceJourney:12_220330132301518_142',
              line: {
                id: 'ATB:Line:2_12',
                publicCode: '12',
                transportMode: 'bus',
                transportSubmode: 'localBus',
                name: 'Dragvoll-Øya/Marienborg'
              }
            }
          },
          {
            date: '2022-08-29',
            expectedDepartureTime: '2022-08-29T18:16:06+02:00',
            aimedDepartureTime: '2022-08-29T18:14:00+02:00',
            quay: {
              id: 'NSR:Quay:73975'
            },
            destinationDisplay: {
              frontText: 'Marienborg via sentrum'
            },
            serviceJourney: {
              id: 'ATB:ServiceJourney:12_220330132301519_144',
              line: {
                id: 'ATB:Line:2_12',
                publicCode: '12',
                transportMode: 'bus',
                transportSubmode: 'localBus',
                name: 'Dragvoll-Øya/Marienborg'
              }
            }
          },
          {
            date: '2022-08-29',
            expectedDepartureTime: '2022-08-29T18:36:04+02:00',
            aimedDepartureTime: '2022-08-29T18:34:00+02:00',
            quay: {
              id: 'NSR:Quay:73975'
            },
            destinationDisplay: {
              frontText: 'Trondheim Spektrum via sentrum'
            },
            serviceJourney: {
              id: 'ATB:ServiceJourney:12_220330132301576_148',
              line: {
                id: 'ATB:Line:2_12',
                publicCode: '12',
                transportMode: 'bus',
                transportSubmode: 'localBus',
                name: 'Dragvoll-Øya/Marienborg'
              }
            }
          },
          {
            date: '2022-08-29',
            expectedDepartureTime: '2022-08-29T19:14:00+02:00',
            aimedDepartureTime: '2022-08-29T19:14:00+02:00',
            quay: {
              id: 'NSR:Quay:73975'
            },
            destinationDisplay: {
              frontText: 'Trondheim Spektrum via sentrum'
            },
            serviceJourney: {
              id: 'ATB:ServiceJourney:12_220330132301577_156',
              line: {
                id: 'ATB:Line:2_12',
                publicCode: '12',
                transportMode: 'bus',
                transportSubmode: 'localBus',
                name: 'Dragvoll-Øya/Marienborg'
              }
            }
          },
          {
            date: '2022-08-29',
            expectedDepartureTime: '2022-08-29T19:56:01+02:00',
            aimedDepartureTime: '2022-08-29T19:54:00+02:00',
            quay: {
              id: 'NSR:Quay:73975'
            },
            destinationDisplay: {
              frontText: 'Trondheim Spektrum via sentrum'
            },
            serviceJourney: {
              id: 'ATB:ServiceJourney:12_220330132301578_164',
              line: {
                id: 'ATB:Line:2_12',
                publicCode: '12',
                transportMode: 'bus',
                transportSubmode: 'localBus',
                name: 'Dragvoll-Øya/Marienborg'
              }
            }
          },
          {
            date: '2022-08-29',
            expectedDepartureTime: '2022-08-29T20:23:00+02:00',
            aimedDepartureTime: '2022-08-29T20:23:00+02:00',
            quay: {
              id: 'NSR:Quay:73975'
            },
            destinationDisplay: {
              frontText: 'Trondheim Spektrum via sentrum'
            },
            serviceJourney: {
              id: 'ATB:ServiceJourney:12_220330132301579_170',
              line: {
                id: 'ATB:Line:2_12',
                publicCode: '12',
                transportMode: 'bus',
                transportSubmode: 'localBus',
                name: 'Dragvoll-Øya/Marienborg'
              }
            }
          },
          {
            date: '2022-08-29',
            expectedDepartureTime: '2022-08-29T21:03:00+02:00',
            aimedDepartureTime: '2022-08-29T21:03:00+02:00',
            quay: {
              id: 'NSR:Quay:73975'
            },
            destinationDisplay: {
              frontText: 'Trondheim Spektrum via sentrum'
            },
            serviceJourney: {
              id: 'ATB:ServiceJourney:12_220330132301413_174',
              line: {
                id: 'ATB:Line:2_12',
                publicCode: '12',
                transportMode: 'bus',
                transportSubmode: 'localBus',
                name: 'Dragvoll-Øya/Marienborg'
              }
            }
          }
        ]
      }
    ]
  }
] as FavouriteDepartureQuery[];

describe('favourite tools', () => {
  it('extracts stop places', () => {
    const stopPlaces = extractStopPlaces(data);
    expect(stopPlaces.length).toBe(1);
    expect(stopPlaces[0].id).toBe('NSR:StopPlace:43133');
  });

  it('filters undefined', () => {
    const data = ['1', '2', undefined, '3'];
    const filtered = data.filter(value => value !== undefined);
    console.log('filtered', filtered);
    expect(filtered.length).toBe(3);
  });

  it('extracts line infos', () => {
    const lineInfos = extractLineInfos(data);
    console.log('lineInfos', lineInfos);
    expect(lineInfos.length).toBe(2);
  });

  it('identifies a favourite call', () => {
    const call1 = data[0].quays[0].estimatedCalls[0];
    const call2 = data[0].quays[0].estimatedCalls[2];

    const favouriteQuery1: FavouriteDepartureAPIParam[] = [
      {
        lineId: 'ATB:Line:2_12',
        lineName: 'Marienborg via sentrum',
        quayId: 'NSR:Quay:73975'
      }
    ];

    let call1isFavourite = callMatchesQueriedLineName(call1, favouriteQuery1);
    let call2isFavourite = callMatchesQueriedLineName(call2, favouriteQuery1);

    expect(call1isFavourite).toBe(true);
    expect(call2isFavourite).toBe(false);

    const favouriteQuery2: FavouriteDepartureAPIParam[] = [
      {
        lineId: 'ATB:Line:2_12',
        lineName: '',
        quayId: 'NSR:Quay:73975'
      }
    ];

    call1isFavourite = callMatchesQueriedLineName(call1, favouriteQuery2);
    call2isFavourite = callMatchesQueriedLineName(call2, favouriteQuery2);

    expect(call1isFavourite).toBe(true);
    expect(call2isFavourite).toBe(true);

    const call3 = {
      date: '2022-08-29',
      expectedDepartureTime: '2022-08-29T21:03:00+02:00',
      aimedDepartureTime: '2022-08-29T21:03:00+02:00',
      quay: {
        id: 'NSR:Quay:73975'
      },
      destinationDisplay: {
        frontText: 'Trondheim Spektrum via sentrum'
      },
      serviceJourney: {
        id: 'ATB:ServiceJourney:12_220330132301413_174',
        line: {
          id: 'WRONG LINE',
          publicCode: '12',
          transportMode: 'bus',
          transportSubmode: 'localBus',
          name: 'Dragvoll-Øya/Marienborg'
        }
      }
    } as FavouriteCall;

    const call3isFavourite = callMatchesQueriedLineName(call3, favouriteQuery1);

    expect(call3isFavourite).toBe(false);
  });
});
