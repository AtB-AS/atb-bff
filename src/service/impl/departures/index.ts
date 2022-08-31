import { Result } from '@badrap/result';
import { PubSub, Topic } from '@google-cloud/pubsub';
import { journeyPlannerClient_v3 } from '../../../graphql/graphql-client';
import { getEnv } from '../../../utils/getenv';
import { IDeparturesService } from '../../interface';
import { APIError, DepartureRealtimeQuery } from '../../types';
import { EnturServiceAPI } from '../entur';
import {
  StopPlaceQuayDeparturesDocument,
  StopPlaceQuayDeparturesQuery,
  StopPlaceQuayDeparturesQueryVariables
} from './gql/jp3/stop-departures.graphql-gen';
import { getRealtimeDepartureTime } from '../stops/departure-time';
import {
  QuayDeparturesDocument,
  QuayDeparturesQuery,
  QuayDeparturesQueryVariables
} from './gql/jp3/quay-departures.graphql-gen';
import {
  NearestStopPlacesDocument,
  NearestStopPlacesQuery,
  NearestStopPlacesQueryVariables
} from './gql/jp3/stops-nearest.graphql-gen';
import {
  StopsDetailsDocument,
  StopsDetailsQuery,
  StopsDetailsQueryVariables
} from './gql/jp3/stops-details.graphql-gen';
import {
  filterStopPlaceFavorites,
  filterQuayFavorites,
  extractStopPlaces,
  extractLineInfos,
  extractQuays,
  callMatchesQueriedLineName
} from './utils/favorites';
import {
  FavouriteDepartureDocument,
  FavouriteDepartureQuery,
  FavouriteDepartureQueryVariables
} from './gql/jp3/favourite-departure.graphql-gen';
import {
  DepartureGroup,
  QuayGroup,
  StopPlaceGroup
} from '../../../types/departures';

const ENV = getEnv();
const topicName = `analytics_departures_search`;
const topicNameGroups = `analytics_departure_groups_search`;
const topicNameRealtime = `analytics_departure_realtime`;

