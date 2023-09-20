import Hapi from '@hapi/hapi';
import {IMobilityService} from '../../service/interface';
import {
  BikeStationQuery,
  CarStationQuery,
  StationsQuery,
  StationsQuery_v2,
  VehicleQuery,
  VehiclesQuery,
  VehiclesQuery_v2,
  ViolationsReportingInitQuery,
  ViolationsReportQuery,
  ViolationsVehicleLookupQuery,
} from '../../service/types';
import {
  getVehiclesRequest,
  getStationsRequest,
  getVehicleRequest,
  getCarStationRequest,
  getBikeStationRequest,
  getVehiclesRequest_v2,
  getStationsRequest_v2,
  violationsReportingInitRequest,
  violationsVehicleLookupRequest,
  violationsReportRequest,
} from './schema';

export default (server: Hapi.Server) => (service: IMobilityService) => {
  server.route({
    method: 'GET',
    path: '/bff/v2/mobility/vehicles',
    options: {
      tags: ['api', 'vehicle', 'scooter', 'bike', 'coordinates'],
      validate: getVehiclesRequest,
      description: 'Get vehicles (scooters, bikes etc.) within an area',
    },
    handler: async (request, h) => {
      const payload = request.query as unknown as VehiclesQuery;
      return (await service.getVehicles(payload, h.request)).unwrap();
    },
  });

  server.route({
    method: 'GET',
    path: '/bff/v2/mobility/vehicles_v2',
    options: {
      tags: ['api', 'vehicle', 'scooter', 'bike', 'coordinates'],
      validate: getVehiclesRequest_v2,
      description: 'Get vehicles (scooters, bikes etc.) within an area',
    },
    handler: async (request, h) => {
      const payload = request.query as unknown as VehiclesQuery_v2;
      return (await service.getVehicles_v2(payload, h.request)).unwrap();
    },
  });

  server.route({
    method: 'GET',
    path: '/bff/v2/mobility/vehicle',
    options: {
      tags: ['api', 'vehicle', 'scooter', 'bike', 'coordinates'],
      validate: getVehicleRequest,
      description: 'Gets a single vehicle (scooter, bike etc.) within an area',
    },
    handler: async (request, h) => {
      const payload = request.query as unknown as VehicleQuery;
      return (await service.getVehicle(payload, h.request)).unwrap();
    },
  });

  server.route({
    method: 'GET',
    path: '/bff/v2/mobility/stations',
    options: {
      tags: ['api', 'mobility', 'stations', 'bike', 'car'],
      validate: getStationsRequest,
      description: 'Get stations for bikes, car sharing etc.',
    },
    handler: async (request, h) => {
      const payload = request.query as unknown as StationsQuery;

      return (await service.getStations(payload, h.request)).unwrap();
    },
  });

  server.route({
    method: 'GET',
    path: '/bff/v2/mobility/stations_v2',
    options: {
      tags: ['api', 'mobility', 'stations', 'bike', 'car'],
      validate: getStationsRequest_v2,
      description: 'Get stations for bikes, car sharing etc.',
    },
    handler: async (request, h) => {
      const payload = request.query as unknown as StationsQuery_v2;

      return (await service.getStations_v2(payload, h.request)).unwrap();
    },
  });

  server.route({
    method: 'GET',
    path: '/bff/v2/mobility/station/car',
    options: {
      tags: ['api', 'mobility', 'station', 'car'],
      validate: getCarStationRequest,
      description: 'Get details about a single car station',
    },
    handler: async (request, h) => {
      const payload = request.query as unknown as CarStationQuery;

      return (await service.getCarStation(payload, h.request)).unwrap();
    },
  });

  server.route({
    method: 'GET',
    path: '/bff/v2/mobility/station/bike',
    options: {
      tags: ['api', 'mobility', 'station', 'bike'],
      validate: getBikeStationRequest,
      description: 'Get details about a single bike station',
    },
    handler: async (request, h) => {
      const payload = request.query as unknown as BikeStationQuery;

      return (await service.getBikeStation(payload, h.request)).unwrap();
    },
  });

  /**
   * Parking violations reporting
   */
  server.route({
    method: 'GET',
    path: '/bff/v2/mobility/violations-reporting/init',
    options: {
      tags: ['api', ' mobility', 'violations'],
      validate: violationsReportingInitRequest,
      description: 'Initialize the violations reporting process',
    },
    handler: async (request, h) => {
      const payload = request.query as unknown as ViolationsReportingInitQuery;
      return (
        await service.initViolationsReporting(payload, h.request)
      ).unwrap();
    },
  });

  server.route({
    method: 'GET',
    path: '/bff/v2/mobility/violations-reporting/vehicle',
    options: {
      tags: ['api', ' mobility', 'violations', 'vehicle lookup'],
      validate: violationsVehicleLookupRequest,
      description: 'Looks up vehicle details from qr code contents',
    },
    handler: async (request, h) => {
      const payload = request.query as unknown as ViolationsVehicleLookupQuery;
      return (
        await service.violationsVehicleLookup(payload, h.request)
      ).unwrap();
    },
  });

  server.route({
    method: 'POST',
    path: '/bff/v2/mobility/violations-reporting/report',
    options: {
      tags: ['api', ' mobility', 'violations', 'report'],
      validate: violationsReportRequest,
      description: 'Report a parking violation',
    },
    handler: async (request, h) => {
      const payload = request.payload as unknown as ViolationsReportQuery;
      return (await service.sendViolationsReport(payload, h.request)).unwrap();
    },
  });
};
