import {IMobilityService} from '../../interface';
import {Result} from '@badrap/result';
import {APIError} from '../../../utils/api-error';
import {
  mobilityClient,
  mobilityClientDev,
} from '../../../graphql/graphql-client';
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
import {NIVEL_API_KEY, NIVEL_BASEURL} from '../../../config/env';
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
import {
  GetGeofencingZonesDocument,
  GetGeofencingZonesQuery,
  GetGeofencingZonesQueryVariables,
} from './mobility-gql/geofencing-zones.graphql-gen';

const nivelBaseUrl = NIVEL_BASEURL || '';
const nivelApiKey = NIVEL_API_KEY || '';

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
    // Prevent unnecessary calls to Entur when no vehicles are requested
    if (!query.includeBicycles && !query.includeScooters) {
      return Result.ok({});
    }
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
      const result = await mobilityClientDev(headers).query<
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
    // Prevent unnecessary calls to Entur when no stations are requested
    if (!query.includeBicycles && !query.includeCars) {
      return Result.ok({});
    }
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

  async getGeofencingZones(query, headers) {
    try {
      const result = await mobilityClient(headers).query<
        GetGeofencingZonesQuery,
        GetGeofencingZonesQueryVariables
      >({
        query: GetGeofencingZonesDocument,
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
        {headers: {'x-api-key': nivelApiKey}},
        nivelBaseUrl,
      );
      const mapped = {
        ...response,
        providers: response.providers.map((provider) => ({
          ...provider,
          // The image field can in some cases be null, but the app expects it
          // to be either set or undefined
          image: provider.image ?? undefined,
        })),
      };
      const result = violationsReportingInitQueryResultSchema.validate(mapped, {
        stripUnknown: true,
      });
      if (result.error) {
        console.error(
          `Validation error for request with correlationId ${headers.correlationId}: ${result.error.message}`,
        );
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
        `/atb/vehicle?${urlParams}`,
        headers,
        {headers: {'x-api-key': nivelApiKey}},
        nivelBaseUrl,
      );
      const result = violationsVehicleLookupResultSchema.validate(response, {
        stripUnknown: true,
      });
      if (result.error) {
        console.error(
          `Validation error for request with correlationId ${headers.correlationId}: ${result.error.message}`,
        );
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
      const response = await post(
        `/atb/report`,
        query,
        headers,
        {headers: {'x-api-key': nivelApiKey}},
        nivelBaseUrl,
      );
      if (!response.ok)
        return Result.err(new APIError(new Error(response.statusText)));
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
          (vehicle.currentRangeMeters / vehicle.vehicleType.maxRangeMeters) *
            100,
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
