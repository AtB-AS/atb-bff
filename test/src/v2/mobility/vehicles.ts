import { conf, ExpectsType, metrics } from '../../config/configuration';
import http from 'k6/http';
import { bffHeadersGet } from '../../utils/headers';
import {
  Query,
  Vehicle
} from '../../../../src/graphql/mobility/mobility-types_v2';
import { randomNumber } from '../../utils/utils';

export function vehicles(range: number = 200) {
  const requestName = `v2_vehicles_${range}`;
  const formFactor = 'SCOOTER';
  // coordinates around Trondheim city center
  const lat = `63.43047907765${randomNumber(1000, true)}`;
  const lon = `10.39503129802${randomNumber(1000, true)}`;
  const url = `${conf.host()}/bff/v2/mobility/vehicles?formFactors=${formFactor}&lat=${lat}&lon=${lon}&range=${range}`;

  const res = http.get(url, {
    tags: { name: requestName },
    headers: bffHeadersGet
  });

  try {
    const json = res.json() as Query;
    const vehicles = json.vehicles! as Vehicle[];
    const numberOfVehicles = vehicles.length;

    const expects: ExpectsType = [
      { check: 'should have status 200', expect: res.status === 200 }
    ];
    if (numberOfVehicles != 0) {
      expects.push(
        {
          check: 'currentFuelPercent is 0-100',
          expect:
            vehicles.filter(
              v => v.currentFuelPercent! >= 0 && v.currentFuelPercent! <= 100
            ).length === numberOfVehicles
        },
        {
          check: 'type of vehicle is correct',
          expect:
            vehicles.filter(v => v.vehicleType.formFactor === formFactor)
              .length === numberOfVehicles
        },
        {
          check: 'vehicles have a price per minute',
          expect:
            vehicles.filter(v =>
              v.pricingPlan.perMinPricing?.filter(
                price => price.interval === 1 && price.rate > 0
              )
            ).length === numberOfVehicles
        },
        {
          check: 'an url to the operator exists',
          expect:
            vehicles.filter(
              v =>
                v.rentalUris?.android?.length! > 0 &&
                v.rentalUris?.ios?.length! > 0
            ).length === numberOfVehicles
        }
      );
    }

    metrics.checkForFailures(
      [res.request.url],
      res.timings.duration,
      requestName,
      expects
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
          expect: false
        }
      ]
    );
  }
}
