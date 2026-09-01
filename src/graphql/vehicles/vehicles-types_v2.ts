export type Maybe<T> = T;
export type InputMaybe<T> = T;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  DateTime: { input: any; output: any; }
  Duration: { input: any; output: any; }
};

export type Affects = {
  datedServiceJourneys?: Maybe<Array<Maybe<DatedServiceJourney>>>;
  lines?: Maybe<Array<Maybe<Line>>>;
  operators?: Maybe<Array<Maybe<Operator>>>;
  serviceJourneys?: Maybe<Array<Maybe<ServiceJourney>>>;
  stopPlaces?: Maybe<Array<Maybe<Stop>>>;
  stopPoints?: Maybe<Array<Maybe<Stop>>>;
  vehicleModes?: Maybe<Array<Maybe<VehicleModeEnumeration>>>;
};

export type BoundingBox = {
  maxLat: Scalars['Float']['input'];
  maxLon: Scalars['Float']['input'];
  minLat: Scalars['Float']['input'];
  minLon: Scalars['Float']['input'];
};

export type Call = {
  actualArrivalTime?: Maybe<Scalars['DateTime']['output']>;
  actualArrivalTimeEpochSecond?: Maybe<Scalars['Float']['output']>;
  actualDepartureTime?: Maybe<Scalars['DateTime']['output']>;
  actualDepartureTimeEpochSecond?: Maybe<Scalars['Float']['output']>;
  aimedArrivalTime?: Maybe<Scalars['DateTime']['output']>;
  aimedArrivalTimeEpochSecond?: Maybe<Scalars['Float']['output']>;
  aimedDepartureTime?: Maybe<Scalars['DateTime']['output']>;
  aimedDepartureTimeEpochSecond?: Maybe<Scalars['Float']['output']>;
  arrivalBoardingActivity?: Maybe<Scalars['String']['output']>;
  callType?: Maybe<CallTypeEnumeration>;
  cancellation?: Maybe<Scalars['Boolean']['output']>;
  departureBoardingActivity?: Maybe<Scalars['String']['output']>;
  expectedArrivalTime?: Maybe<Scalars['DateTime']['output']>;
  expectedArrivalTimeEpochSecond?: Maybe<Scalars['Float']['output']>;
  expectedDepartureTime?: Maybe<Scalars['DateTime']['output']>;
  expectedDepartureTimeEpochSecond?: Maybe<Scalars['Float']['output']>;
  forBoarding?: Maybe<Scalars['Boolean']['output']>;
  occupancyStatus?: Maybe<OccupancyStatus>;
  order?: Maybe<Scalars['Int']['output']>;
  /**
   *  Situations affecting this stop while the vehicle is here. A situation on a quay that
   *  ends before the vehicle arrives is not included. A situation affecting several of the
   *  journey's stops is reported against every one of them.
   */
  situations?: Maybe<Array<Maybe<Situation>>>;
  stopPoint?: Maybe<Stop>;
};

export enum CallTypeEnumeration {
  Estimated = 'ESTIMATED',
  Recorded = 'RECORDED'
}

export type Codespace = {
  codespaceId: Scalars['String']['output'];
};

export type DatedServiceJourney = {
  /**  ID that defines this journey */
  id: Scalars['String']['output'];
  serviceJourney?: Maybe<ServiceJourney>;
};

export type EstimatedTimetableUpdate = {
  calls?: Maybe<Array<Maybe<Call>>>;
  cancellation?: Maybe<Scalars['Boolean']['output']>;
  codespace?: Maybe<Codespace>;
  datedServiceJourney?: Maybe<DatedServiceJourney>;
  destinationName?: Maybe<Scalars['String']['output']>;
  destinationRef?: Maybe<Scalars['String']['output']>;
  direction?: Maybe<Scalars['String']['output']>;
  expiration?: Maybe<Scalars['DateTime']['output']>;
  expirationEpochSecond?: Maybe<Scalars['Float']['output']>;
  lastUpdated?: Maybe<Scalars['DateTime']['output']>;
  lastUpdatedEpochSecond?: Maybe<Scalars['Float']['output']>;
  line?: Maybe<Line>;
  mode?: Maybe<VehicleModeEnumeration>;
  monitored?: Maybe<Scalars['Boolean']['output']>;
  occupancyStatus?: Maybe<OccupancyStatus>;
  operator?: Maybe<Operator>;
  originName?: Maybe<Scalars['String']['output']>;
  originRef?: Maybe<Scalars['String']['output']>;
  serviceJourney?: Maybe<ServiceJourney>;
  /**
   *  Situations affecting this journey as a whole: those naming the journey, its dated
   *  journey or its line and overlapping the journey. A situation reported against one of
   *  the journey's calls is not repeated here, so select calls { situations } as well to
   *  see every disruption affecting this journey. Closed situations are never included.
   */
  situations?: Maybe<Array<Maybe<Situation>>>;
  vehicleId?: Maybe<Scalars['String']['output']>;
  /**  Reported status of the vehicle */
  vehicleStatus?: Maybe<VehicleStatusEnumeration>;
};

