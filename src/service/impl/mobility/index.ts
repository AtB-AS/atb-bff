import { GetVehiclesListQuery, IMobilityService } from "../../interface";
import { Result } from "@badrap/result";
import { APIError } from "../../types";
import { mobilityClient } from "../../../graphql/graphql-client";
import {
  GetBikeStationDocument,
  GetBikeStationQuery, GetBikeStationQueryVariables,
  GetCarStationDocument,
  GetCarStationQuery,
  GetCarStationQueryVariables,
  GetStationsDocument,
  GetStationsQuery,
  GetStationsQueryVariables
} from "./mobility-gql/stations.graphql-gen";
import {
  GetVehicleDocument,
  GetVehicleQuery, GetVehicleQueryVariables,
  GetVehiclesDocument,
  GetVehiclesQuery,
  GetVehiclesQueryVariables
} from "./mobility-gql/vehicles.graphql-gen";


const calculateFuelPercent = <T extends GetVehicleQuery | GetVehiclesQuery>(data: T): T => ({
  ...data,
  vehicles: data?.vehicles?.map(vehicle => ({
    ...vehicle,
    currentFuelPercent: vehicle.currentFuelPercent
      ? vehicle.currentFuelPercent
      : vehicle.vehicleType.maxRangeMeters
      ? Math.floor(
          (vehicle.currentRangeMeters / vehicle.vehicleType.maxRangeMeters) *
            100
        )
      : undefined
  }))
});

const stripProps = (data: GetVehiclesQuery): GetVehiclesListQuery => ({
  ...data,
  vehicles: data.vehicles?.map(v => ({
    id: v.id,
    lat: v.lat,
    lon: v.lon,
    currentFuelPercent: v.currentFuelPercent
  }))
});

export default (): IMobilityService => ({
  async getVehicles(query) {
    try {
      const result = await mobilityClient.query<
        GetVehiclesQuery,
        GetVehiclesQueryVariables
      >({
        query: GetVehiclesDocument,
        variables: query
      });
      if (result.errors) {
        return Result.err(new APIError(result.errors));
      }
      return Result.ok(stripProps(calculateFuelPercent(result.data)));
    } catch (error) {
      return Result.err(new APIError(error));
    }
  },

  async getVehicle(query) {
    try {
      const result = await mobilityClient.query<
        GetVehicleQuery,
        GetVehicleQueryVariables
      >({
        query: GetVehicleDocument,
        variables: query
      });
      if (result.errors) {
        return Result.err(new APIError(result.errors));
      }
      return Result.ok(calculateFuelPercent(result.data));
    } catch (error) {
      return Result.err(new APIError(error));
    }
  },

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
  },

  async getCarStation(query) {
    try {
      const result = await mobilityClient.query<
        GetCarStationQuery,
        GetCarStationQueryVariables
      >({
        query: GetCarStationDocument,
        variables: query
      });
      if (result.errors) {
        return Result.err(new APIError(result.errors));
      }
      return Result.ok(result.data);
    } catch (error) {
      return Result.err(new APIError(error));
    }
  },

  async getBikeStation(query) {
    try {
      const result = await mobilityClient.query<
        GetBikeStationQuery,
        GetBikeStationQueryVariables
      >({
        query: GetBikeStationDocument,
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
});
