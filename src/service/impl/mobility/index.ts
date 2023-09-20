import {IMobilityService} from '../../interface';
import {Result} from '@badrap/result';
import {APIError} from '../../../utils/api-error';
import {mobilityClient} from '../../../graphql/graphql-client';
import {
  GetBikeStationDocument,
  GetBikeStationQuery,
  GetBikeStationQueryVariables,
  GetCarStationDocument,
  GetCarStationQuery,
  GetCarStationQueryVariables,
  GetStations_V2Document,
  GetStations_V2Query,
  GetStations_V2QueryVariables,
  GetStationsDocument,
  GetStationsQuery,
  GetStationsQueryVariables,
} from './mobility-gql/stations.graphql-gen';
import {
  GetVehicleDocument,
  GetVehicleQuery,
  GetVehicleQueryVariables,
  GetVehicles_V2Document,
  GetVehicles_V2Query,
  GetVehicles_V2QueryVariables,
  GetVehiclesDocument,
  GetVehiclesQuery,
  GetVehiclesQueryVariables,
} from './mobility-gql/vehicles.graphql-gen';
import {
  VehicleBasicFragment,
  VehicleExtendedFragment,
} from '../fragments/mobility-gql/vehicles.graphql-gen';
import {ReqRefDefaults, Request} from '@hapi/hapi';
import {get, post} from '../../../utils/fetch-client';
import {NIVEL_BASEURL} from '../../../config/env';
import {
  ViolationsReportingInitQuery,
  ViolationsReportingInitQueryResult,
  ViolationsReportQuery,
  ViolationsReportQueryResult,
  ViolationsVehicleLookupQuery,
  ViolationsVehicleLookupQueryResult,
} from '../../types';
import {
  violationsReportingInitQueryResultSchema,
  violationsVehicleLookupResultSchema,
} from './schema';

const nivelBaseUrl =
  NIVEL_BASEURL || 'https://atb.stage.api.reporting.nivel.no';

