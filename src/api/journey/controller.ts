import * as Hapi from '@hapi/hapi';

import { Location, QueryMode } from '@entur/sdk';
import { IJourneyService } from '.';
import { inject, injectable } from 'tsyringe';

@injectable()
export class JourneyController {
  constructor(
    @inject('JourneyService') private journeyService: IJourneyService
  ) {}

  async findTrip(request: Hapi.Request, h: Hapi.ResponseToolkit) {
    /* Validator ensures correct types */
    const { from, to, searchDate } = (request.query as unknown) as {
      from: string;
      to: string;
      searchDate: Date;
    };

    const trips = await this.journeyService.findTrips(from, to, searchDate);

    return trips;
  }

  async getTripPatterns(request: Hapi.Request, h: Hapi.ResponseToolkit) {
    /* Validator ensures correct types */
    const {
      from,
      to,
      searchDate,
      arriveBy,
      limit,
      modes,
      wheelchairAccessible
    } = (request.payload as unknown) as {
      from: Location;
      to: Location;
      searchDate: Date;
      arriveBy: boolean;
      limit: number;
      modes: Array<QueryMode>;
      wheelchairAccessible: boolean;
    };
    const trips = await this.journeyService.getTripPatterns({
      from,
      to,
      searchDate,
      arriveBy,
      limit,
      modes,
      wheelchairAccessible
    });

    return trips;
  }
}
