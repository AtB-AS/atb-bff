import Hapi from '@hapi/hapi';
import {Result} from '@badrap/result';
import tripsRoutes from '../index';
import {ITrips_v2} from '../../../service/interface';
import {TripsQuery} from '../../../service/impl/trips/journey-gql/trip.graphql-gen';

const emptyPage = {
  trip: {
    nextPageCursor: 'next-cursor',
    previousPageCursor: 'previous-cursor',
    tripPatterns: [],
  },
} as unknown as TripsQuery;

const pageWithTrips = {
  trip: {
    nextPageCursor: 'next-cursor-2',
    previousPageCursor: 'previous-cursor-2',
    tripPatterns: [{}],
  },
} as unknown as TripsQuery;

describe('POST /bff/v2/trips retries', () => {
  let server: Hapi.Server;
  const getTrips = jest.fn();

  beforeAll(() => {
    server = Hapi.server();
    tripsRoutes(server)({getTrips} as unknown as ITrips_v2);
  });

  beforeEach(() => {
    getTrips.mockReset();
    getTrips
      .mockResolvedValueOnce(Result.ok(emptyPage))
      .mockResolvedValueOnce(Result.ok(pageWithTrips));
  });

  const postTrips = (arriveBy: boolean) =>
    server.inject({
      method: 'POST',
      url: '/bff/v2/trips',
      payload: {
        from: {place: 'NSR:StopPlace:1'},
        to: {place: 'NSR:StopPlace:2'},
        arriveBy,
      },
    });

  it('retries with nextPageCursor when departing', async () => {
    const response = await postTrips(false);

    expect(response.statusCode).toBe(200);
    expect(getTrips).toHaveBeenCalledTimes(2);
    expect(getTrips.mock.calls[1][0].cursor).toBe('next-cursor');
  });

  it('retries with previousPageCursor when arriving by', async () => {
    const response = await postTrips(true);

    expect(response.statusCode).toBe(200);
    expect(getTrips).toHaveBeenCalledTimes(2);
    expect(getTrips.mock.calls[1][0].cursor).toBe('previous-cursor');
  });
});
