import { IDepartureFavoritesService } from '../../interface';
import { getDepartureFavorites } from './departure-group';

export default (): IDepartureFavoritesService => {
  const api: IDepartureFavoritesService = {
    async getDeparturesFavorites(payload, query) {
      return getDepartureFavorites(query, payload.favorites);
    }
  };

  return api;
};
