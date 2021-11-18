import { Result } from '@badrap/result';
import { EstimatedCall, StopPlaceDetails } from '@entur/sdk';
import { PubSub, Topic } from '@google-cloud/pubsub';
import { journeyPlannerClient_v3 } from '../../../graphql/graphql-client';
import { getEnv } from '../../../utils/getenv';
import { IStopsService_v3 } from '../../interface';
import { APIError } from '../../types';
import { EnturServiceAPI } from '../entur';
import {
  NearestPlacesV3Document,
  NearestPlacesV3Query,
  NearestPlacesV3QueryVariables
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
      latitude,
      longitude,
      maximumDistance = 1000,
      maximumResults = 10,
      filterByInUse = true
    }) {
      try {
        console.log('getstopplace');
        const result = await journeyPlannerClient_v3.query<
          NearestPlacesV3Query,
          NearestPlacesV3QueryVariables
        >({
          query: NearestPlacesV3Document,
          variables: {
            latitude,
            longitude,
            maximumDistance,
            maximumResults,
            filterByInUse
          }
        });

        if (result.errors) {
          return Result.err(new APIError(result.errors));
        }

        return Result.ok(result.data);
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