export type InfoLink = {
  labels?: Maybe<Array<Maybe<TranslatedString>>>;
  uri?: Maybe<Scalars['String']['output']>;
};

export type Line = {
  lineName?: Maybe<Scalars['String']['output']>;
  lineRef?: Maybe<Scalars['String']['output']>;
  publicCode?: Maybe<Scalars['String']['output']>;
};

export type Location = {
  latitude: Scalars['Float']['output'];
  longitude: Scalars['Float']['output'];
};

export type MonitoredCall = {
  order?: Maybe<Scalars['Int']['output']>;
  stopPointRef?: Maybe<Scalars['String']['output']>;
  vehicleAtStop?: Maybe<Scalars['Boolean']['output']>;
};

export enum OccupancyEnumeration {
  FewSeatsAvailable = 'FEW_SEATS_AVAILABLE',
  Full = 'FULL',
  ManySeatsAvailable = 'MANY_SEATS_AVAILABLE',
  NotAcceptingPassengers = 'NOT_ACCEPTING_PASSENGERS',
  SeatsAvailable = 'SEATS_AVAILABLE',
  StandingAvailable = 'STANDING_AVAILABLE',
  Unknown = 'UNKNOWN'
}

export enum OccupancyStatus {
  /**
   * The vehicle or carriage can currently accommodate only standing passengers and has limited
   * space for them. There isn't a big difference between this and `full` so it's possible to
   * handle them as the same value, if one wants to limit the number of different values.
   * SIRI nordic profile: merge into `standingRoomOnly`.
   */
  CrushedStandingRoomOnly = 'crushedStandingRoomOnly',
  /**
   * The vehicle is considered empty by most measures, and has few or no passengers onboard, but is
   * still accepting passengers. There isn't a big difference between this and `manySeatsAvailable`
   * so it's possible to handle them as the same value, if one wants to limit the number of different
   * values.
   * SIRI nordic profile: merge these into `manySeatsAvailable`.
   */
  Empty = 'empty',
  /**
   * The vehicle or carriage has a few seats available.
   * SIRI nordic profile: less than ~50% of seats available.
   */
  FewSeatsAvailable = 'fewSeatsAvailable',
  /**
   * The vehicle or carriage is considered full by most measures, but may still be allowing
   * passengers to board.
   */
  Full = 'full',
  /**
   * The vehicle or carriage has a large number of seats available.
   * SIRI nordic profile: more than ~50% of seats available.
   */
  ManySeatsAvailable = 'manySeatsAvailable',
  /** The vehicle or carriage doesn't have any occupancy data available. */
  NoData = 'noData',
  /**
   * The vehicle or carriage has no seats or standing room available.
   * SIRI nordic profile: if vehicle/carriage is not in use / unavailable, or passengers are only
   * allowed to alight due to e.g. crowding.
   */
  NotAcceptingPassengers = 'notAcceptingPassengers',
  /** The vehicle or carriage has seats available. Deprecated in SIRI 2.1 */
  SeatsAvailable = 'seatsAvailable',
  /** The vehicle or carriage has no seats available. Deprecated in SIRI 2.1 */
  StandingAvailable = 'standingAvailable',
  /**
   * The vehicle or carriage only has standing room available.
   * SIRI nordic profile: less than ~10% of seats available.
   */
  StandingRoomOnly = 'standingRoomOnly'
}

export type Operator = {
  name?: Maybe<Scalars['String']['output']>;
  operatorRef: Scalars['String']['output'];
};

export type PointsOnLink = {
  length?: Maybe<Scalars['Float']['output']>;
  points?: Maybe<Scalars['String']['output']>;
};

export type ProgressBetweenStops = {
  linkDistance?: Maybe<Scalars['Float']['output']>;
  percentage?: Maybe<Scalars['Float']['output']>;
};

export type Query = {
  codespaces?: Maybe<Array<Maybe<Codespace>>>;
  lines?: Maybe<Array<Maybe<Line>>>;
  operators?: Maybe<Array<Maybe<Operator>>>;
  serviceJourney?: Maybe<ServiceJourney>;
  serviceJourneys?: Maybe<Array<Maybe<ServiceJourney>>>;
  situations?: Maybe<Array<Maybe<Situation>>>;
  /** @deprecated Experimental. */
  timetables?: Maybe<Array<Maybe<EstimatedTimetableUpdate>>>;
  vehicles?: Maybe<Array<Maybe<VehicleUpdate>>>;
};


