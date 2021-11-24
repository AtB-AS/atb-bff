import { PubSub, Topic } from '@google-cloud/pubsub';
import { getEnv } from '../../../utils/getenv';
import { ITrips_v3 } from '../../interface';
import { EnturServiceAPI } from '../entur';

import { getTrips } from './trips';

const ENV = getEnv();
const topicName = `analytics_trips_search`;

export default (service: EnturServiceAPI, pubSubClient: PubSub): ITrips_v3 => {
  // createTopic might fail if the topic already exists; ignore.
  createAllTopics(pubSubClient);

  const pubOpts = {
    batching: {
      maxMessages: 100,
      maxMilliseconds: 5 * 1000
    }
  };

  const batchedPublisher = pubSubClient.topic(topicName, pubOpts);
  const api: ITrips_v3 = {
    async getTrips(query) {
      pub(batchedPublisher, { query });
      return getTrips(query);
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
  [topicName].forEach(topic =>
    pubSubClient.createTopic(topic).catch(() => {})
  );
}
