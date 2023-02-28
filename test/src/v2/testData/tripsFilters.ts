import { transportModesType, tripsFiltersType } from '../types/trips';

const includeAll: transportModesType = [
  {
    transportMode: 'bus',
    transportSubModes: [
      'dedicatedLaneBus',
      'demandAndResponseBus',
      'expressBus',
      'localBus',
      'highFrequencyBus',
      'mobilityBus',
      'mobilityBusForRegisteredDisabled',
      'nightBus',
      'postBus',
      'railReplacementBus',
      'regionalBus',
      'riverBus',
      'schoolAndPublicServiceBus',
      'schoolBus',
      'shuttleBus',
      'sightseeingBus',
      'specialNeedsBus'
    ]
  },
  {
    transportMode: 'coach'
  },
  {
    transportMode: 'tram'
  },
  {
    transportMode: 'rail'
  },
  {
    transportMode: 'bus',
    transportSubModes: ['railReplacementBus']
  },
  {
    transportMode: 'water',
    transportSubModes: [
      'highSpeedPassengerService',
      'highSpeedVehicleService',
      'sightseeingService',
      'localPassengerFerry',
      'internationalPassengerFerry'
    ]
  },
  {
    transportMode: 'water',
    transportSubModes: [
      'highSpeedVehicleService',
      'internationalCarFerry',
      'localCarFerry',
      'nationalCarFerry'
    ]
  },
  {
    transportMode: 'bus',
    transportSubModes: ['airportLinkBus']
  },
  {
    transportMode: 'metro'
  },
  {
    transportMode: 'air'
  },
  {
    transportMode: 'cableway'
  },
  {
    transportMode: 'funicular'
  },
  {
    transportMode: 'monorail'
  },
  {
    transportMode: 'lift'
  },
  {
    transportMode: 'trolleybus'
  }
];

const includeBus: transportModesType = [
  {
    transportMode: 'bus',
    transportSubModes: [
      'dedicatedLaneBus',
      'demandAndResponseBus',
      'expressBus',
      'localBus',
      'highFrequencyBus',
      'mobilityBus',
      'mobilityBusForRegisteredDisabled',
      'nightBus',
      'postBus',
      'railReplacementBus',
      'regionalBus',
      'riverBus',
      'schoolAndPublicServiceBus',
      'schoolBus',
      'shuttleBus',
      'sightseeingBus',
      'specialNeedsBus'
    ]
  }
];

const includeRail: transportModesType = [
  {
    transportMode: 'rail'
  }
];

const includeAirportBus: transportModesType = [
  {
    transportMode: 'bus',
    transportSubModes: ['airportLinkBus']
  }
];

export const tripsFilters: tripsFiltersType = {
  all: includeAll,
  bus: includeBus,
  rail: includeRail,
  airportBus: includeAirportBus
};
