import { conf, ExpectsType, metrics } from '../../config/configuration';
import http from 'k6/http';
import { bffHeadersGet } from '../../utils/headers';
import {
  Query,
  Station
} from '../../../../src/graphql/mobility/mobility-types_v2';
import { randomNumber } from '../../utils/utils';
import { StationInfoType } from '../types/mobility';

export function stations(range: number = 250): StationInfoType | undefined {
  const requestName = `v2_stations_${range}`;
  const formFactor = 'BICYCLE';
  // coordinates around Trondheim city center
  const lat = `63.4304571134${randomNumber(1000, true)}`;
  const lon = `10.39810091257${randomNumber(1000, true)}`;
  const url = `${conf.host()}/bff/v2/mobility/stations?availableFormFactors=${formFactor}&lat=${lat}&lon=${lon}&range=${range}`;

  const res = http.get(url, {
    tags: { name: requestName },
    headers: bffHeadersGet
  });

  let returnStation: StationInfoType = undefined;

  try {
    const json = res.json() as Query;
    const stations = json.stations! as Station[];
    const numberOfStations = stations.length;

    const expects: ExpectsType = [
      { check: 'should have status 200', expect: res.status === 200 }
    ];

    if (numberOfStations != 0) {
      // Station to return - returning the first
      returnStation = {
        id: stations[0].id,
        count: stations[0].vehicleTypesAvailable![0].count,
        formFactor: stations[0].vehicleTypesAvailable![0].vehicleType.formFactor
      };
      expects.push(
        {
          check: 'stations have id',
          expect: stations.filter(s => s!.id).length === numberOfStations
        },
        {
          check: 'stations have latitude',
          expect: stations.filter(s => s!.lat).length === numberOfStations
        },
        {
          check: 'stations have longitude',
          expect: stations.filter(s => s!.lon).length === numberOfStations
        },
        {
          check: 'number of bikes is >= 0',
          expect:
            stations.filter(s => s.vehicleTypesAvailable![0].count >= 0)
              .length === numberOfStations
        }
      );
    }

    metrics.checkForFailures(
      [res.request.url],
      res.timings.duration,
      requestName,
      expects
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
          expect: false
        }
      ]
    );

    return returnStation;
  }
}

// Get one station
export function station(stationInfo: StationInfoType) {
  const requestName = `v2_station`;
  const url = `${conf.host()}/bff/v2/mobility/station/bike?ids=${
    stationInfo!.id
  }`;

  const res = http.get(url, {
    tags: { name: requestName },
    headers: bffHeadersGet
  });

  try {
    const json = res.json() as Query;
    const stations = json.stations! as Station[];
    const station = stations[0];

    const expects: ExpectsType = [
      { check: 'should have status 200', expect: res.status === 200 }
    ];

    expects.push(
      {
        check: 'should return only one station',
        expect: stations.length === 1
      },
      {
        check: 'station is is correct',
        expect: station.id === stationInfo!.id
      },
      {
        check: 'type of station is correct',
        expect:
          station.vehicleTypesAvailable![0].vehicleType.formFactor ===
          stationInfo!.formFactor
      },
      {
        check: 'number of available bikes is correct',
        expect: station.vehicleTypesAvailable![0].count === stationInfo!.count
      },
      {
        check: 'number of available docks is >= 0',
        expect: station.numDocksAvailable! >= 0
      },
      {
        check: 'vehicles have a price',
        expect: station.pricingPlans[0].price >= 0
      },
      {
        check: 'an app link to the operator exists',
        expect:
          station.system.rentalApps?.android?.storeUri?.length! > 0 &&
          station.system.rentalApps?.ios?.storeUri?.length! > 0
      },
      {
        check: 'an url to the operator exists',
        expect:
          station.rentalUris?.android?.length! > 0 &&
          station.rentalUris?.ios?.length! > 0
      }
    );

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
