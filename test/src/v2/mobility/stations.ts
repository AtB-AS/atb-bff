import { conf, ExpectsType, metrics } from '../../config/configuration';
import http from 'k6/http';
import { bffHeadersGet } from '../../utils/headers';
import {
  Query,
  Station
} from '../../../../src/graphql/mobility/mobility-types_v2';
import { randomNumber } from '../../utils/utils';

export function stations(range: number = 250) {
  const requestName = `v2_stations_${range}`;
  // coordinates around Trondheim city center
  const lat = `63.4304571134${randomNumber(1000, true)}`;
  const lon = `10.39810091257${randomNumber(1000, true)}`;
  const url = `${conf.host()}/bff/v2/mobility/stations?lat=${lat}&lon=${lon}&range=${range}`;

  const res = http.get(url, {
    tags: { name: requestName },
    headers: bffHeadersGet
  });

  try {
    const json = res.json() as Query;
    const stations = json.stations! as Station[];
    const numberOfStations = stations.length;

    const expects: ExpectsType = [
      { check: 'should have status 200', expect: res.status === 200 }
    ];

    if (numberOfStations != 0) {
      expects.push(
        {
          check: 'capacity is >= 0',
          expect:
            stations.filter(s => s.capacity! >= 0).length === numberOfStations
        },
        {
          check: 'number of bikes and docks available equals capacity',
          expect:
            stations.filter(
              s => s.numBikesAvailable + s.numDocksAvailable! === s.capacity
            ).length === numberOfStations
        },
        {
          check: 'vehicles have a price per use',
          expect:
            stations.filter(s => s.pricingPlans[0].price > 0).length ===
            numberOfStations
        },
        {
          check: 'vehicles have a price per minute',
          expect:
            stations.filter(s => s.pricingPlans[0].perMinPricing?.length! > 0)
              .length === numberOfStations
        },
        {
          check: 'an app link to the operator exists',
          expect:
            stations.filter(
              s =>
                s.system.rentalApps?.android?.storeUri?.length! > 0 &&
                s.system.rentalApps?.ios?.storeUri?.length! > 0
            ).length === numberOfStations
        },
        {
          check: 'an url to the operator exists',
          expect:
            stations.filter(
              s =>
                s.rentalUris?.android?.length! > 0 &&
                s.rentalUris?.ios?.length! > 0
            ).length === numberOfStations
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
