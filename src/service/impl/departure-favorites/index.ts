import { PubSub, Topic } from '@google-cloud/pubsub';
import { getEnv } from '../../../utils/getenv';
import { IDepartureFavoritesService } from '../../interface';
import { EnturServiceAPI } from '../entur';
import { getDepartureFavorites } from './departure-group';

const ENV = getEnv();
const topicName = `analytics_departures_search`;
const topicNameGroups = `analytics_departure_groups_search`;
const topicNameRealtime = `analytics_departure_realtime`;

export default (
  service: EnturServiceAPI,
  pubSubClient: PubSub
): IDepartureFavoritesService => {
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

  const api: IDepartureFavoritesService = {
    async getDeparturesFavorites(payload, query) {
      pub(batchedPublisherGroups, { payload, query });
      return getDepartureFavorites(query, payload.favorites);
    }
    // async getDepartureRealtime(query: DepartureRealtimeQuery) {
    //   pub(batchedPublisherRealtime, { query });
    //   return getRealtimeDepartureTime(query);
    // }
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
