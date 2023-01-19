import { IDeparturesGroupedService } from '../../interface';
import { DepartureRealtimeQuery } from '../../types';
import {
  getDeparturesGrouped,
  getDeparturesGroupedNearest
} from './departure-group';
import { getRealtimeDepartureTime } from './departure-time';
import { getDepartureFavorites } from './departure-favorites';

export default (): IDeparturesGroupedService => {
  const api: IDeparturesGroupedService = {
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
    },
    async getDeparturesFavorites(payload, query) {
      return getDepartureFavorites(query, payload.favorites);
    }
  };

  return api;
};