export type QueryLinesArgs = {
  codespaceId?: InputMaybe<Scalars['String']['input']>;
};


export type QueryOperatorsArgs = {
  codespaceId?: InputMaybe<Scalars['String']['input']>;
};


export type QueryServiceJourneyArgs = {
  id: Scalars['String']['input'];
};


export type QueryServiceJourneysArgs = {
  codespaceId?: InputMaybe<Scalars['String']['input']>;
  lineRef?: InputMaybe<Scalars['String']['input']>;
};


export type QuerySituationsArgs = {
  codespaceId?: InputMaybe<Scalars['String']['input']>;
  datedServiceJourneyId?: InputMaybe<Scalars['String']['input']>;
  includeClosed?: InputMaybe<Scalars['Boolean']['input']>;
  lineRef?: InputMaybe<Scalars['String']['input']>;
  minAge?: InputMaybe<Scalars['Duration']['input']>;
  mode?: InputMaybe<VehicleModeEnumeration>;
  openEnded?: InputMaybe<Scalars['Boolean']['input']>;
  operatorRef?: InputMaybe<Scalars['String']['input']>;
  reportType?: InputMaybe<Scalars['String']['input']>;
  serviceJourneyId?: InputMaybe<Scalars['String']['input']>;
  severity?: InputMaybe<SeverityEnumeration>;
  situationNumbers?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  stopRef?: InputMaybe<Scalars['String']['input']>;
  validNow?: InputMaybe<Scalars['Boolean']['input']>;
};


export type QueryTimetablesArgs = {
  cancellation?: InputMaybe<Scalars['Boolean']['input']>;
  codespaceId?: InputMaybe<Scalars['String']['input']>;
  datedServiceJourneyIds?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  lineRef?: InputMaybe<Scalars['String']['input']>;
  mode?: InputMaybe<VehicleModeEnumeration>;
  monitored?: InputMaybe<Scalars['Boolean']['input']>;
  serviceJourneyIdAndDates?: InputMaybe<Array<InputMaybe<ServiceJourneyIdAndDate>>>;
};


export type QueryVehiclesArgs = {
  boundingBox?: InputMaybe<BoundingBox>;
  codespaceId?: InputMaybe<Scalars['String']['input']>;
  date?: InputMaybe<Scalars['String']['input']>;
  datedServiceJourneyId?: InputMaybe<Scalars['String']['input']>;
  datedServiceJourneyIds?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  includeInvalidLocations?: InputMaybe<Scalars['Boolean']['input']>;
  lineName?: InputMaybe<Scalars['String']['input']>;
  lineRef?: InputMaybe<Scalars['String']['input']>;
  maxDataAge?: InputMaybe<Scalars['Duration']['input']>;
  mode?: InputMaybe<VehicleModeEnumeration>;
  monitored?: InputMaybe<Scalars['Boolean']['input']>;
  operatorRef?: InputMaybe<Scalars['String']['input']>;
  serviceJourneyId?: InputMaybe<Scalars['String']['input']>;
  serviceJourneyIdAndDates?: InputMaybe<Array<InputMaybe<ServiceJourneyIdAndDate>>>;
  vehicleId?: InputMaybe<Scalars['String']['input']>;
  vehicleIds?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};

export type ServiceJourney = {
  /**  Date as provided when realtime-updates are referenced by ServiceJourneyId + Date */
  date?: Maybe<Scalars['String']['output']>;
  /**  ID that defines this journey */
  id: Scalars['String']['output'];
  /** @deprecated Experimental - should not be used with subscription */
  pointsOnLink?: Maybe<PointsOnLink>;
  /** @deprecated Use 'id' instead. */
  serviceJourneyId: Scalars['String']['output'];
};

export type ServiceJourneyIdAndDate = {
  /**  Date as in "Operating date" when realtime-updates are referenced by ServiceJourneyId + Date. */
  date?: InputMaybe<Scalars['String']['input']>;
  /**  ServiceJourneyId as referenced in planned data */
  id: Scalars['String']['input'];
};

export enum SeverityEnumeration {
  NoImpact = 'noImpact',
  Normal = 'normal',
  Severe = 'severe',
  Slight = 'slight',
  Undefined = 'undefined',
  Unknown = 'unknown',
  VerySevere = 'verySevere',
  VerySlight = 'verySlight'
}

