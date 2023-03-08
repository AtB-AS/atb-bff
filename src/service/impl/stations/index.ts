import { IStationsService } from "../../interface";
import { Result } from "@badrap/result";
import { APIError } from "../../types";
import { mobilityClient } from "../../../graphql/graphql-client";
import { GetStationsDocument, GetStationsQuery, GetStationsQueryVariables } from "./mobility-gql/stations.graphql-gen";

export default (): IStationsService => ({
  async getStations(query) {
    try {
      const result = await mobilityClient.query<
        GetStationsQuery,
        GetStationsQueryVariables
      >({
        query: GetStationsDocument,
        variables: query
      });
      if (result.errors) {
        return Result.err(new APIError(result.errors));
      }
      return Result.ok(result.data);
    } catch (error) {
      return Result.err(new APIError(error));
    }
  }
})
