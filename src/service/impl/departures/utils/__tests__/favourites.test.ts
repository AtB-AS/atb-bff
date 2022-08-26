import { FavouriteDepartureQuery } from '../../gql/jp3/favourite-departure.graphql-gen';
import { extractLineInfos, extractStopPlaces } from '../favorites';

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
            date: '2022-08-26',
            expectedDepartureTime: '2022-08-26T10:28:54+02:00',
            aimedDepartureTime: '2022-08-26T10:24:00+02:00',
            quay: {
              id: 'NSR:Quay:73975'
            },
            destinationDisplay: {
              frontText: 'Marienborg via sentrum'
            },
            serviceJourney: {
              id: 'ATB:ServiceJourney:12_220330132301491_50',
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
            date: '2022-08-26',
            expectedDepartureTime: '2022-08-26T10:37:03+02:00',
            aimedDepartureTime: '2022-08-26T10:34:00+02:00',
            quay: {
              id: 'NSR:Quay:73975'
            },
            destinationDisplay: {
              frontText: 'Trondheim Spektrum via sentrum'
            },
            serviceJourney: {
              id: 'ATB:ServiceJourney:12_220330132301567_52',
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
            date: '2022-08-26',
            expectedDepartureTime: '2022-08-26T10:45:39+02:00',
            aimedDepartureTime: '2022-08-26T10:44:00+02:00',
            quay: {
              id: 'NSR:Quay:73975'
            },
            destinationDisplay: {
              frontText: 'Marienborg via sentrum'
            },
            serviceJourney: {
              id: 'ATB:ServiceJourney:12_220330132301492_54',
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
            date: '2022-08-26',
            expectedDepartureTime: '2022-08-26T10:55:39+02:00',
            aimedDepartureTime: '2022-08-26T10:54:00+02:00',
            quay: {
              id: 'NSR:Quay:73975'
            },
            destinationDisplay: {
              frontText: 'Marienborg via sentrum'
            },
            serviceJourney: {
              id: 'ATB:ServiceJourney:12_220330132301493_56',
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
            date: '2022-08-26',
            expectedDepartureTime: '2022-08-26T11:05:39+02:00',
            aimedDepartureTime: '2022-08-26T11:04:00+02:00',
            quay: {
              id: 'NSR:Quay:73975'
            },
            destinationDisplay: {
              frontText: 'Marienborg via sentrum'
            },
            serviceJourney: {
              id: 'ATB:ServiceJourney:12_220330132301494_58',
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
            date: '2022-08-26',
            expectedDepartureTime: '2022-08-26T11:15:41+02:00',
            aimedDepartureTime: '2022-08-26T11:14:00+02:00',
            quay: {
              id: 'NSR:Quay:73975'
            },
            destinationDisplay: {
              frontText: 'Trondheim Spektrum via sentrum'
            },
            serviceJourney: {
              id: 'ATB:ServiceJourney:12_220330132301568_60',
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
            date: '2022-08-26',
            expectedDepartureTime: '2022-08-26T11:25:42+02:00',
            aimedDepartureTime: '2022-08-26T11:24:00+02:00',
            quay: {
              id: 'NSR:Quay:73975'
            },
            destinationDisplay: {
              frontText: 'Marienborg via sentrum'
            },
            serviceJourney: {
              id: 'ATB:ServiceJourney:12_220330132301495_62',
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
            date: '2022-08-26',
            expectedDepartureTime: '2022-08-26T11:34:00+02:00',
            aimedDepartureTime: '2022-08-26T11:34:00+02:00',
            quay: {
              id: 'NSR:Quay:73975'
            },
            destinationDisplay: {
              frontText: 'Marienborg via sentrum'
            },
            serviceJourney: {
              id: 'ATB:ServiceJourney:12_220330132301496_64',
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
            date: '2022-08-26',
            expectedDepartureTime: '2022-08-26T11:45:40+02:00',
            aimedDepartureTime: '2022-08-26T11:44:00+02:00',
            quay: {
              id: 'NSR:Quay:73975'
            },
            destinationDisplay: {
              frontText: 'Marienborg via sentrum'
            },
            serviceJourney: {
              id: 'ATB:ServiceJourney:12_220330132301497_66',
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
            date: '2022-08-26',
            expectedDepartureTime: '2022-08-26T11:55:43+02:00',
            aimedDepartureTime: '2022-08-26T11:54:00+02:00',
            quay: {
              id: 'NSR:Quay:73975'
            },
            destinationDisplay: {
              frontText: 'Trondheim Spektrum via sentrum'
            },
            serviceJourney: {
              id: 'ATB:ServiceJourney:12_220330132301569_68',
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
            date: '2022-08-26',
            expectedDepartureTime: '2022-08-26T12:35:44+02:00',
            aimedDepartureTime: '2022-08-26T12:34:00+02:00',
            quay: {
              id: 'NSR:Quay:73975'
            },
            destinationDisplay: {
              frontText: 'Trondheim Spektrum via sentrum'
            },
            serviceJourney: {
              id: 'ATB:ServiceJourney:12_220330132301570_76',
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
            date: '2022-08-26',
            expectedDepartureTime: '2022-08-26T13:14:00+02:00',
            aimedDepartureTime: '2022-08-26T13:14:00+02:00',
            quay: {
              id: 'NSR:Quay:73975'
            },
            destinationDisplay: {
              frontText: 'Trondheim Spektrum via sentrum'
            },
            serviceJourney: {
              id: 'ATB:ServiceJourney:12_220330132301571_84',
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
            date: '2022-08-26',
            expectedDepartureTime: '2022-08-26T13:54:00+02:00',
            aimedDepartureTime: '2022-08-26T13:54:00+02:00',
            quay: {
              id: 'NSR:Quay:73975'
            },
            destinationDisplay: {
              frontText: 'Trondheim Spektrum via sentrum'
            },
            serviceJourney: {
              id: 'ATB:ServiceJourney:12_220330132301572_92',
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
            date: '2022-08-26',
            expectedDepartureTime: '2022-08-26T14:34:00+02:00',
            aimedDepartureTime: '2022-08-26T14:34:00+02:00',
            quay: {
              id: 'NSR:Quay:73975'
            },
            destinationDisplay: {
              frontText: 'Trondheim Spektrum via sentrum'
            },
            serviceJourney: {
              id: 'ATB:ServiceJourney:12_220330132301573_100',
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
});
