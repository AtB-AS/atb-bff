import { EnturService } from '@entur/sdk';
import { IJourneyService } from '../interface';
import { Result } from '@badrap/result';
import { APIError } from '../types';

import { PubSub } from '@google-cloud/pubsub';
import { getEnv } from '../../utils/getenv';

const ENV = getEnv();

export default (
  service: EnturService,
  pubSubClient: PubSub
): IJourneyService => {
  const topic = `analytics_trip_search`;
  const batchedPublisher = pubSubClient.topic(topic, {
    batching: {
      maxMessages: 10,
      maxMilliseconds: 10 * 1000
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
        batchedPublisher
          .publish(Buffer.from(JSON.stringify(query)), { environment: ENV })
          .catch(err => console.error(err));
        const trips = await service.getTripPatterns(query);
        return Result.ok(trips);
      } catch (error) {
        return Result.err(new APIError(error));
      }
    }
  };
};
