import {conf, ExpectsType, metrics} from '../../config/configuration';
import http from 'k6/http';
import {bffHeadersGet} from '../../utils/headers';
import {
  Query,
  Vehicle,
} from '../../../../src/graphql/mobility/mobility-types_v2';
import {randomNumber} from '../../utils/utils';
import {VehicleInfoType} from '../types/mobility';

export function vehicles(range: number = 200): VehicleInfoType | undefined {
  const requestName = `v2_vehicles_${range}`;
  const formFactor = 'SCOOTER';
  // coordinates around Trondheim city center
  const lat = `63.43047907765${randomNumber(1000, true)}`;
  const lon = `10.39503129802${randomNumber(1000, true)}`;
  const url = `${conf.host()}/bff/v2/mobility/vehicles?formFactors=${formFactor}&lat=${lat}&lon=${lon}&range=${range}`;

  const res = http.get(url, {
    tags: {name: requestName},
    headers: bffHeadersGet(),
  });

  let returnVehicle = undefined;

  try {
    const json = res.json() as Query;
    const vehicles = json.vehicles! as VehicleInfoType[];
    const numberOfVehicles = vehicles.length;

    const expects: ExpectsType = [
      {check: 'should have status 200', expect: res.status === 200},
    ];
    if (numberOfVehicles != 0) {
      // Vehicle to return
      returnVehicle = vehicles[0] as VehicleInfoType;

      expects.push(
        {
          check: 'vehicles have id',
          expect: vehicles.filter((v) => v!.id).length === numberOfVehicles,
        },
        {
          check: 'vehicles have latitude',
          expect: vehicles.filter((v) => v!.lat).length === numberOfVehicles,
        },
        {
          check: 'vehicles have longitude',
          expect: vehicles.filter((v) => v!.lon).length === numberOfVehicles,
        },
        {
          check: 'currentFuelPercent is 0-100',
          expect:
            vehicles.filter(
              (v) =>
                v!.currentFuelPercent! >= 0 && v!.currentFuelPercent! <= 100,
            ).length === numberOfVehicles,
        },
      );
    }

    metrics.checkForFailures(
      [res.request.url],
      res.timings.duration,
      requestName,
      expects,
    );

    return returnVehicle;
  } catch (exp) {
    //throw exp
    metrics.checkForFailures(
      [res.request.url],
      res.timings.duration,
      requestName,
      [
        {
          check: `${exp}`,
          expect: false,
        },
      ],
    );

    return returnVehicle;
  }
}

// Get one vehicle
export function vehicle(vehicleInfo: VehicleInfoType) {
  const requestName = `v2_vehicle`;
  const formFactor = 'SCOOTER';
  const url = `${conf.host()}/bff/v2/mobility/vehicle?ids=${vehicleInfo!.id}`;

  const res = http.get(url, {
    tags: {name: requestName},
    headers: bffHeadersGet(),
  });

  try {
    const json = res.json() as Query;
    const vehicles = json.vehicles as Vehicle[];
    const vehicle = vehicles[0];

    const expects: ExpectsType = [
      {check: 'should have status 200', expect: res.status === 200},
    ];

    expects.push(
      {
        check: 'should return only one vehicle',
        expect: vehicles.length === 1,
      },
      {
        check: 'vehicle id is correct',
        expect: vehicle.id === vehicleInfo!.id,
      },
      {
        check: 'currentFuelPercent is correct',
        expect: vehicle.currentFuelPercent! === vehicleInfo!.currentFuelPercent,
      },
      {
        check: 'type of vehicle is correct',
        expect: vehicle.vehicleType.formFactor === formFactor,
      },
      {
        check: 'vehicle have a price per minute',
        expect:
          vehicle.pricingPlan.perMinPricing?.filter(
            (price) => price.interval === 1 && price.rate > 0,
          ).length === 1,
      },
      {
        check: 'an url to the operator exists',
        expect:
          vehicle.rentalUris?.android?.length! > 0 &&
          vehicle.rentalUris?.ios?.length! > 0,
      },
    );

    metrics.checkForFailures(
      [res.request.url],
      res.timings.duration,
      requestName,
      expects,
    );
  } catch (exp) {
    //throw exp
    metrics.checkForFailures(
      [res.request.url],
      res.timings.duration,
      requestName,
      [
        {
          check: `${exp}`,
          expect: false,
        },
      ],
    );
  }
}
