import util from 'util';
import { IAgentService, IJourneyService, IStopsService } from '../interface';
import { Result } from '@badrap/result/dist';
import { differenceInMinutes, addMinutes } from 'date-fns';

export class AgentError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AgentError';
  }
}

const DEFAULT_DISTANCE = 1000;

const DEFAULT_LIMIT = 2;
export default (
  stopsService: IStopsService,
  journeyService: IJourneyService
): IAgentService => ({
  async getNextDepartureBetweenStops(query) {
    const now = Date.now();
    const departures = await stopsService.getDeparturesBetweenStopPlaces(
      query,
      {
        limit: DEFAULT_LIMIT,
        start: addMinutes(now, 2)
      }
    );
    if (departures.isErr) {
      return Result.err(departures.error);
    }
    if (departures.value.length < 1) {
      return Result.ok('Fant ingen avganger fra stoppested');
    }

    const firstDeparture = departures.value[0];
    const stopPlace = firstDeparture.quay?.name;
    const line =
      firstDeparture?.serviceJourney?.journeyPattern?.line.publicCode;
    const when = differenceInMinutes(
      new Date(firstDeparture.aimedDepartureTime),
      now
    );
    const ret = util.format(
      'Buss %d går fra %s om %d minutter',
      line,
      stopPlace,
      when
    );

    return Result.ok(ret);
  },
  async getNextDepartureFromCoordinate({ lat, lon, to }) {
    const now = Date.now();
    const toStop = await stopsService.getStopPlace(to);

    if (toStop.isErr || toStop.value === null) {
      return Result.err(new AgentError('Fant ikke stoppested'));
    }
    const departures = await journeyService.getTripPatterns({
      from: {
        coordinates: {
          latitude: lat,
          longitude: lon
        }
      },
      to: {
        coordinates: {
          latitude: toStop.value.latitude,
          longitude: toStop.value.longitude
        }
      },
      arriveBy: false,
      limit: 3,
      modes: ['foot', 'bus'],
      searchDate: new Date(),
      wheelchairAccessible: false
    });

    if (departures.isErr) {
      console.error(departures.error);
      return Result.err(
        new AgentError('Fant ingen avganger mellom stoppesteder.')
      );
    }

    const firstDepartureLegs = departures.value[0].legs;

    const hasMultipleLegs = firstDepartureLegs.length > 1;
    const fromStop = firstDepartureLegs[hasMultipleLegs ? 1 : 0].fromPlace.name;
    const line = firstDepartureLegs[hasMultipleLegs ? 1 : 0].line?.publicCode;
    const when = differenceInMinutes(
      new Date(firstDepartureLegs[hasMultipleLegs ? 1 : 0].aimedStartTime),
      now
    );

    const ret = util.format(
      'Buss %d går fra %s om %d minutter',
      line,
      fromStop,
      when
    );

    return Result.ok(ret);
  }
});
