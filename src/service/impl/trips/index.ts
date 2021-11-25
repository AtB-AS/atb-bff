import { PubSub, Topic } from '@google-cloud/pubsub';
import { getEnv } from '../../../utils/getenv';
import { ITrips_v3 } from '../../interface';
import { EnturServiceAPI } from '../entur';

import {getSingleTrip, getTrips} from './trips';
import {TripsQueryWithJourneyIds} from "../../../types/trips";

const ENV = getEnv();
const topicName_trips = `analytics_trips_search`;
const topicName_singleTrip = 'analytics_single-trip_search';



export default (service: EnturServiceAPI, pubSubClient: PubSub): ITrips_v3 => {
  // createTopic might fail if the topic already exists; ignore.
  createAllTopics(pubSubClient);

  const pubOpts = {
    batching: {
      maxMessages: 100,
      maxMilliseconds: 5 * 1000
    }
  };

  const tripsTopic = pubSubClient.topic(topicName_trips, pubOpts);
  const singleTripTopic = pubSubClient.topic(topicName_singleTrip, pubOpts)

  const api: ITrips_v3 = {
    async getTrips(query) {
      pub(tripsTopic, { query });
      return getTrips(query);
    },

    async getSingleTrip(queryWithIds: TripsQueryWithJourneyIds) {
      pub(singleTripTopic, queryWithIds);
      return getSingleTrip(queryWithIds);
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
  [topicName_trips, topicName_singleTrip].forEach(topic =>
    pubSubClient.createTopic(topic).catch(() => {})
  );
}
