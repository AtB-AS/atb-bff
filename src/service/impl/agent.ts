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

export default (stopsService: IStopsService): IAgentService => ({
  async getNextDepartureFromStop(query) {
    const now = Date.now();
    const departures = await stopsService.getDeparturesBetweenStopPlaces(
      query,
      {
        limit: 2,
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
  }
});
