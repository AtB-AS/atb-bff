import {IDeparturesGroupedService} from '../../interface';
import {getDepartureFavorites} from './departure-favorites';

export default (): IDeparturesGroupedService => ({
  getDeparturesFavorites: (payload, query, headers) =>
    getDepartureFavorites(query, headers, payload.favorites),
});