export type Situation = {
  advice?: Maybe<Array<Maybe<TranslatedString>>>;
  affects?: Maybe<Affects>;
  /**  Time elapsed since creationTime. Null when creationTime is absent. */
  age?: Maybe<Scalars['Duration']['output']>;
  codespace?: Maybe<Codespace>;
  creationTime?: Maybe<Scalars['DateTime']['output']>;
  description?: Maybe<Array<Maybe<TranslatedString>>>;
  detail?: Maybe<Array<Maybe<TranslatedString>>>;
  /**  Null when the situation never expires. */
  expiration?: Maybe<Scalars['DateTime']['output']>;
  expirationEpochSecond?: Maybe<Scalars['Float']['output']>;
  infoLinks?: Maybe<Array<Maybe<InfoLink>>>;
  keywords?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  lastUpdated?: Maybe<Scalars['DateTime']['output']>;
  lastUpdatedEpochSecond?: Maybe<Scalars['Float']['output']>;
  /**  True when no validity period carries an end time. */
  openEnded?: Maybe<Scalars['Boolean']['output']>;
  participantRef?: Maybe<Scalars['String']['output']>;
  planned?: Maybe<Scalars['Boolean']['output']>;
  priority?: Maybe<Scalars['Int']['output']>;
  progress?: Maybe<WorkflowStatusEnumeration>;
  reportType?: Maybe<Scalars['String']['output']>;
  severity?: Maybe<SeverityEnumeration>;
  situationNumber: Scalars['String']['output'];
  sourceType?: Maybe<Scalars['String']['output']>;
  summary?: Maybe<Array<Maybe<TranslatedString>>>;
  validityPeriods?: Maybe<Array<Maybe<ValidityPeriod>>>;
  /**
   *  The subscription stream is only eventually consistent: two concurrent updates
   *  to the same situation can be published in reverse version order. Clients should
   *  keep the highest version seen per situationNumber and discard a regression.
   */
  version?: Maybe<Scalars['Int']['output']>;
  versionedAtTime?: Maybe<Scalars['DateTime']['output']>;
};

export type Stop = {
  id: Scalars['String']['output'];
  location?: Maybe<Location>;
  name?: Maybe<Scalars['String']['output']>;
};

export type Subscription = {
  /** @deprecated Experimental. */
  situations?: Maybe<Array<Maybe<Situation>>>;
  /** @deprecated Experimental. */
  timetables?: Maybe<Array<Maybe<EstimatedTimetableUpdate>>>;
  vehicles?: Maybe<Array<Maybe<VehicleUpdate>>>;
};


export type SubscriptionSituationsArgs = {
  bufferSize?: InputMaybe<Scalars['Int']['input']>;
  bufferTime?: InputMaybe<Scalars['Int']['input']>;
  codespaceId?: InputMaybe<Scalars['String']['input']>;
  datedServiceJourneyId?: InputMaybe<Scalars['String']['input']>;
  includeClosed?: InputMaybe<Scalars['Boolean']['input']>;
  lineRef?: InputMaybe<Scalars['String']['input']>;
  minAge?: InputMaybe<Scalars['Duration']['input']>;
  mode?: InputMaybe<VehicleModeEnumeration>;
  openEnded?: InputMaybe<Scalars['Boolean']['input']>;
  operatorRef?: InputMaybe<Scalars['String']['input']>;
  reportType?: InputMaybe<Scalars['String']['input']>;
  serviceJourneyId?: InputMaybe<Scalars['String']['input']>;
  severity?: InputMaybe<SeverityEnumeration>;
  situationNumbers?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  stopRef?: InputMaybe<Scalars['String']['input']>;
  validNow?: InputMaybe<Scalars['Boolean']['input']>;
};


export type SubscriptionTimetablesArgs = {
  bufferSize?: InputMaybe<Scalars['Int']['input']>;
  bufferTime?: InputMaybe<Scalars['Int']['input']>;
  cancellation?: InputMaybe<Scalars['Boolean']['input']>;
  codespaceId?: InputMaybe<Scalars['String']['input']>;
  datedServiceJourneyIds?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  lineRef?: InputMaybe<Scalars['String']['input']>;
  mode?: InputMaybe<VehicleModeEnumeration>;
  monitored?: InputMaybe<Scalars['Boolean']['input']>;
  serviceJourneyIdAndDates?: InputMaybe<Array<InputMaybe<ServiceJourneyIdAndDate>>>;
};


