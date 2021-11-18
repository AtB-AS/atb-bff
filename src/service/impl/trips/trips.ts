import {TripsDocument, TripsQuery, TripsQueryVariables} from "./graphql/jp3/trip.graphql-gen";
import {Result} from '@badrap/result';
import {APIError, TripQuery_v3, TripsData} from "../../types";
import {journeyPlannerClient_v3} from '../../../graphql/graphql-client';


export async function getTrips(query: TripQuery_v3): Promise<Result<TripsQuery, APIError>> {

  try {
    const result = await journeyPlannerClient_v3.query<
      TripsQuery,
      TripsQueryVariables>
    ({
      query: TripsDocument,
      variables: {
        from: {place: query.from},
        to: {place: query.to}
      }
    });

    if (result.errors) {
      return Result.err(new APIError(result.errors));
    }
    return Result.ok(mapTripsData(result.data));
  } catch (error) {
    return Result.err(new APIError(error))
  }
}

function mapTripsData(input: TripsQuery): TripsQuery {

  input.trip?.tripPatterns.forEach(pattern=> {
    (pattern as any).id = Math.floor((Math.random()*1000000)).toString(24)
  })

  return input;
}