export default (): IMobilityService => ({
  async getVehicles(query, headers) {
    try {
      const result = await mobilityClient(headers).query<
        GetVehiclesQuery,
        GetVehiclesQueryVariables
      >({
        query: GetVehiclesDocument,
        variables: query,
      });
      if (result.errors) {
        return Result.err(new APIError(result.errors));
      }
      return Result.ok(addFuelPercentageToVehicles(result.data));
    } catch (error) {
      return Result.err(new APIError(error));
    }
  },

  async getVehicles_v2(query, headers) {
    try {
      const result = await mobilityClient(headers).query<
        GetVehicles_V2Query,
        GetVehicles_V2QueryVariables
      >({
        query: GetVehicles_V2Document,
        variables: query,
      });
      if (result.errors) {
        return Result.err(new APIError(result.errors));
      }
      return Result.ok(addFuelPercentageToVehicles_v2(result.data));
    } catch (error) {
      return Result.err(new APIError(error));
    }
  },

  async getVehicle(query, headers) {
    try {
      const result = await mobilityClient(headers).query<
        GetVehicleQuery,
        GetVehicleQueryVariables
      >({
        query: GetVehicleDocument,
        variables: query,
      });
      if (result.errors) {
        return Result.err(new APIError(result.errors));
      }
      return Result.ok(addFuelPercentageToVehicles(result.data));
    } catch (error) {
      return Result.err(new APIError(error));
    }
  },

  async getStations(query, headers) {
    try {
      const result = await mobilityClient(headers).query<
        GetStationsQuery,
        GetStationsQueryVariables
      >({
        query: GetStationsDocument,
        variables: query,
      });
      if (result.errors) {
        return Result.err(new APIError(result.errors));
      }
      return Result.ok(result.data);
    } catch (error) {
      return Result.err(new APIError(error));
    }
  },

  async getStations_v2(query, headers) {
    try {
      const result = await mobilityClient(headers).query<
        GetStations_V2Query,
        GetStations_V2QueryVariables
      >({
        query: GetStations_V2Document,
        variables: query,
      });
      if (result.errors) {
        return Result.err(new APIError(result.errors));
      }
      return Result.ok(result.data);
    } catch (error) {
      return Result.err(new APIError(error));
    }
  },

  async getCarStation(query, headers) {
    try {
      const result = await mobilityClient(headers).query<
        GetCarStationQuery,
        GetCarStationQueryVariables
      >({
        query: GetCarStationDocument,
        variables: query,
      });
      if (result.errors) {
        return Result.err(new APIError(result.errors));
      }
      return Result.ok(result.data);
    } catch (error) {
      return Result.err(new APIError(error));
    }
  },

  async getBikeStation(query, headers) {
    try {
      const result = await mobilityClient(headers).query<
        GetBikeStationQuery,
        GetBikeStationQueryVariables
      >({
        query: GetBikeStationDocument,
        variables: query,
      });
      if (result.errors) {
        return Result.err(new APIError(result.errors));
      }
      return Result.ok(result.data);
    } catch (error) {
      return Result.err(new APIError(error));
    }
  },

  async initViolationsReporting(
    query: ViolationsReportingInitQuery,
    headers: Request<ReqRefDefaults>,
  ): Promise<Result<ViolationsReportingInitQueryResult, APIError>> {
    try {
      const urlParams = new URLSearchParams(query).toString();
      const response = await get<ViolationsReportingInitQueryResult>(
        `/atb/init?${urlParams}`,
        headers,
        {headers: {'x-api-key': headers.headers['x-api-key']}},
        nivelBaseUrl,
      );
      const result = violationsReportingInitQueryResultSchema.validate(
        response,
        {
          stripUnknown: true,
        },
      );
      if (result.error) {
        return Result.err(new APIError(`Invalid response. ${result.error}`));
      }
      return Result.ok(result.value);
    } catch (error) {
      return Result.err(new APIError(error));
    }
  },

  async violationsVehicleLookup(
    query: ViolationsVehicleLookupQuery,
    headers: Request<ReqRefDefaults>,
  ): Promise<Result<ViolationsVehicleLookupQueryResult, APIError>> {
    try {
      const urlParams = new URLSearchParams(query).toString();
      const response = await get<ViolationsReportingInitQueryResult>(
        `/atb/init?${urlParams}`,
        headers,
        {headers: {'x-api-key': headers.headers['x-api-key']}},
        nivelBaseUrl,
      );
      const result = violationsVehicleLookupResultSchema.validate(response, {
        stripUnknown: true,
      });
      if (result.error) {
        return Result.err(new APIError(`Invalid response. ${result.error}`));
      }
      return Result.ok(result.value);
    } catch (error) {
      return Result.err(new APIError(error));
    }
  },

  async sendViolationsReport(
    query: ViolationsReportQuery,
    headers: Request<ReqRefDefaults>,
  ): Promise<Result<ViolationsReportQueryResult, APIError>> {
    try {
      await post<ViolationsReportQueryResult>(
        `/atb/report`,
        query,
        headers,
        {headers: {'x-api-key': headers.headers['x-api-key']}},
        nivelBaseUrl,
      );
      // The Nivel API returns void. If we reach this point, the request is successful.
      return Result.ok({status: 'OK'});
    } catch (error) {
      return Result.err(new APIError(error));
    }
  },
});

const calculateFuelPercent = <
  T extends VehicleBasicFragment | VehicleExtendedFragment,
>(
  vehicle: T,
): T => ({
  ...vehicle,
  currentFuelPercent: vehicle.currentFuelPercent
    ? vehicle.currentFuelPercent
    : vehicle.vehicleType.maxRangeMeters
    ? Math.floor(
        (vehicle.currentRangeMeters / vehicle.vehicleType.maxRangeMeters) * 100,
      )
    : undefined,
});

const addFuelPercentageToVehicles = <
  T extends GetVehicleQuery | GetVehiclesQuery,
>(
  data: T,
): T => ({
  ...data,
  vehicles: data?.vehicles?.map(calculateFuelPercent),
});

const addFuelPercentageToVehicles_v2 = (
  data: GetVehicles_V2Query,
): GetVehicles_V2Query => ({
  ...data,
  scooters: data.scooters?.map(calculateFuelPercent),
  bicycles: data.bicycles?.map(calculateFuelPercent),
});
