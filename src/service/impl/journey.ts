import { TripPattern } from '@entur/sdk';
import { IJourneyService } from '../interface';
import { Result } from '@badrap/result';
import { APIError, TripPatternsQuery } from '../types';

import { PubSub } from '@google-cloud/pubsub';
import { getEnv } from '../../utils/getenv';
import { generateId, getServiceIds } from '../../utils/journey-utils';
import { EnturServiceAPI } from './entur';

const ENV = getEnv();
const topicName = `analytics_trip_search`;

export default (
  service: EnturServiceAPI,
  pubSubClient: PubSub
): IJourneyService => {
  // createTopic might fail if the topic already exists; ignore.
  pubSubClient.createTopic(topicName).catch(() => {});

  const batchedPublisher = pubSubClient.topic(topicName, {
    batching: {
      maxMessages: 100,
      maxMilliseconds: 5 * 1000
    }
  });

  const api: IJourneyService = {
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
        batchedPublisher.publish(Buffer.from(JSON.stringify(query)), {
          environment: ENV
        });
        const trips = await service.getTripPatterns(query);
        return Result.ok(addIdsToTrips(trips, query));
      } catch (error) {
        return Result.err(new APIError(error));
      }
    },
    async getTripPattern({ query, serviceIds }) {
      // There are no ways to get actual specific trip pattern after having retrieved it,
      // So we try to do the search with the same query and hope the first result is the same.
      // The first query can have different legs as part of the pattern, and is therefore not
      // the same trip. So we match on all service journey id's and see if they match. If not, 404
      // and we should show an error to the user.
      //
      // Fetching 20 results as in some cases, when there are many busses passing, you wont
      // get the right result (non deterministic search).
      //
      // @TODO At some point we maybe can compensate for this by using cache layer and
      // manually updating all clocks.
      return (
        await api.getTripPatterns({
          ...query,
          limit: 20
        })
      ).map(trips => findTripsMatchingServiceIds(trips, serviceIds) ?? null);
    }
  };

  return api;
};

function addIdsToTrips(trips: TripPattern[], query: TripPatternsQuery) {
  return trips.map(oneTrip => ({
    ...oneTrip,
    id: generateId(oneTrip, query)
  }));
}

function findTripsMatchingServiceIds(
  trips: TripPattern[],
  serviceIds: string[]
) {
  const sIdsAsString = (sIds: string[]) => sIds.join(',');
  const originalServiceIds = sIdsAsString(serviceIds);
  return trips.find(trip => {
    return sIdsAsString(getServiceIds(trip)) === originalServiceIds;
  });
}
