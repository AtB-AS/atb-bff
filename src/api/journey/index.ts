import Hapi from '@hapi/hapi';

import journeyRoutes from './routes';
import { TripPattern, GetTripPatternsParams } from '@entur/sdk';

export interface IJourneyService {
  findTrips(from: string, to: string, searchDate: Date): Promise<TripPattern[]>;
  getTripPatterns(query: GetTripPatternsParams): Promise<TripPattern[]>;
}

export default function(server: Hapi.Server) {
  journeyRoutes(server);
}
