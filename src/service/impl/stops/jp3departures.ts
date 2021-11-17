import { Result } from '@badrap/result';
import { EstimatedCall, StopPlaceDetails } from '@entur/sdk';
import { PubSub, Topic } from '@google-cloud/pubsub';
import haversineDistance from 'haversine-distance';
import { journeyPlannerClient_v3 } from '../../../graphql/graphql-client';
import { getEnv } from '../../../utils/getenv';
import { IStopsService, IStopsService_v3 } from '../../interface';
import { APIError, DepartureRealtimeQuery } from '../../types';
import { EnturServiceAPI } from '../entur';
import {
  getDeparturesGrouped,
  getDeparturesGroupedNearest
} from './departure-group';
import { getRealtimeDepartureTime } from './departure-time';
import {
  getDeparturesFromLocation,
  getDeparturesFromStops
} from './departures';
import {
  NearestPlacesDocument,
  NearestPlacesQuery,
  NearestPlacesQueryVariables
} from './journey-gql/jp3/nearest-places.graphql-gen';

type EstimatedCallWithStop = EstimatedCall & { stop: StopPlaceDetails };

const ENV = getEnv();
const topicName = `analytics_departures_search`;
const topicNameGroups = `analytics_departure_groups_search`;
const topicNameRealtime = `analytics_departure_realtime`;

export default (
  service: EnturServiceAPI,
  pubSubClient: PubSub
): IStopsService_v3 => {
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

  const api: IStopsService_v3 = {
    async getStopPlacesByPosition({
      lat: latitude,
      lon: longitude,
      distance = 1000,
      includeUnusedQuays
    }) {
      console.log('getStopPlacesByPosition v3');
      try {
        const stops = await service.getStopPlacesByPosition(
          {
            latitude,
            longitude
          },
          distance,
          { includeUnusedQuays }
        );

        const result = await journeyPlannerClient_v3.query<
          NearestPlacesQuery,
          NearestPlacesQueryVariables
        >({
          query: NearestPlacesDocument,
          variables: {
            latitude,
            longitude,
            maximumDistance: distance,
            filterByInUse: includeUnusedQuays
            // filterByPlaceTypes: 'quay',
          }
        });

        if (result.errors) {
          return Result.err(new APIError(result.errors));
        }

        return Result.ok(stops);
      } catch (error) {
        return Result.err(new APIError(error));
      }
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
