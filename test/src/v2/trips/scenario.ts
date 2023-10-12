import {filteredTrips} from './trips';
import {tripsFilters} from '../testData/tripsFilters';

export function filteredTripsScenario(searchDate: string): void {
  // Include all
  filteredTrips(tripsFilters.all, searchDate, 'all');

  // Include only bus
  filteredTrips(tripsFilters.bus, searchDate, 'bus');

  // Include only rail
  filteredTrips(tripsFilters.rail, searchDate, 'rail');

  // Include only airport bus
  filteredTrips(tripsFilters.airportBus, searchDate, 'airportBus');
}
