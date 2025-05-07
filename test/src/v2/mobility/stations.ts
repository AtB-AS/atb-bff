import {conf, ExpectsType, metrics} from '../../config/configuration';
import http from 'k6/http';
import {bffHeadersGet} from '../../utils/headers';
import {
  Query,
  Station,
} from '../../../../src/graphql/mobility/mobility-types_v2';
import {randomNumber} from '../../utils/utils';
import {StationInfoType, Stations} from '../types/mobility';

// CAR har flere vehicleTypesAvailable tilgjengelig så kan ikke bare ta første
export function stations(
  stationType: 'BICYCLE' | 'CAR',
  range: number = 250,
): StationInfoType | undefined {
  const requestName = `v2_stations_${range}`;
  // coordinates around Trondheim city center
  const lat = `63.4304571134${randomNumber(1000, true)}`;
  const lon = `10.39810091257${randomNumber(1000, true)}`;
  const includeBicycles = stationType === 'BICYCLE' ? 'true' : 'false';
  const includeCars = stationType === 'CAR' ? 'true' : 'false';
  const url = `${conf.host()}/bff/v2/mobility/stations_v2?includeBicycles=${includeBicycles}&includeCars=${includeCars}&lat=${lat}&lon=${lon}&range=${range}`;

  const res = http.get(url, {
    tags: {name: requestName},
    headers: bffHeadersGet(),
  });

  let returnStation: StationInfoType = undefined;

  try {
    const json = res.json() as Stations;
    const stations =
      stationType === 'BICYCLE'
        ? (json.bicycles as Station[])
        : (json.cars as Station[]);
    const numberOfStations = stations.length;

    const expects: ExpectsType = [
      {check: 'should have status 200', expect: res.status === 200},
    ];

    if (numberOfStations != 0) {
      // Station to return - returning the first
      let countPerStation = 0;
      stations[0].vehicleTypesAvailable!.map(
        (v) => (countPerStation += v.count),
      );
      returnStation = {
        id: stations[0].id,
        capacity: countPerStation,
        formFactor: stations[0].vehicleTypesAvailable![0].vehicleType
          .formFactor,
      };
      expects.push(
        {
          check: 'stations have id',
          expect: stations.filter((s) => s!.id).length === numberOfStations,
        },
        {
          check: 'should have correct id',
          expect:
            stations.filter(
              (s) =>
                s!.id.split(':')[0].length === 3 &&
                s!.id.split(':')[1] === 'Station' &&
                s!.id.split(':')[2].length > 0,
            ).length === numberOfStations,
        },
        {
          check: 'stations have latitude',
          expect: stations.filter((s) => s!.lat).length === numberOfStations,
        },
        {
          check: 'stations have longitude',
          expect: stations.filter((s) => s!.lon).length === numberOfStations,
        },
      );
    }

    metrics.checkForFailures(
      [res.request.url],
      res.timings.duration,
      requestName,
      expects,
    );

    return returnStation;
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

    return returnStation;
  }
}

// Get one station
export function station(stationInfo: StationInfoType) {
  const requestName = `v2_station`;
  const urlParam = stationInfo!.formFactor === 'BICYCLE' ? 'bike' : 'car';
  const url = `${conf.host()}/bff/v2/mobility/station/${urlParam}?ids=${
    stationInfo!.id
  }`;

  const res = http.get(url, {
    tags: {name: requestName},
    headers: bffHeadersGet(),
  });

  try {
    const json = res.json() as Query;
    const stations = json.stations! as Station[];
    const station = stations[0];
    const numPricingPlans = station.pricingPlans.length;
    let countPerStation = 0;
    station.vehicleTypesAvailable!.map((v) => (countPerStation += v.count));

    const expects: ExpectsType = [
      {check: 'should have status 200', expect: res.status === 200},
    ];

    expects.push(
      {
        check: 'should return only one station',
        expect: stations.length === 1,
      },
      {
        check: 'station is is correct',
        expect: station.id === stationInfo!.id,
      },
      {
        check: 'type of station is correct',
        expect:
          station.vehicleTypesAvailable![0].vehicleType.formFactor ===
          stationInfo!.formFactor,
      },
      {
        check: 'number of available vehicles is correct',
        expect: countPerStation === stationInfo!.capacity,
      },
      {
        check: 'vehicles should have price',
        //expect: station.pricingPlans[0].price >= 0
        expect:
          station.pricingPlans.map(
            (p) => p.price && p.perMinPricing && p.perKmPricing,
          ).length === numPricingPlans,
      },
      {
        check: 'an app link to the operator exists',
        expect:
          station.system.rentalApps?.android?.storeUri?.length! > 0 &&
          station.system.rentalApps?.ios?.storeUri?.length! > 0,
      },
    );

    // Only for bikes
    if (stationInfo!.formFactor === 'BICYCLE') {
      expects.push({
        check: 'number of available docks is >= 0',
        expect: station.numDocksAvailable! >= 0,
      });
    }

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
