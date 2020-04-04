import { Result } from '@badrap/result';
import { EnturService } from '@entur/sdk';
import { IGeocoderService } from '../interface';
import { APIError } from '../types';
import { PubSub } from '@google-cloud/pubsub';
import { getEnv } from '../../utils/getenv';

const ENV = getEnv();
const topicName = `analytics_geocoder_features`;

export default (service: EnturService, pubSubClient: PubSub): IGeocoderService => {
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
    async getFeatures({ query, lat, lon, ...params }) {
      try {
        batchedPublisher
          .publish(Buffer.from(JSON.stringify(query)), { environment: ENV });
        const features = await service.getFeatures(
          query,
          { latitude: lat, longitude: lon },
          { ...params }
        );

        return Result.ok(features);
      } catch (error) {
        return Result.err(new APIError(error));
      }
    },
    async getFeaturesReverse({ lat, lon, ...params }) {
      try {
        const features = await service.getFeaturesReverse(
          { latitude: lat, longitude: lon },
          { ...params }
        );

        return Result.ok(features);
      } catch (error) {
        return Result.err(new APIError(error));
      }
    }
  };
}
