import {
  EstimatedCall,
  Leg,
  LegMode,
  Line,
  Place,
  PointsOnLink,
  Quay,
  ServiceJourney,
  TransportMode,
  TransportSubmode,
  TripPattern
} from '@entur/sdk';
import { TripPattern as TripPattern_v2 } from '../../../types/trips';
import { TripsQuery } from './journey-gql/trip.graphql-gen';

export function mapQueryToLegacyTripPatterns(trips: TripsQuery): TripPattern[] {
  const tripPatterns = trips.trip.tripPatterns;
  return tripPatterns.map(trip => mapToLegacyTripPattern(trip));
}

function mapToLegacyTripPattern(trip: TripPattern_v2): TripPattern {
  const legs = trip.legs.map(leg => mapToLegacyLeg(leg));
  return {
    ...trip,
    distance: trip.walkDistance || 0,
    directDuration: trip.duration,
    endTime: trip.expectedEndTime,
    startTime: trip.expectedStartTime,
    duration: trip.duration || 0,
    legs: legs,
    walkDistance: trip.walkDistance || 0
  };
}

type Leg_v2 = Required<TripsQuery>['trip']['tripPatterns'][0]['legs'][0];
function mapToLegacyLeg(leg: Leg_v2): Leg {
  const fromEstimatedCall = mapToLegacyEstimatedCall(
    leg.fromEstimatedCall,
    leg.serviceJourney,
    leg.line?.name || ''
  );
  const intermediateEstimatedCalls = leg.intermediateEstimatedCalls
    .map(iec =>
      mapToLegacyIntermediateEstimatedCall(
        iec,
        leg.serviceJourney,
        leg.line?.name || ''
      )
    )
    .filter(Boolean) as EstimatedCall[];

  return {
    ...leg,
    directDuration: leg.duration,
    ride: false,
    authority: undefined,
    fromEstimatedCall: fromEstimatedCall,
    fromPlace: mapToLegacyPlace(leg.fromPlace),
    toPlace: mapToLegacyPlace(leg.toPlace),
    interchangeTo: undefined,
    intermediateEstimatedCalls: intermediateEstimatedCalls,
    line: mapToLegacyLine(leg.line),
    mode: mapToLegacyLegMode(leg.mode),
    pointsOnLink: mapToPointsOnLink(leg.pointsOnLink),
    // Casting to allow servicejourney to be null
    serviceJourney: mapToLegacyServiceJourney(
      leg.serviceJourney
    ) as ServiceJourney,
    situations: [],
    bookingArrangements: undefined,
    transportSubmode: mapToLegacySubMode(leg.transportSubmode)
  };
}

type PointsOnLink_v2 = Leg_v2['pointsOnLink'];
function mapToPointsOnLink(points: PointsOnLink_v2): PointsOnLink | undefined {
  if (!points || !points.points || !points.length) return;
  return {
    length: points.length,
    points: points.points
  };
}

type EstimatedCall_v2 = Leg_v2['fromEstimatedCall'];
function mapToLegacyEstimatedCall(
  estimatedCall: EstimatedCall_v2,
  serviceJourney: ServiceJourney_v2,
  frontText: string
): EstimatedCall | undefined {
  if (!estimatedCall) return;

  return {
    ...estimatedCall,
    aimedArrivalTime: '',
    expectedArrivalTime: '',
    cancellation: false,
    date: '',
    forAlighting: true,
    forBoarding: true,
    predictionInaccurate: false,
    realtime: true,
    requestStop: false,
    // Casting to allow servicejourney to be null
    serviceJourney: mapToLegacyServiceJourney(serviceJourney) as ServiceJourney,
    destinationDisplay: {
      frontText: frontText
    },
    notices: [],
    quay: undefined
  };
}

type IntermediateEstimatedCall_v2 = Leg_v2['intermediateEstimatedCalls'][0];
function mapToLegacyIntermediateEstimatedCall(
  estimatedCall: IntermediateEstimatedCall_v2,
  serviceJourney: ServiceJourney_v2,
  frontText: string
): EstimatedCall | undefined {
  if (!estimatedCall) return;

  return {
    quay: undefined,
    date: estimatedCall.date,
    aimedArrivalTime: '',
    expectedArrivalTime: '',
    aimedDepartureTime: '',
    expectedDepartureTime: '',
    cancellation: false,
    forAlighting: true,
    forBoarding: true,
    predictionInaccurate: false,
    realtime: true,
    requestStop: false,
    // Casting to allow servicejourney to be null
    serviceJourney: mapToLegacyServiceJourney(serviceJourney) as ServiceJourney,
    destinationDisplay: {
      frontText: frontText
    },
    notices: []
  };
}

type Place_v2 = Leg_v2['fromPlace'];
function mapToLegacyPlace(place: Place_v2): Place {
  return {
    ...place,
    name: place.name || '',
    quay: mapToLegacyQuay(place.quay)
  };
}

type Line_v2 = Leg_v2['line'];
function mapToLegacyLine(line: Line_v2): Line | undefined {
  if (!line) return;
  return {
    ...line,
    transportMode: TransportMode.BUS, // Not used in app
    transportSubmode: TransportSubmode.LOCAL_BUS, // Not used in app
    name: line.name || '',
    notices: [],
    publicCode: line.publicCode || ''
  };
}

type Mode_v2 = Leg_v2['mode'];
function mapToLegacyLegMode(mode: Mode_v2): LegMode {
  if (Object.values(LegMode).includes(mode as unknown as LegMode)) {
    return mode as unknown as LegMode;
  }
  return LegMode.BUS;
}

type TransportSubmode_v2 = Leg_v2['transportSubmode'];
function mapToLegacySubMode(submode: TransportSubmode_v2): TransportSubmode {
  if (
    Object.values(TransportSubmode).includes(
      submode as unknown as TransportSubmode
    )
  ) {
    return submode as unknown as TransportSubmode;
  }
  return TransportSubmode.LOCAL_BUS;
}

type ServiceJourney_v2 = Leg_v2['serviceJourney'];
function mapToLegacyServiceJourney(
  serviceJourney: ServiceJourney_v2
): ServiceJourney | null {
  if (!serviceJourney?.id) return null;
  return {
    ...serviceJourney,
    id: serviceJourney?.id || '',
    journeyPattern: undefined,
    notices: []
  };
}

type Quay_v2 = Required<Leg_v2>['fromPlace']['quay'];
function mapToLegacyQuay(quay?: Quay_v2): Quay | undefined {
  if (!quay) return undefined;

  const stopPlace = quay.stopPlace;

  return {
    id: quay.id,
    name: quay.name,
    description: '',
    publicCode: '',
    situations: [],
    stopPlace: {
      id: '',
      name: stopPlace?.name || '',
      latitude: stopPlace?.latitude,
      longitude: stopPlace?.longitude
    }
  };
}
