import {
  DepartureGroupsPayload,
  DepartureGroupsQuery,
  DepartureRealtimeQuery,
  DeparturesFromLocationPagingQuery,
  FeatureLocation,
  TripPatternsQuery
} from '../service/types';
import { PubSub, Topic } from '@google-cloud/pubsub';

type Topics = {
  departuresSearchGroupsTopic: string;
  departuresSearchRealtimeTopic: string;
  departuresSearchTopic: string;
  getFeaturesTopic: string;
  getTripPatternsTopic: string;
};

type Meta = {
  environment: string;
};

export default (pubSub: PubSub, topics: Topics, meta: Meta) => {
  const departuresSearchGroupsTopic = batchedTopic(
    pubSub,
    topics.departuresSearchGroupsTopic
  );
  const departuresSearchRealtimeTopic = batchedTopic(
    pubSub,
    topics.departuresSearchRealtimeTopic
  );
  const departuresSearchTopic = batchedTopic(
    pubSub,
    topics.departuresSearchTopic
  );
  const getFeaturesTopic = batchedTopic(pubSub, topics.getFeaturesTopic);
  const getTripPatternsTopic = batchedTopic(
    pubSub,
    topics.getTripPatternsTopic
  );

  return {
    async departuresSearchGroups(
      payload: DepartureGroupsPayload,
      query: DepartureGroupsQuery
    ) {
      await departuresSearchGroupsTopic.publish(serialize({ payload, query }), {
        environment: meta.environment
      });
    },

    async departuresSearchRealtime(query: DepartureRealtimeQuery) {
      await departuresSearchRealtimeTopic.publish(serialize({ query }), {
        environment: meta.environment
      });
    },

    async departuresSearch(
      location: FeatureLocation,
      query: DeparturesFromLocationPagingQuery
    ) {
      await departuresSearchTopic.publish(serialize({ location, query }), {
        environment: meta.environment
      });
    },

    async getFeatures(query: string) {
      await getFeaturesTopic.publish(Buffer.from(query), {
        environment: meta.environment
      });
    },

    async getTripPatterns(query: TripPatternsQuery) {
      await getTripPatternsTopic.publish(serialize(query), {
        environment: meta.environment
      });
    }
  };
};

function serialize(data: object): Buffer {
  return Buffer.from(JSON.stringify(data));
}

function batchedTopic(client: PubSub, topicName: string): Topic {
  return client.topic(topicName, {
    batching: {
      maxMessages: 100,
      maxMilliseconds: 5 * 1000
    }
  });
}