export type SubscriptionVehiclesArgs = {
  boundingBox?: InputMaybe<BoundingBox>;
  bufferSize?: InputMaybe<Scalars['Int']['input']>;
  bufferTime?: InputMaybe<Scalars['Int']['input']>;
  codespaceId?: InputMaybe<Scalars['String']['input']>;
  date?: InputMaybe<Scalars['String']['input']>;
  datedServiceJourneyId?: InputMaybe<Scalars['String']['input']>;
  datedServiceJourneyIds?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  includeInvalidLocations?: InputMaybe<Scalars['Boolean']['input']>;
  lineName?: InputMaybe<Scalars['String']['input']>;
  lineRef?: InputMaybe<Scalars['String']['input']>;
  maxDataAge?: InputMaybe<Scalars['Duration']['input']>;
  mode?: InputMaybe<VehicleModeEnumeration>;
  monitored?: InputMaybe<Scalars['Boolean']['input']>;
  operatorRef?: InputMaybe<Scalars['String']['input']>;
  serviceJourneyId?: InputMaybe<Scalars['String']['input']>;
  serviceJourneyIdAndDates?: InputMaybe<Array<InputMaybe<ServiceJourneyIdAndDate>>>;
  vehicleId?: InputMaybe<Scalars['String']['input']>;
  vehicleIds?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};

export type TranslatedString = {
  language?: Maybe<Scalars['String']['output']>;
  value?: Maybe<Scalars['String']['output']>;
};

export type ValidityPeriod = {
  endTime?: Maybe<Scalars['DateTime']['output']>;
  startTime?: Maybe<Scalars['DateTime']['output']>;
};

export enum VehicleModeEnumeration {
  Air = 'AIR',
  Bus = 'BUS',
  Coach = 'COACH',
  Ferry = 'FERRY',
  Metro = 'METRO',
  Rail = 'RAIL',
  Taxi = 'TAXI',
  Tram = 'TRAM'
}

export enum VehicleStatusEnumeration {
  Assigned = 'ASSIGNED',
  AtOrigin = 'AT_ORIGIN',
  Cancelled = 'CANCELLED',
  Completed = 'COMPLETED',
  InProgress = 'IN_PROGRESS',
  OffRoute = 'OFF_ROUTE'
}

export type VehicleUpdate = {
  bearing?: Maybe<Scalars['Float']['output']>;
  codespace?: Maybe<Codespace>;
  datedServiceJourney?: Maybe<DatedServiceJourney>;
  /**  The current delay in seconds - negative delay means ahead of schedule */
  delay?: Maybe<Scalars['Float']['output']>;
  destinationName?: Maybe<Scalars['String']['output']>;
  destinationRef?: Maybe<Scalars['String']['output']>;
  direction?: Maybe<Scalars['String']['output']>;
  expiration?: Maybe<Scalars['DateTime']['output']>;
  expirationEpochSecond?: Maybe<Scalars['Float']['output']>;
  /** @deprecated Use 'bearing''. */
  heading?: Maybe<Scalars['Float']['output']>;
  /**  Whether the vehicle is affected by traffic jams or other circumstances which may lead to further delays. If `null`, current status is unknown. */
  inCongestion?: Maybe<Scalars['Boolean']['output']>;
  lastUpdated?: Maybe<Scalars['DateTime']['output']>;
  lastUpdatedEpochSecond?: Maybe<Scalars['Float']['output']>;
  line?: Maybe<Line>;
  location?: Maybe<Location>;
  mode?: Maybe<VehicleModeEnumeration>;
  monitored?: Maybe<Scalars['Boolean']['output']>;
  monitoredCall?: Maybe<MonitoredCall>;
  /** @deprecated Use 'occupancyStatus'. */
  occupancy?: Maybe<OccupancyEnumeration>;
  occupancyStatus?: Maybe<OccupancyStatus>;
  operator?: Maybe<Operator>;
  originName?: Maybe<Scalars['String']['output']>;
  originRef?: Maybe<Scalars['String']['output']>;
  progressBetweenStops?: Maybe<ProgressBetweenStops>;
  serviceJourney?: Maybe<ServiceJourney>;
  speed?: Maybe<Scalars['Float']['output']>;
  vehicleId?: Maybe<Scalars['String']['output']>;
  /** @deprecated Use 'vehicleId'. */
  vehicleRef?: Maybe<Scalars['String']['output']>;
  /**  Reported status of the vehicle */
  vehicleStatus?: Maybe<VehicleStatusEnumeration>;
};

export enum WorkflowStatusEnumeration {
  ApprovedDraft = 'approvedDraft',
  Closed = 'closed',
  Closing = 'closing',
  Draft = 'draft',
  Open = 'open',
  PendingApproval = 'pendingApproval',
  Published = 'published'
}
