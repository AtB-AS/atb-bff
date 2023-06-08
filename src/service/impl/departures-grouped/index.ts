import {IDeparturesGroupedService} from '../../interface';
import {
  getDeparturesGrouped,
  getDeparturesGroupedNearest,
} from './departure-group';
import {getDepartureFavorites} from './departure-favorites';

export default (): IDeparturesGroupedService => {
  const api: IDeparturesGroupedService = {
    async getDeparturesGrouped(payload, query, headers) {
      return payload.location.layer === 'venue'
        ? getDeparturesGrouped(
            payload.location.id,
            query,
            headers,
            payload.favorites,
          )
        : getDeparturesGroupedNearest(
            payload.location.coordinates,
            1000,
            query,
            headers,
            payload.favorites,
          );
    },
    async getDeparturesFavorites(payload, query, headers) {
      return getDepartureFavorites(query, headers, payload.favorites);
    },
  };

  return api;
};
