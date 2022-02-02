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

  const api: IDeparturesService = {
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

    async getStopQuayDepartures({
      id,
      numberOfDepartures = 10,
      startTime,
      timeRange
    }) {
      try {
        const result = await journeyPlannerClient_v3.query<
          StopPlaceQuayDeparturesQuery,
          StopPlaceQuayDeparturesQueryVariables
        >({
          query: StopPlaceQuayDeparturesDocument,
          variables: {
            id,
            numberOfDepartures,
            startTime,
            timeRange
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
    async getQuayDepartures({
      id,
      numberOfDepartures = 10,
      startTime,
      timeRange = 86400 // 24 hours
    }) {
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
            timeRange
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
