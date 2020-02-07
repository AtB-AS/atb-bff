import util from 'util';
import { IAgentService, IStopsService } from '../interface';
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
export default (stopsService: IStopsService): IAgentService => ({
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
    const nearestStop = await stopsService.getStopPlacesByPosition({
      distance: DEFAULT_DISTANCE,
      lat,
      lon
    });
    if (nearestStop.isErr) {
      console.error(nearestStop.error);
      return Result.err(new AgentError('Fant ingen stoppesteder nær deg.'));
    }
    const departures = await stopsService.getDeparturesBetweenStopPlaces(
      {
        from: nearestStop.value[0].id,
        to
      },
      { limit: DEFAULT_LIMIT, start: addMinutes(now, 2) }
    );
    if (departures.isErr) {
      console.error(departures.error);
      return Result.err(
        new AgentError('Fant ingen avganger mellom stoppesteder.')
      );
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
  }
});
