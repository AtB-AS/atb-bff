import { IStopsService } from '../../interface';
import { DepartureRealtimeQuery } from '../../types';
import { EnturServiceAPI } from '../entur';
import {
  getDeparturesGrouped,
  getDeparturesGroupedNearest
} from './departure-group';
import { getRealtimeDepartureTime } from './departure-time';

export default (service: EnturServiceAPI): IStopsService => {
  // createTopic might fail if the topic already exists; ignore.
  const api: IStopsService = {
    async getDeparturesGrouped(payload, query) {
      return payload.location.layer === 'venue'
        ? getDeparturesGrouped(payload.location.id, query, payload.favorites)
        : getDeparturesGroupedNearest(
            payload.location.coordinates,
            1000,
            query,
            payload.favorites
          );
    },
    async getDepartureRealtime(query: DepartureRealtimeQuery) {
      return getRealtimeDepartureTime(query);
    }
  };

  return api;
};
