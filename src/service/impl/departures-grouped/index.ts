import {IDeparturesGroupedService} from '../../interface';
import {getDepartureFavorites} from './departure-favorites';

export default (): IDeparturesGroupedService => ({
  getDeparturesFavorites: (payload, query, request) =>
    getDepartureFavorites(query, request, payload.favorites),
});