export default (
  service: EnturServiceAPI,
  pubSubClient: PubSub
): IDeparturesService => {
  // createTopic might fail if the topic already exists; ignore.
  createAllTopics(pubSubClient);

  const pubOpts = {
    batching: {
      maxMessages: 100,
      maxMilliseconds: 5 * 1000
    }
  };

  const batchedPublisher = pubSubClient.topic(topicName, pubOpts);
  const batchedPublisherGroups = pubSubClient.topic(topicNameGroups, pubOpts);
  const batchedPublisherRealtime = pubSubClient.topic(
    topicNameRealtime,
    pubOpts
  );

  const fetchDeparturesForLine = async (quayId: string, lineId: string) => {
    try {
      const result = await journeyPlannerClient_v3.query<
        FavouriteDepartureQuery,
        FavouriteDepartureQueryVariables
      >({
        query: FavouriteDepartureDocument,
        variables: {
          quayIds: quayId,
          lines: lineId
        }
      });

      if (result.errors) {
        return Result.err(new APIError(result.errors));
      }
      return Result.ok(result.data);
    } catch (error) {
      return Result.err(new APIError(error));
    }
  };

  const api: IDeparturesService = {
    async getFavouriteDepartures(query) {
      return Promise.all(
        query.map(async fav => {
          return await fetchDeparturesForLine(fav.quayId, fav.lineId);
        })
      )
        .then(results => {
          const validResults = results
            .filter(res => res.isOk)
            .map(res => res.unwrap());

          // Create Departure Groups
          const lineInfos = extractLineInfos(validResults);
          const departureGroups: DepartureGroup[] = lineInfos.map(lineInfo => {
            return {
              lineInfo: lineInfo,
              departures: []
            };
          });

          // Add calls to DepartureGroups
          validResults
            .map(result => result.quays)
            .flatMap(quay => quay)
            .map(quay => quay.estimatedCalls)
            .flatMap(call => call)
            .filter(call => callMatchesQueriedLineName(call, query))
            .forEach(call => {
              departureGroups
                .find(group => {
                  return (
                    group.lineInfo?.lineId === call.serviceJourney?.line.id &&
                    group.lineInfo?.lineName ===
                      call.destinationDisplay?.frontText
                  );
                })
                ?.departures.push({
                  aimedTime: call.aimedDepartureTime,
                  serviceDate: call.date,
                  time: call.expectedDepartureTime,
                  situations: [],
                  serviceJourneyId: call.serviceJourney?.id
                });
            });

          // Create QuayGroups
          const quayGroups: QuayGroup[] = extractQuays(validResults).map(
            quayInfo => {
              return {
                quay: quayInfo,
                group: departureGroups.filter(group => {
                  return group.lineInfo?.quayId === quayInfo.id;
                })
              };
            }
          );

          // Create StopPlaceGroups
          const stopPlaceGroups: StopPlaceGroup[] = extractStopPlaces(
            validResults
          ).map(stopPlaceInfo => {
            return {
              stopPlace: stopPlaceInfo,
              quays: quayGroups.filter(quayGroup => {
                return quayGroup.quay.stopPlaceId === stopPlaceInfo.id;
              })
            };
          });

          return Result.ok(stopPlaceGroups);
        })
        .catch(err => {
          return Result.err(err);
        });
    },

    async getStopPlacesByPosition({
      latitude,
      longitude,
      distance = 1000,
      count = 10,
      after
    }) {
      try {
        const result = await journeyPlannerClient_v3.query<
          NearestStopPlacesQuery,
          NearestStopPlacesQueryVariables
        >({
          query: NearestStopPlacesDocument,
          variables: {
            latitude,
            longitude,
            distance,
            after,
            count
          }
        });

        if (result.errors) {
          return Result.err(new APIError(result.errors));
        }

        return Result.ok(result.data);
      } catch (error) {
        return Result.err(new APIError(error));
      }
    },

    async getStopsDetails({ ids }) {
      try {
        const result = await journeyPlannerClient_v3.query<
          StopsDetailsQuery,
          StopsDetailsQueryVariables
        >({
          query: StopsDetailsDocument,
          variables: {
            ids
          }
        });

        if (result.errors) {
          return Result.err(new APIError(result.errors));
        }

        return Result.ok(result.data);
      } catch (error) {
        return Result.err(new APIError(error));
      }
    },
    async getStopQuayDepartures(
      { id, numberOfDepartures = 10, startTime, timeRange },
      payload
    ) {
      const favorites = payload?.favorites;
      try {
        /**
         * If favorites are provided, get more departures per quay from journey
         * planner and set limitPerLine instead, since some departures may be
         * filtered out.
         */
        const limit = favorites
          ? {
              limitPerLine: numberOfDepartures,
              numberOfDepartures: numberOfDepartures * 10
            }
          : { numberOfDepartures: numberOfDepartures };

        const result = await journeyPlannerClient_v3.query<
          StopPlaceQuayDeparturesQuery,
          StopPlaceQuayDeparturesQueryVariables
        >({
          query: StopPlaceQuayDeparturesDocument,
          variables: {
            id,
            startTime,
            timeRange,
            filterByLineIds: favorites?.map(f => f.lineId),
            ...limit
          }
        });

        if (result.errors) {
          return Result.err(new APIError(result.errors));
        }

        const data = filterStopPlaceFavorites(
          result.data,
          favorites,
          numberOfDepartures
        );

        return Result.ok(data);
      } catch (error) {
        return Result.err(new APIError(error));
      }
    },
    async getQuayDepartures(
      {
        id,
        numberOfDepartures = 1000,
        startTime,
        timeRange = 86400 // 24 hours
      },
      payload
    ) {
      const favorites = payload?.favorites;
      try {
        const result = await journeyPlannerClient_v3.query<
          QuayDeparturesQuery,
          QuayDeparturesQueryVariables
        >({
          query: QuayDeparturesDocument,
          variables: {
            id,
            numberOfDepartures,
            startTime,
            timeRange,
            filterByLineIds: favorites?.map(f => f.lineId)
          }
        });

        if (result.errors) {
          return Result.err(new APIError(result.errors));
        }

        const data = filterQuayFavorites(result.data, favorites);

        return Result.ok(data);
      } catch (error) {
        return Result.err(new APIError(error));
      }
    },
    async getDepartureRealtime(query: DepartureRealtimeQuery) {
      pub(batchedPublisherRealtime, { query });
      return getRealtimeDepartureTime(query, journeyPlannerClient_v3);
    }
  };

  return api;
};

function pub(topic: Topic, data: object) {
  try {
    topic.publish(Buffer.from(JSON.stringify(data)), {
      environment: ENV
    });
  } catch (e) {}
}

function createAllTopics(pubSubClient: PubSub) {
  [topicName, topicNameGroups, topicNameRealtime].forEach(topic =>
    pubSubClient.createTopic(topic).catch(() => {})
  );
}
