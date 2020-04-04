import { EnturService } from '@entur/sdk';
import { IJourneyService } from '../interface';
import { Result } from '@badrap/result';
import { APIError } from '../types';

import { PubSub } from '@google-cloud/pubsub';
import { getEnv } from '../../utils/getenv';

const ENV = getEnv();
const topicName = `analytics_trip_search`;

export default (
  service: EnturService,
  pubSubClient: PubSub
): IJourneyService => {

  // createTopic might fail if the topic already exists; ignore.
  pubSubClient.createTopic(topicName).catch(() => {
  });

  const batchedPublisher = pubSubClient.topic(topicName, {
    batching: {
      maxMessages: 100,
      maxMilliseconds: 5 * 1000
    }
  });
  return {
    async getTrips({ from, to, when }) {
      try {
        const trips = await service.findTrips(from, to, when);
        return Result.ok(trips);
      } catch (error) {
        return Result.err(new APIError(error));
      }
    },
    async getTripPatterns(query) {
      try {
        await batchedPublisher
          .publish(Buffer.from(JSON.stringify(query)), { environment: ENV });
        const trips = await service.getTripPatterns(query);
        return Result.ok(trips);
      } catch (error) {
        return Result.err(new APIError(error));
      }
    }
  };
};
