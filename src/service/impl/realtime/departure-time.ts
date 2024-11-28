import {DepartureRealtimeData, DeparturesRealtimeData} from '../../types';
import {
  EstimatedCallFragment,
  GetDepartureRealtimeQuery,
} from './journey-gql/departure-time.graphql-gen';

export function mapToDepartureRealtime(
  input: GetDepartureRealtimeQuery,
): DeparturesRealtimeData {
  let obj: DeparturesRealtimeData = {};
  for (let quay of input.quays) {
    if (!quay) continue;
    const departures = mapDeparture(quay.estimatedCalls);

    // Don't include if the result is empty. Save data and easier to see if there are updates.
    if (!Object.keys(departures).length) {
      continue;
    }

    obj[quay.id] = {
      quayId: quay.id,
      departures,
    };
  }
  return obj;
}

function mapDeparture(input: EstimatedCallFragment[]) {
  let obj: DepartureRealtimeData['departures'] = {};
  for (let departure of input) {
    const serviceJourneyId = departure.serviceJourney!.id;

    obj[serviceJourneyId] = {
      serviceJourneyId,
      timeData: {
        realtime: departure.realtime ?? false,
        expectedDepartureTime: departure.expectedDepartureTime,
        aimedDepartureTime: departure.aimedDepartureTime,
      },
    };
  }
  return obj;
}
