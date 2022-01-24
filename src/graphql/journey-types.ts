export type Maybe<T> = T;
export type InputMaybe<T> = T;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  Coordinates: any;
  /** Date  using the format: yyyy-MM-dd. Example: 2017-04-23 */
  Date: any;
  /** DateTime format accepting ISO dates. Return values on format: yyyy-MM-dd'T'HH:mm:ssXXXX. Example: 2017-04-23T18:25:43+0100 */
  DateTime: any;
  /** Time using the format: HH:mm:SS. Example: 18:25:SS */
  LocalTime: any;
  /** Long type */
  Long: any;
  /** Time using the format: HH:mm:ss. Example: 18:25:43 */
  Time: any;
};

export enum AbsoluteDirection {
  East = 'east',
  North = 'north',
  Northeast = 'northeast',
  Northwest = 'northwest',
  South = 'south',
  Southeast = 'southeast',
  Southwest = 'southwest',
  West = 'west'
}

/** Authority involved in public transportation. An organisation under which the responsibility of organising the transport service in a certain area is placed. */
export type Authority = {
  fareUrl?: Maybe<Scalars['String']>;
  /** Authority id */
  id: Scalars['ID'];
  lang?: Maybe<Scalars['String']>;
  lines: Array<Maybe<Line>>;
  name: Scalars['String'];
  phone?: Maybe<Scalars['String']>;
  /** Get all situations active for the authority */
  situations: Array<Maybe<PtSituationElement>>;
  timezone: Scalars['String'];
  url?: Maybe<Scalars['String']>;
};

export type BikePark = PlaceInterface & {
  id: Scalars['ID'];
  latitude?: Maybe<Scalars['Float']>;
  longitude?: Maybe<Scalars['Float']>;
  name: Scalars['String'];
  realtime?: Maybe<Scalars['Boolean']>;
  spacesAvailable?: Maybe<Scalars['Int']>;
};

export type BikeRentalStation = PlaceInterface & {
  allowDropoff?: Maybe<Scalars['Boolean']>;
  bikesAvailable?: Maybe<Scalars['Int']>;
  description?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  latitude?: Maybe<Scalars['Float']>;
  longitude?: Maybe<Scalars['Float']>;
  name: Scalars['String'];
  networks: Array<Maybe<Scalars['String']>>;
  realtimeOccupancyAvailable?: Maybe<Scalars['Boolean']>;
  spacesAvailable?: Maybe<Scalars['Int']>;
};

export enum BikesAllowed {
  /** The vehicle being used on this particular trip can accommodate at least one bicycle. */
  Allowed = 'allowed',
  /** There is no bike information for the trip. */
  NoInformation = 'noInformation',
  /** No bicycles are allowed on this trip. */
  NotAllowed = 'notAllowed'
}

export enum BookingAccess {
  AuthorisedPublic = 'authorisedPublic',
  Other = 'other',
  PublicAccess = 'publicAccess',
  Staff = 'staff'
}

export type BookingArrangement = {
  /** When should service be booked? */
  bookWhen?: Maybe<PurchaseWhen>;
  /** Who has access to book service? */
  bookingAccess?: Maybe<BookingAccess>;
  /** Who should ticket be contacted for booking */
  bookingContact?: Maybe<Contact>;
  /** How should service be booked? */
  bookingMethods?: Maybe<Array<Maybe<BookingMethod>>>;
  /** Textual description of booking arrangement for service */
  bookingNote?: Maybe<Scalars['String']>;
  /** When should ticket be purchased? */
  buyWhen?: Maybe<Array<Maybe<PurchaseMoment>>>;
  /** Latest time service can be booked. ISO 8601 timestamp */
  latestBookingTime?: Maybe<Scalars['LocalTime']>;
  /** Minimum period in advance service can be booked as a ISO 8601 duration */
  minimumBookingPeriod?: Maybe<Scalars['String']>;
};

export enum BookingMethod {
  CallDriver = 'callDriver',
  CallOffice = 'callOffice',
  None = 'none',
  Online = 'online',
  Other = 'other',
  PhoneAtStop = 'phoneAtStop',
  Text = 'text'
}

export type Branding = {
  /** Description of branding. */
  description?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['String']>;
  /** URL to an image be used for branding */
  image?: Maybe<Scalars['String']>;
  /** Full name to be used for branding. */
  name?: Maybe<Scalars['String']>;
  /** URL to be used for branding */
  url?: Maybe<Scalars['String']>;
};

export type CarPark = PlaceInterface & {
  capacity?: Maybe<Scalars['Int']>;
  capacityHandicap?: Maybe<Scalars['Int']>;
  capacityRecharging?: Maybe<Scalars['Int']>;
  id: Scalars['ID'];
  latitude?: Maybe<Scalars['Float']>;
  longitude?: Maybe<Scalars['Float']>;
  name: Scalars['String'];
  realtimeOccupancyAvailable?: Maybe<Scalars['Boolean']>;
  spacesAvailable?: Maybe<Scalars['Int']>;
  spacesAvailableHandicap?: Maybe<Scalars['Int']>;
  spacesAvailableRecharging?: Maybe<Scalars['Int']>;
};

export type Contact = {
  /** Name of person to contact */
  contactPerson?: Maybe<Scalars['String']>;
  /** Email adress for contact */
  email?: Maybe<Scalars['String']>;
  /** Textual description of how to get in contact */
  furtherDetails?: Maybe<Scalars['String']>;
  /** Phone number for contact */
  phone?: Maybe<Scalars['String']>;
  /** Url for contact */
  url?: Maybe<Scalars['String']>;
};

/** A planned vehicle journey with passengers on a given date. */
export type DatedServiceJourney = {
  id: Scalars['ID'];
  /** Return the operating/service day the ServiceJourney run on. */
  operatingDay: Scalars['Date'];
  /** The DatedServiceJourney replaced by this DSJ. This is based on planed alterations, not real-time cancelations. */
  replacementFor?: Maybe<DatedServiceJourney>;
  /** Whether journey is as planned, a cancellation, an extra journey or replaced. */
  serviceAlteration?: Maybe<ServiceAlteration>;
  serviceJourney: ServiceJourney;
  /** Get all situations active for the DatedServiceJourney */
  situations: Array<Maybe<PtSituationElement>>;
};

/** An advertised destination of a specific journey pattern, usually displayed on a head sign or at other on-board locations. */
export type DestinationDisplay = {
  /** Name of destination to show on front of vehicle. */
  frontText?: Maybe<Scalars['String']>;
};

export enum DirectionType {
  Anticlockwise = 'anticlockwise',
  Clockwise = 'clockwise',
  Inbound = 'inbound',
  Outbound = 'outbound',
  Unknown = 'unknown'
}

/** List of visits to quays as part of vehicle journeys. Updated with real time information where available */
export type EstimatedCall = {
  /** Actual time of arrival at quay. Updated from real time information if available */
  actualArrivalTime?: Maybe<Scalars['DateTime']>;
  /** Actual time of departure from quay. Updated with real time information if available */
  actualDepartureTime?: Maybe<Scalars['DateTime']>;
  /**
   * Scheduled time of arrival at quay. Not affected by read time updated
   * @deprecated Use aimedArrivalTime
   */
  aimedArrival?: Maybe<TimeAndDayOffset>;
  /** Scheduled time of arrival at quay. Not affected by read time updated */
  aimedArrivalTime?: Maybe<Scalars['DateTime']>;
  /**
   * Scheduled time of departure from quay. Not affected by read time updated
   * @deprecated Use aimedDepartureTime
   */
  aimedDeparture?: Maybe<TimeAndDayOffset>;
  /** Scheduled time of departure from quay. Not affected by read time updated */
  aimedDepartureTime?: Maybe<Scalars['DateTime']>;
  /** Booking arrangements for flexible service. */
  bookingArrangements?: Maybe<BookingArrangement>;
  /** Whether stop is cancellation. */
  cancellation?: Maybe<Scalars['Boolean']>;
  /** The date the estimated call is valid for. */
  date?: Maybe<Scalars['Date']>;
  destinationDisplay?: Maybe<DestinationDisplay>;
  /**
   * Expected time of arrival at quay. Updated with real time information if available
   * @deprecated Use expectedArrivalTime
   */
  expectedArrival?: Maybe<TimeAndDayOffset>;
  /** Expected time of arrival at quay. Updated with real time information if available. */
  expectedArrivalTime?: Maybe<Scalars['DateTime']>;
  /**
   * Expected time of departure from quay. Updated with real time information if available
   * @deprecated Use expectedDepartureTime
   */
  expectedDeparture?: Maybe<TimeAndDayOffset>;
  /** Expected time of departure from quay. Updated with real time information if available. */
  expectedDepartureTime?: Maybe<Scalars['DateTime']>;
  /** Whether this call is part of a flexible trip. This means that arrival or departure times are not scheduled but estimated within specified operating hours. */
  flexible?: Maybe<Scalars['Boolean']>;
  /** Whether vehicle may be alighted at quay. */
  forAlighting?: Maybe<Scalars['Boolean']>;
  /** Whether vehicle may be boarded at quay. */
  forBoarding?: Maybe<Scalars['Boolean']>;
  /**
   * Server name - for debugging only!
   * @deprecated For debugging only
   */
  hostname?: Maybe<Scalars['String']>;
  notices: Array<Maybe<Notice>>;
  /**
   * OccupancyStatus.
   * @deprecated Not yet officially supported.
   */
  occupancyStatus?: Maybe<Occupancy>;
  /** Whether the updated estimates are expected to be inaccurate. */
  predictionInaccurate?: Maybe<Scalars['Boolean']>;
  quay?: Maybe<Quay>;
  /** Whether this call has been updated with real time information. */
  realtime?: Maybe<Scalars['Boolean']>;
  realtimeState?: Maybe<RealtimeState>;
  /** Whether vehicle will only stop on request. */
  requestStop?: Maybe<Scalars['Boolean']>;
  serviceJourney?: Maybe<ServiceJourney>;
  /** Get all relevant situations for this EstimatedCall. */
  situations: Array<Maybe<PtSituationElement>>;
  /** Whether this is a timing point or not. Boarding and alighting is not allowed at timing points. */
  timingPoint?: Maybe<Scalars['Boolean']>;
};

export enum FilterPlaceType {
  /** Bicycle rent stations */
  BicycleRent = 'bicycleRent',
  /** Bike parks */
  BikePark = 'bikePark',
  /** Car parks */
  CarPark = 'carPark',
  /** Quay */
  Quay = 'quay',
  /** StopPlace */
  StopPlace = 'stopPlace'
}

export enum FlexibleLineType {
  CorridorService = 'corridorService',
  Fixed = 'fixed',
  FixedStopAreaWide = 'fixedStopAreaWide',
  FlexibleAreasOnly = 'flexibleAreasOnly',
  FreeAreaAreaWide = 'freeAreaAreaWide',
  HailAndRideSections = 'hailAndRideSections',
  MainRouteWithFlexibleEnds = 'mainRouteWithFlexibleEnds',
  MixedFlexible = 'mixedFlexible',
  MixedFlexibleAndFixed = 'mixedFlexibleAndFixed',
  Other = 'other'
}

export enum FlexibleServiceType {
  DynamicPassingTimes = 'dynamicPassingTimes',
  FixedHeadwayFrequency = 'fixedHeadwayFrequency',
  FixedPassingTimes = 'fixedPassingTimes',
  NotFlexible = 'notFlexible',
  Other = 'other'
}

/** Filter trips by disallowing trip patterns involving certain elements */
export type InputBanned = {
  /** Set of ids for authorities that should not be used */
  authorities?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  /** Set of ids for lines that should not be used */
  lines?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  /** Deprecated! Use 'authorities' instead. */
  organisations?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  /** Set of ids of quays that should not be allowed for boarding or alighting. Trip patterns that travel through the quay will still be permitted. */
  quays?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  /** Set of ids of quays that should not be allowed for boarding, alighting or traveling thorugh. */
  quaysHard?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  /** Set of ids of service journeys that should not be used. */
  serviceJourneys?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

/** Input type for coordinates in the WGS84 system */
export type InputCoordinates = {
  /** The latitude of the place. */
  latitude: Scalars['Float'];
  /** The longitude of the place. */
  longitude: Scalars['Float'];
};

export type InputFilters = {
  /** Bike parks to include by id. */
  bikeParks?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  /** Bike rentals to include by id. */
  bikeRentalStations?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  /** Car parks to include by id. */
  carParks?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  /** Lines to include by id. */
  lines?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  /** Quays to include by id. */
  quays?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

/** Preferences for trip search. */
export type InputPreferred = {
  /** Set of ids of authorities preferred by user. */
  authorities?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  /** Set of ids of lines preferred by user. */
  lines?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  /** Deprecated! Use 'authorities' instead. */
  organisations?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  /** Penalty added for using a line that is not preferred if user has set any line as preferred. In number of seconds that user is willing to wait for preferred line. */
  otherThanPreferredLinesPenalty?: InputMaybe<Scalars['Int']>;
};

/** Negative preferences for trip search. Unpreferred elements may still be used in suggested trips if alternatives are not desirable, see InputBanned for hard limitations. */
export type InputUnpreferred = {
  /** Set of ids of authorities user prefers not to use. */
  authorities?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  /** Set of ids of lines user prefers not to use. */
  lines?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  /** Deprecated! Use 'authorities' instead. */
  organisations?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

/** Filter trips by only allowing trip patterns involving certain elements. If both lines and authorities are specificed, only one must be valid for each trip to be used. */
export type InputWhiteListed = {
  /** Set of ids for authorities that should be used */
  authorities?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  /** Set of ids for lines that should be used */
  lines?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  /** Deprecated! Use 'authorities' instead. */
  organisations?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type Interchange = {
  FromLine?: Maybe<Line>;
  FromServiceJourney?: Maybe<ServiceJourney>;
  ToLine?: Maybe<Line>;
  ToServiceJourney?: Maybe<ServiceJourney>;
  /** The interchange is guaranteed by the operator(s). Usually up to a maximum wait time. */
  guaranteed?: Maybe<Scalars['Boolean']>;
  /** The Line/Route/ServiceJourney changes, but the passenger can stay seated. */
  staySeated?: Maybe<Scalars['Boolean']>;
};

export enum InterchangeWeighting {
  /** Third highest priority interchange. */
  InterchangeAllowed = 'interchangeAllowed',
  /** Interchange not allowed. */
  NoInterchange = 'noInterchange',
  /** Highest priority interchange. */
  PreferredInterchange = 'preferredInterchange',
  /** Second highest priority interchange. */
  RecommendedInterchange = 'recommendedInterchange'
}

export type JourneyPattern = {
  /** @deprecated Get destinationDisplay from estimatedCall or timetabledPassingTime instead. DestinationDisplay from JourneyPattern is not correct according to model, will give misleading results in some cases and will be removed! (This is because a DestinationDisplay can change in the middle of a JourneyPattern.) */
  destinationDisplay?: Maybe<DestinationDisplay>;
  directionType?: Maybe<DirectionType>;
  id: Scalars['ID'];
  line: Line;
  name?: Maybe<Scalars['String']>;
  notices: Array<Maybe<Notice>>;
  pointsOnLink?: Maybe<PointsOnLink>;
  /** Quays visited by service journeys for this journey patterns */
  quays: Array<Quay>;
  serviceJourneys: Array<ServiceJourney>;
  /** List of service journeys for the journey pattern for a given date */
  serviceJourneysForDate: Array<ServiceJourney>;
  /** Get all situations active for the journey pattern */
  situations: Array<Maybe<PtSituationElement>>;
};


export type JourneyPatternServiceJourneysForDateArgs = {
  date?: InputMaybe<Scalars['Date']>;
};

export type KeyValue = {
  /** Identifier of value. */
  key?: Maybe<Scalars['String']>;
  /** Identifier of type of key */
  typeOfKey?: Maybe<Scalars['String']>;
  /** The actual value */
  value?: Maybe<Scalars['String']>;
};

/** Part of a trip pattern. Either a ride on a public transport vehicle or access or path link to/from/between places */
export type Leg = {
  /** The aimed date and time this leg ends. */
  aimedEndTime?: Maybe<Scalars['DateTime']>;
  /** The aimed date and time this leg starts. */
  aimedStartTime?: Maybe<Scalars['DateTime']>;
  /** For ride legs, the service authority used for this legs. For non-ride legs, null. */
  authority?: Maybe<Authority>;
  bookingArrangements?: Maybe<BookingArrangement>;
  /** For ride legs, the dated service journey if it exist in planned data. If not, null. */
  datedServiceJourney?: Maybe<DatedServiceJourney>;
  /** In the case of a flexible journey, this will represent the duration of the best-case scenario, where the vehicle drives directly to the destination for the current passenger. */
  directDuration?: Maybe<Scalars['Long']>;
  /** The distance traveled while traversing the leg in meters. */
  distance?: Maybe<Scalars['Float']>;
  /** The legs's duration in seconds */
  duration?: Maybe<Scalars['Long']>;
  /**
   * The date and time this leg ends.
   * @deprecated Replaced with expectedEndTime
   */
  endTime?: Maybe<Scalars['DateTime']>;
  /** The expected, realtime adjusted date and time this leg ends. */
  expectedEndTime?: Maybe<Scalars['DateTime']>;
  /** The expected, realtime adjusted date and time this leg starts. */
  expectedStartTime?: Maybe<Scalars['DateTime']>;
  /** EstimatedCall for the quay where the leg originates. */
  fromEstimatedCall?: Maybe<EstimatedCall>;
  /** The Place where the leg originates. */
  fromPlace: Place;
  interchangeFrom?: Maybe<Interchange>;
  interchangeTo?: Maybe<Interchange>;
  /** For ride legs, estimated calls for quays between the Place where the leg originates and the Place where the leg ends. For non-ride legs, empty list. */
  intermediateEstimatedCalls: Array<Maybe<EstimatedCall>>;
  /** For ride legs, intermediate quays between the Place where the leg originates and the Place where the leg ends. For non-ride legs, empty list. */
  intermediateQuays: Array<Maybe<Quay>>;
  /** For ride legs, the line. For non-ride legs, null. */
  line?: Maybe<Line>;
  /** The mode of transport or access (e.g., foot) used when traversing this leg. */
  mode?: Maybe<Mode>;
  /** For ride legs, the operator used for this legs. For non-ride legs, null. */
  operator?: Maybe<Operator>;
  /**
   * For ride legs, the transit organisation that operates the service used for this legs. For non-ride legs, null.
   * @deprecated Use 'authority' instead.
   */
  organisation?: Maybe<Organisation>;
  /** The legs's geometry. */
  pointsOnLink?: Maybe<PointsOnLink>;
  /**
   * Whether there is real-time data about this leg
   * @deprecated Should not be camelCase. Use realtime instead.
   */
  realTime?: Maybe<Scalars['Boolean']>;
  /** Whether there is real-time data about this leg */
  realtime?: Maybe<Scalars['Boolean']>;
  /** Whether this leg is with a rented bike. */
  rentedBike?: Maybe<Scalars['Boolean']>;
  /** Whether this leg is a ride leg or not. */
  ride?: Maybe<Scalars['Boolean']>;
  /** For ride legs, the service journey. For non-ride legs, null. */
  serviceJourney?: Maybe<ServiceJourney>;
  /** For ride legs, all estimated calls for the service journey. For non-ride legs, empty list. */
  serviceJourneyEstimatedCalls: Array<Maybe<EstimatedCall>>;
  /** All relevant situations for this leg */
  situations: Array<Maybe<PtSituationElement>>;
  /**
   * The date and time this leg begins.
   * @deprecated Replaced with expectedStartTime
   */
  startTime?: Maybe<Scalars['DateTime']>;
  /** Do we continue from a specified via place */
  steps: Array<Maybe<PathGuidance>>;
  /** EstimatedCall for the quay where the leg ends. */
  toEstimatedCall?: Maybe<EstimatedCall>;
  /** The Place where the leg ends. */
  toPlace: Place;
  /** The transport sub mode (e.g., localBus or expressBus) used when traversing this leg. Null if leg is not a ride */
  transportSubmode?: Maybe<TransportSubmode>;
  /** Do we continue from a specified via place */
  via?: Maybe<Scalars['Boolean']>;
};

/** A group of routes which is generally known to the public by a similar name or number */
export type Line = {
  authority?: Maybe<Authority>;
  bikesAllowed?: Maybe<BikesAllowed>;
  /** Booking arrangements for flexible line. */
  bookingArrangements?: Maybe<BookingArrangement>;
  description?: Maybe<Scalars['String']>;
  /** Type of flexible line, or null if line is not flexible. */
  flexibleLineType?: Maybe<FlexibleLineType>;
  id: Scalars['ID'];
  journeyPatterns?: Maybe<Array<Maybe<JourneyPattern>>>;
  /** List of keyValue pairs for the line. */
  keyValues?: Maybe<Array<Maybe<KeyValue>>>;
  name?: Maybe<Scalars['String']>;
  notices: Array<Maybe<Notice>>;
  operator?: Maybe<Operator>;
  /** @deprecated Use 'authority' instead. */
  organisation?: Maybe<Organisation>;
  presentation?: Maybe<Presentation>;
  /** Publicly announced code for line, differentiating it from other lines for the same operator. */
  publicCode?: Maybe<Scalars['String']>;
  quays: Array<Maybe<Quay>>;
  serviceJourneys: Array<Maybe<ServiceJourney>>;
  /** Get all situations active for the line */
  situations: Array<Maybe<PtSituationElement>>;
  transportMode?: Maybe<TransportMode>;
  transportSubmode?: Maybe<TransportSubmode>;
  url?: Maybe<Scalars['String']>;
};

export enum Locale {
  No = 'no',
  Us = 'us'
}

/** Input format for specifying a location through either a place reference (id), coordinates or both. If both place and coordinates are provided the place ref will be used if found, coordinates will only be used if place is not known. */
export type Location = {
  /** Coordinates for the location */
  coordinates?: InputMaybe<InputCoordinates>;
  /** The name of the location. */
  name?: InputMaybe<Scalars['String']>;
  /** Id for the place. */
  place?: InputMaybe<Scalars['String']>;
};

export enum Mode {
  Air = 'air',
  Bicycle = 'bicycle',
  Bus = 'bus',
  Cableway = 'cableway',
  Car = 'car',
  /** Combine with foot and transit for kiss and ride. */
  CarDropoff = 'car_dropoff',
  /** Combine with foot and transit for park and ride. */
  CarPark = 'car_park',
  /** Combine with foot and transit for ride and kiss. */
  CarPickup = 'car_pickup',
  Coach = 'coach',
  Foot = 'foot',
  Funicular = 'funicular',
  Lift = 'lift',
  Metro = 'metro',
  Rail = 'rail',
  Tram = 'tram',
  /** Any for of public transportation */
  Transit = 'transit',
  Water = 'water'
}

export enum MultiModalMode {
  /** Both multiModal parents and their mono modal child stop places. */
  All = 'all',
  /** Only mono modal children stop places, not their multi modal parent stop */
  Child = 'child',
  /** Multi modal parent stop places without their mono modal children. */
  Parent = 'parent'
}

/** Text with language */
export type MultilingualString = {
  language?: Maybe<Scalars['String']>;
  value?: Maybe<Scalars['String']>;
};

export type Notice = {
  id?: Maybe<Scalars['String']>;
  publicCode?: Maybe<Scalars['String']>;
  text?: Maybe<Scalars['String']>;
};

export enum Occupancy {
  /** The vehicle can currently accommodate only standing passengers and has limited space for them. */
  CrushedStandingRoomOnly = 'crushedStandingRoomOnly',
  /** The vehicle is considered empty by most measures, and has few or no passengers onboard, but is still accepting passengers. */
  Empty = 'empty',
  /** The vehicle has a small percentage of seats available. What percentage of free seats out of the total seats available is to be considered small enough to fall into this category is determined at the discretion of the producer. */
  FewSeatsAvailable = 'fewSeatsAvailable',
  /** The vehicle is considered full by most measures, but may still be allowing passengers to board. */
  Full = 'full',
  /** The vehicle has a large percentage of seats available. What percentage of free seats out of the total seats available is to be considered large enough to fall into this category is determined at the discretion of the producer. */
  ManySeatsAvailable = 'manySeatsAvailable',
  /** The vehicle can not accept passengers. */
  NotAcceptingPassengers = 'notAcceptingPassengers',
  /** The vehicle can currently accommodate only standing passengers. */
  StandingRoomOnly = 'standingRoomOnly',
  /** The Occupancy is unknown. DEFAULT. */
  Unknown = 'unknown'
}

/** Organisation providing public transport services. */
export type Operator = {
  /** Branding for operator. */
  branding?: Maybe<Branding>;
  /** Operator id */
  id: Scalars['ID'];
  lines: Array<Maybe<Line>>;
  name: Scalars['String'];
  phone?: Maybe<Scalars['String']>;
  serviceJourney: Array<Maybe<ServiceJourney>>;
  url?: Maybe<Scalars['String']>;
};

export enum OptimisationMethod {
  Flat = 'flat',
  Greenways = 'greenways',
  Quick = 'quick',
  Safe = 'safe',
  Transfers = 'transfers',
  Triangle = 'triangle'
}

/** Deprecated! Replaced by authority and operator. */
export type Organisation = {
  fareUrl?: Maybe<Scalars['String']>;
  /** Organisation id */
  id: Scalars['ID'];
  lang?: Maybe<Scalars['String']>;
  lines: Array<Maybe<Line>>;
  name: Scalars['String'];
  phone?: Maybe<Scalars['String']>;
  /** Get all situations active for the organisation */
  situations: Array<Maybe<PtSituationElement>>;
  timezone: Scalars['String'];
  url?: Maybe<Scalars['String']>;
};

/** Information about pagination in a connection. */
export type PageInfo = {
  /** When paginating forwards, the cursor to continue. */
  endCursor?: Maybe<Scalars['String']>;
  /** When paginating forwards, are there more items? */
  hasNextPage: Scalars['Boolean'];
  /** When paginating backwards, are there more items? */
  hasPreviousPage: Scalars['Boolean'];
  /** When paginating backwards, the cursor to continue. */
  startCursor?: Maybe<Scalars['String']>;
};

/** A series of turn by turn instructions used for walking, biking and driving. */
export type PathGuidance = {
  /** This step is on an open area, such as a plaza or train platform, and thus the directions should say something like "cross" */
  area?: Maybe<Scalars['Boolean']>;
  /** The name of this street was generated by the system, so we should only display it once, and generally just display right/left directions */
  bogusName?: Maybe<Scalars['Boolean']>;
  /** The distance in meters that this step takes. */
  distance?: Maybe<Scalars['Float']>;
  /** When exiting a highway or traffic circle, the exit name/number. */
  exit?: Maybe<Scalars['String']>;
  /** The absolute direction of this step. */
  heading?: Maybe<AbsoluteDirection>;
  /** The latitude of the step. */
  latitude?: Maybe<Scalars['Float']>;
  /** Direction information as readable text. */
  legStepText?: Maybe<Scalars['String']>;
  /** The longitude of the step. */
  longitude?: Maybe<Scalars['Float']>;
  /** The relative direction of this step. */
  relativeDirection?: Maybe<RelativeDirection>;
  /** Indicates whether or not a street changes direction at an intersection. */
  stayOn?: Maybe<Scalars['Boolean']>;
  /** The name of the street. */
  streetName?: Maybe<Scalars['String']>;
};


/** A series of turn by turn instructions used for walking, biking and driving. */
export type PathGuidanceLegStepTextArgs = {
  locale?: InputMaybe<Locale>;
};

/** Common super class for all places (stop places, quays, car parks, bike parks and bike rental stations ) */
export type Place = {
  /** The bike parking related to the place */
  bikePark?: Maybe<BikePark>;
  /** The bike rental station related to the place */
  bikeRentalStation?: Maybe<BikeRentalStation>;
  /** The car parking related to the place */
  carPark?: Maybe<CarPark>;
  /** The latitude of the place. */
  latitude: Scalars['Float'];
  /** The longitude of the place. */
  longitude: Scalars['Float'];
  /** For transit quays, the name of the quay. For points of interest, the name of the POI. */
  name?: Maybe<Scalars['String']>;
  /** The quay related to the place. */
  quay?: Maybe<Quay>;
  /** Type of vertex. (Normal, Bike sharing station, Bike P+R, Transit quay) Mostly used for better localization of bike sharing and P+R station names */
  vertexType?: Maybe<VertexType>;
};

export type PlaceAtDistance = {
  distance?: Maybe<Scalars['Int']>;
  /** @deprecated Id is not referable or meaningful and will be removed */
  id: Scalars['ID'];
  place?: Maybe<PlaceInterface>;
};

/** Interface for places, i.e. quays, stop places, parks */
export type PlaceInterface = {
  id: Scalars['ID'];
  latitude?: Maybe<Scalars['Float']>;
  longitude?: Maybe<Scalars['Float']>;
};

/** A list of coordinates encoded as a polyline string (see http://code.google.com/apis/maps/documentation/polylinealgorithm.html) */
export type PointsOnLink = {
  /** The number of points in the string */
  length?: Maybe<Scalars['Int']>;
  /** The encoded points of the polyline. Be aware that the string could contain escape characters that need to be accounted for. (https://www.freeformatter.com/javascript-escape.html) */
  points?: Maybe<Scalars['String']>;
};

/** Types describing common presentation properties */
export type Presentation = {
  colour?: Maybe<Scalars['String']>;
  textColour?: Maybe<Scalars['String']>;
};

/** Simple public transport situation element */
export type PtSituationElement = {
  /** Advice of situation in all different translations available */
  advice: Array<MultilingualString>;
  /** Get affected authority for this situation element */
  authority?: Maybe<Authority>;
  datedServiceJourneys: Array<Maybe<DatedServiceJourney>>;
  /** Description of situation in all different translations available */
  description: Array<MultilingualString>;
  /**
   * Details of situation in all different translations available
   * @deprecated Not allowed according to profile. Use ´advice´ instead.
   */
  detail: Array<MultilingualString>;
  id: Scalars['ID'];
  /**
   * Url with more information
   * @deprecated Use the attribute infoLinks instead.
   */
  infoLink?: Maybe<Scalars['String']>;
  /** Optional links to more information. */
  infoLinks?: Maybe<Array<Maybe<InfoLink>>>;
  /** Get all journey patterns for this situation element */
  journeyPatterns: Array<Maybe<JourneyPattern>>;
  lines: Array<Maybe<Line>>;
  /** @deprecated Use 'authority' instead. */
  organisation?: Maybe<Organisation>;
  /** Priority-level of this situation, 1 is highest priority, 0 means unknown. */
  priority?: Maybe<Scalars['Int']>;
  quays: Array<Maybe<Quay>>;
  /**
   * Authority that reported this situation
   * @deprecated Not yet officially supported. May be removed or renamed.
   */
  reportAuthority?: Maybe<Authority>;
  /** ReportType of this situation */
  reportType?: Maybe<ReportType>;
  serviceJourneys: Array<Maybe<ServiceJourney>>;
  /** Severity of this situation  */
  severity?: Maybe<Severity>;
  /** Operator's internal id for this situation */
  situationNumber?: Maybe<Scalars['String']>;
  /**
   * StopConditions of this situation
   * @deprecated Temporary attribute used for data-verification.
   */
  stopConditions: Array<Maybe<StopCondition>>;
  stopPlaces: Array<Maybe<StopPlace>>;
  /** Summary of situation in all different translations available */
  summary: Array<MultilingualString>;
  /** Period this situation is in effect */
  validityPeriod?: Maybe<ValidityPeriod>;
};

export enum PurchaseMoment {
  AfterBoarding = 'afterBoarding',
  BeforeBoarding = 'beforeBoarding',
  BeforeBoardingOnly = 'beforeBoardingOnly',
  InAdvance = 'inAdvance',
  InAdvanceOnly = 'inAdvanceOnly',
  OnBoarding = 'onBoarding',
  OnBoardingOnly = 'onBoardingOnly',
  OnCheckIn = 'onCheckIn',
  OnCheckOut = 'onCheckOut',
  OnReservation = 'onReservation',
  Other = 'other',
  SubscriptionOnly = 'subscriptionOnly'
}

export enum PurchaseWhen {
  AdvanceAndDayOfTravel = 'advanceAndDayOfTravel',
  AdvanceOnly = 'advanceOnly',
  DayOfTravelOnly = 'dayOfTravelOnly',
  Other = 'other',
  SubscriptionChargeMoment = 'subscriptionChargeMoment',
  TimeOfTravelOnly = 'timeOfTravelOnly',
  UntilPreviousDay = 'untilPreviousDay'
}

/** A place such as platform, stance, or quayside where passengers have access to PT vehicles. */
export type Quay = PlaceInterface & {
  description?: Maybe<Scalars['String']>;
  /** List of visits to this quay as part of vehicle journeys. */
  estimatedCalls: Array<Maybe<EstimatedCall>>;
  /** Geometry for flexible area. */
  flexibleArea?: Maybe<Scalars['Coordinates']>;
  id: Scalars['ID'];
  /** List of journey patterns servicing this quay */
  journeyPatterns: Array<Maybe<JourneyPattern>>;
  latitude?: Maybe<Scalars['Float']>;
  /** List of lines servicing this quay */
  lines: Array<Line>;
  longitude?: Maybe<Scalars['Float']>;
  name: Scalars['String'];
  /** Public code used to identify this quay within the stop place. For instance a platform code. */
  publicCode?: Maybe<Scalars['String']>;
  /** Get all situations active for the quay */
  situations: Array<Maybe<PtSituationElement>>;
  /** The stop place to which this quay belongs to. */
  stopPlace?: Maybe<StopPlace>;
  stopType?: Maybe<StopType>;
  timezone: Scalars['String'];
  /** Whether this quay is suitable for wheelchair boarding. */
  wheelchairAccessible?: Maybe<WheelchairBoarding>;
};


/** A place such as platform, stance, or quayside where passengers have access to PT vehicles. */
export type QuayEstimatedCallsArgs = {
  includeCancelledTrips?: InputMaybe<Scalars['Boolean']>;
  numberOfDepartures?: InputMaybe<Scalars['Int']>;
  numberOfDeparturesPerLineAndDestinationDisplay?: InputMaybe<Scalars['Int']>;
  omitNonBoarding?: InputMaybe<Scalars['Boolean']>;
  startTime?: InputMaybe<Scalars['DateTime']>;
  timeRange?: InputMaybe<Scalars['Int']>;
  whiteListed?: InputMaybe<InputWhiteListed>;
  whiteListedModes?: InputMaybe<Array<InputMaybe<Mode>>>;
};

export type QuayAtDistance = {
  distance?: Maybe<Scalars['Int']>;
  id: Scalars['ID'];
  quay?: Maybe<Quay>;
};

export type QueryType = {
  /** Get all authorities */
  authorities: Array<Maybe<Authority>>;
  /** Get an authority by ID */
  authority?: Maybe<Authority>;
  /** Get a single bike park based on its id */
  bikePark?: Maybe<BikePark>;
  /** Get all bike parks */
  bikeParks: Array<Maybe<BikePark>>;
  /** Get a single bike rental station based on its id */
  bikeRentalStation?: Maybe<BikeRentalStation>;
  /** Get all bike rental stations */
  bikeRentalStations: Array<Maybe<BikeRentalStation>>;
  /** Get all bike rental stations within the specified bounding box. */
  bikeRentalStationsByBbox: Array<Maybe<BikeRentalStation>>;
  /** Get a single car park based on its id */
  carPark?: Maybe<CarPark>;
  /** Get all car parks */
  carParks: Array<Maybe<CarPark>>;
  /** Get a single dated service journey based on its id */
  datedServiceJourney?: Maybe<DatedServiceJourney>;
  /** List dated service journeys */
  datedServiceJourneys: Array<Maybe<DatedServiceJourney>>;
  /** Get a single line based on its id */
  line?: Maybe<Line>;
  /** Get all lines */
  lines: Array<Maybe<Line>>;
  /** Get all places (quays, stop places, car parks etc. with coordinates) within the specified radius from a location. The returned type has two fields place and distance. The search is done by walking so the distance is according to the network of walkables. */
  nearest?: Maybe<PlaceAtDistanceConnection>;
  /** Get all notices */
  notices: Array<Maybe<Notice>>;
  /** Get a operator by ID */
  operator?: Maybe<Operator>;
  /** Get all operators */
  operators: Array<Maybe<Operator>>;
  /** @deprecated Use 'authority' instead. */
  organisation?: Maybe<Organisation>;
  /** @deprecated Use 'authorities' instead. */
  organisations: Array<Maybe<Organisation>>;
  /** Get a single quay based on its id) */
  quay?: Maybe<Quay>;
  /** Get all quays */
  quays: Array<Maybe<Quay>>;
  /** Get all quays within the specified bounding box */
  quaysByBbox: Array<Maybe<Quay>>;
  /** Get all quays within the specified radius from a location. The returned type has two fields quay and distance */
  quaysByRadius?: Maybe<QuayAtDistanceConnection>;
  /** Get default routing parameters. */
  routingParameters?: Maybe<RoutingParameters>;
  /** Get a single service journey based on its id */
  serviceJourney?: Maybe<ServiceJourney>;
  /** Get all service journeys */
  serviceJourneys: Array<Maybe<ServiceJourney>>;
  /** Get all active situations */
  situations: Array<Maybe<PtSituationElement>>;
  /** Get a single stopPlace based on its id) */
  stopPlace?: Maybe<StopPlace>;
  /** Get all stopPlaces */
  stopPlaces: Array<Maybe<StopPlace>>;
  /** Get all stop places within the specified bounding box */
  stopPlacesByBbox: Array<Maybe<StopPlace>>;
  /** Input type for executing a travel search for a trip between two locations. Returns trip patterns describing suggested alternatives for the trip. */
  trip?: Maybe<Trip>;
};


export type QueryTypeAuthorityArgs = {
  id: Scalars['String'];
};


export type QueryTypeBikeParkArgs = {
  id: Scalars['String'];
};


export type QueryTypeBikeRentalStationArgs = {
  id: Scalars['String'];
};


export type QueryTypeBikeRentalStationsArgs = {
  ids?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};


export type QueryTypeBikeRentalStationsByBboxArgs = {
  maximumLatitude?: InputMaybe<Scalars['Float']>;
  maximumLongitude?: InputMaybe<Scalars['Float']>;
  minimumLatitude?: InputMaybe<Scalars['Float']>;
  minimumLongitude?: InputMaybe<Scalars['Float']>;
};


export type QueryTypeCarParkArgs = {
  id: Scalars['String'];
};


export type QueryTypeCarParksArgs = {
  ids?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};


export type QueryTypeDatedServiceJourneyArgs = {
  id: Scalars['String'];
};


export type QueryTypeDatedServiceJourneysArgs = {
  alterations?: InputMaybe<Array<InputMaybe<ServiceAlteration>>>;
  authorities?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  lines?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  operatingDays?: InputMaybe<Array<InputMaybe<Scalars['Date']>>>;
  serviceJourneys?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};


export type QueryTypeLineArgs = {
  id: Scalars['String'];
};


export type QueryTypeLinesArgs = {
  authorities?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  flexibleLineTypes?: InputMaybe<Array<InputMaybe<FlexibleLineType>>>;
  ids?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  name?: InputMaybe<Scalars['String']>;
  publicCode?: InputMaybe<Scalars['String']>;
  publicCodes?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  transportModes?: InputMaybe<Array<InputMaybe<TransportMode>>>;
};


export type QueryTypeNearestArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  filterByIds?: InputMaybe<InputFilters>;
  filterByInUse?: InputMaybe<Scalars['Boolean']>;
  filterByModes?: InputMaybe<Array<InputMaybe<Mode>>>;
  filterByPlaceTypes?: InputMaybe<Array<InputMaybe<FilterPlaceType>>>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  latitude: Scalars['Float'];
  longitude: Scalars['Float'];
  maximumDistance?: InputMaybe<Scalars['Int']>;
  maximumResults?: InputMaybe<Scalars['Int']>;
  multiModalMode?: InputMaybe<MultiModalMode>;
};


export type QueryTypeOperatorArgs = {
  id: Scalars['String'];
};


export type QueryTypeOrganisationArgs = {
  id: Scalars['String'];
};


export type QueryTypeQuayArgs = {
  id: Scalars['String'];
};


export type QueryTypeQuaysArgs = {
  ids?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  name?: InputMaybe<Scalars['String']>;
};


export type QueryTypeQuaysByBboxArgs = {
  authority?: InputMaybe<Scalars['String']>;
  filterByInUse?: InputMaybe<Scalars['Boolean']>;
  maximumLatitude?: InputMaybe<Scalars['Float']>;
  maximumLongitude?: InputMaybe<Scalars['Float']>;
  minimumLatitude?: InputMaybe<Scalars['Float']>;
  minimumLongitude?: InputMaybe<Scalars['Float']>;
};


export type QueryTypeQuaysByRadiusArgs = {
  after?: InputMaybe<Scalars['String']>;
  authority?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  latitude: Scalars['Float'];
  longitude: Scalars['Float'];
  radius: Scalars['Int'];
};


export type QueryTypeServiceJourneyArgs = {
  id: Scalars['String'];
};


export type QueryTypeServiceJourneysArgs = {
  activeDates?: InputMaybe<Array<InputMaybe<Scalars['Date']>>>;
  authorities?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  lines?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  privateCodes?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};


export type QueryTypeSituationsArgs = {
  authorities?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  severities?: InputMaybe<Array<InputMaybe<Severity>>>;
};


export type QueryTypeStopPlaceArgs = {
  id: Scalars['String'];
};


export type QueryTypeStopPlacesArgs = {
  ids?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};


export type QueryTypeStopPlacesByBboxArgs = {
  authority?: InputMaybe<Scalars['String']>;
  filterByInUse?: InputMaybe<Scalars['Boolean']>;
  maximumLatitude?: InputMaybe<Scalars['Float']>;
  maximumLongitude?: InputMaybe<Scalars['Float']>;
  minimumLatitude?: InputMaybe<Scalars['Float']>;
  minimumLongitude?: InputMaybe<Scalars['Float']>;
  multiModalMode?: InputMaybe<MultiModalMode>;
};


export type QueryTypeTripArgs = {
  allowBikeRental?: InputMaybe<Scalars['Boolean']>;
  arriveBy?: InputMaybe<Scalars['Boolean']>;
  banFirstServiceJourneysFromReuseNo?: InputMaybe<Scalars['Int']>;
  banned?: InputMaybe<InputBanned>;
  bikeSpeed?: InputMaybe<Scalars['Float']>;
  compactLegsByReversedSearch?: InputMaybe<Scalars['Boolean']>;
  dateTime?: InputMaybe<Scalars['DateTime']>;
  from: Location;
  heuristicStepsPerMainStep?: InputMaybe<Scalars['Int']>;
  ignoreInterchanges?: InputMaybe<Scalars['Boolean']>;
  ignoreMinimumBookingPeriod?: InputMaybe<Scalars['Boolean']>;
  ignoreRealtimeUpdates?: InputMaybe<Scalars['Boolean']>;
  includePlannedCancellations?: InputMaybe<Scalars['Boolean']>;
  locale?: InputMaybe<Locale>;
  maxPreTransitTime?: InputMaybe<Scalars['Int']>;
  maxPreTransitWalkDistance?: InputMaybe<Scalars['Float']>;
  maxTransferWalkDistance?: InputMaybe<Scalars['Float']>;
  maximumTransfers?: InputMaybe<Scalars['Int']>;
  maximumWalkDistance?: InputMaybe<Scalars['Float']>;
  minimumTransferTime?: InputMaybe<Scalars['Int']>;
  modes?: InputMaybe<Array<InputMaybe<Mode>>>;
  numTripPatterns?: InputMaybe<Scalars['Int']>;
  optimisationMethod?: InputMaybe<OptimisationMethod>;
  preTransitOverageRate?: InputMaybe<Scalars['Float']>;
  preTransitPenalty?: InputMaybe<Scalars['Float']>;
  preTransitReluctance?: InputMaybe<Scalars['Float']>;
  preferred?: InputMaybe<InputPreferred>;
  reverseOptimizeOnTheFly?: InputMaybe<Scalars['Boolean']>;
  to: Location;
  transferPenalty?: InputMaybe<Scalars['Int']>;
  transitDistanceReluctance?: InputMaybe<Scalars['Float']>;
  transportSubmodes?: InputMaybe<Array<InputMaybe<TransportSubmodeFilter>>>;
  unpreferred?: InputMaybe<InputUnpreferred>;
  useBikeRentalAvailabilityInformation?: InputMaybe<Scalars['Boolean']>;
  useFlex?: InputMaybe<Scalars['Boolean']>;
  vias?: InputMaybe<Array<InputMaybe<Location>>>;
  waitReluctance?: InputMaybe<Scalars['Float']>;
  walkBoardCost?: InputMaybe<Scalars['Int']>;
  walkReluctance?: InputMaybe<Scalars['Float']>;
  walkSpeed?: InputMaybe<Scalars['Float']>;
  wheelchair?: InputMaybe<Scalars['Boolean']>;
  whiteListed?: InputMaybe<InputWhiteListed>;
};

export enum RealtimeState {
  /** The service journey has been added using a real-time update, i.e. the service journey was not present in the regular time table. */
  Added = 'Added',
  /** The service journey has been canceled by a real-time update. */
  Canceled = 'canceled',
  /** The service journey information has been updated and resulted in a different journey pattern compared to the journey pattern of the scheduled service journey. */
  Modified = 'modified',
  /** The service journey information comes from the regular time table, i.e. no real-time update has been applied. */
  Scheduled = 'scheduled',
  /** The service journey information has been updated, but the journey pattern stayed the same as the journey pattern of the scheduled service journey. */
  Updated = 'updated'
}

export enum RelativeDirection {
  CircleClockwise = 'circleClockwise',
  CircleCounterclockwise = 'circleCounterclockwise',
  Continue = 'continue',
  Depart = 'depart',
  Elevator = 'elevator',
  HardLeft = 'hardLeft',
  HardRight = 'hardRight',
  Left = 'left',
  Right = 'right',
  SlightlyLeft = 'slightlyLeft',
  SlightlyRight = 'slightlyRight',
  UturnLeft = 'uturnLeft',
  UturnRight = 'uturnRight'
}

export enum ReportType {
  /** Indicates a general info-message that should not affect trip. */
  General = 'general',
  /** Indicates an incident that may affect trip. */
  Incident = 'incident'
}

/** The default parameters used in travel searches. */
export type RoutingParameters = {
  /** Invariant: boardSlack + alightSlack <= transferSlack. */
  alightSlack?: Maybe<Scalars['Int']>;
  allowBikeRental?: Maybe<Scalars['Boolean']>;
  /** Separate cost for boarding a vehicle with a bicycle, which is more difficult than on foot. */
  bikeBoardCost?: Maybe<Scalars['Int']>;
  bikeParkAndRide?: Maybe<Scalars['Boolean']>;
  /** Cost to park a bike. */
  bikeParkCost?: Maybe<Scalars['Int']>;
  /** Time to park a bike. */
  bikeParkTime?: Maybe<Scalars['Int']>;
  /** Cost to drop-off a rented bike. */
  bikeRentalDropOffCost?: Maybe<Scalars['Int']>;
  /** Time to drop-off a rented bike. */
  bikeRentalDropOffTime?: Maybe<Scalars['Int']>;
  /** Cost to rent a bike. */
  bikeRentalPickupCost?: Maybe<Scalars['Int']>;
  /** Time to rent a bike. */
  bikeRentalPickupTime?: Maybe<Scalars['Int']>;
  /** Max bike speed along streets, in meters per second */
  bikeSpeed?: Maybe<Scalars['Float']>;
  /** Invariant: boardSlack + alightSlack <= transferSlack. */
  boardSlack?: Maybe<Scalars['Int']>;
  /** The acceleration speed of an automobile, in meters per second per second. */
  carAccelerationSpeed?: Maybe<Scalars['Float']>;
  /** The deceleration speed of an automobile, in meters per second per second. */
  carDecelerationSpeed?: Maybe<Scalars['Float']>;
  /** Time to park a car in a park and ride, w/o taking into account driving and walking cost. */
  carDropOffTime?: Maybe<Scalars['Int']>;
  /** Max car speed along streets, in meters per second */
  carSpeed?: Maybe<Scalars['Float']>;
  /** When true, do a full reversed search to compact the legs of the GraphPath. */
  compactLegsByReversedSearch?: Maybe<Scalars['Boolean']>;
  /** Option to disable the default filtering of GTFS-RT alerts by time. */
  disableAlertFiltering?: Maybe<Scalars['Boolean']>;
  /** If true, the remaining weight heuristic is disabled. */
  disableRemainingWeightHeuristic?: Maybe<Scalars['Boolean']>;
  /** What is the cost of boarding a elevator? */
  elevatorBoardCost?: Maybe<Scalars['Int']>;
  /** How long does it take to get on an elevator, on average. */
  elevatorBoardTime?: Maybe<Scalars['Int']>;
  /** What is the cost of travelling one floor on an elevator? */
  elevatorHopCost?: Maybe<Scalars['Int']>;
  /** How long does it take to advance one floor on an elevator? */
  elevatorHopTime?: Maybe<Scalars['Int']>;
  /** Whether to apply the ellipsoid->geoid offset to all elevations in the response. */
  geoIdElevation?: Maybe<Scalars['Boolean']>;
  /** When true, realtime updates are ignored during this search. */
  ignoreRealTimeUpdates?: Maybe<Scalars['Boolean']>;
  /** When true, service journeys cancelled in scheduled route data will be included during this search. */
  includedPlannedCancellations?: Maybe<Scalars['Boolean']>;
  /** Whether to apply the ellipsoid->geoid offset to all elevations in the response. */
  interchangeAllowedPenalty?: Maybe<Scalars['Int']>;
  kissAndRide?: Maybe<Scalars['Boolean']>;
  /** The maximum time (in seconds) of pre-transit travel when using drive-to-transit (park and ride or kiss and ride). */
  maxPreTransitTime?: Maybe<Scalars['Float']>;
  /** The maximum slope of streets for wheelchair trips. */
  maxSlope?: Maybe<Scalars['Float']>;
  /** The maximum distance (in meters) the user is willing to walk for transfer legs. */
  maxTransferWalkDistance?: Maybe<Scalars['Float']>;
  /** Maximum number of transfers returned in a trip plan. */
  maxTransfers?: Maybe<Scalars['Int']>;
  /** The maximum distance (in meters) the user is willing to walk for access/egress legs. */
  maxWalkDistance?: Maybe<Scalars['Float']>;
  /** Whether to apply the ellipsoid->geoid offset to all elevations in the response. */
  noInterchangePenalty?: Maybe<Scalars['Int']>;
  /** The maximum number of itineraries to return. */
  numItineraries?: Maybe<Scalars['Int']>;
  /** Accept only paths that use transit (no street-only paths). */
  onlyTransitTrips?: Maybe<Scalars['Boolean']>;
  /** Penalty added for using every route that is not preferred if user set any route as preferred. We return number of seconds that we are willing to wait for preferred route. */
  otherThanPreferredRoutesPenalty?: Maybe<Scalars['Int']>;
  parkAndRide?: Maybe<Scalars['Boolean']>;
  /** A jump in cost for every second over the pre-transit time limit. */
  preTransitOverageRate?: Maybe<Scalars['Float']>;
  /** A jump in cost when stepping over the pre-transit time limit. */
  preTransitPenalty?: Maybe<Scalars['Float']>;
  /** How much worse driving before and after transit is than riding on transit. Applies to ride and kiss, kiss and ride and park and ride. */
  preTransitReluctance?: Maybe<Scalars['Float']>;
  /** Whether to apply the ellipsoid->geoid offset to all elevations in the response. */
  preferredInterchangePenalty?: Maybe<Scalars['Int']>;
  /** Whether to apply the ellipsoid->geoid offset to all elevations in the response. */
  recommendedInterchangePenalty?: Maybe<Scalars['Int']>;
  /** When true, reverse optimize this search on the fly whenever needed, rather than reverse-optimizing the entire path when it's done. */
  reverseOptimizeOnTheFly?: Maybe<Scalars['Boolean']>;
  rideAndKiss?: Maybe<Scalars['Boolean']>;
  /** Whether the planner should return intermediate stops lists for transit legs. */
  showIntermediateStops?: Maybe<Scalars['Boolean']>;
  softPreTransitLimiting?: Maybe<Scalars['Boolean']>;
  softWalkLimiting?: Maybe<Scalars['Boolean']>;
  /** A jump in cost for every meter over the walking limit. */
  softWalkOverageRate?: Maybe<Scalars['Float']>;
  /** A jump in cost when stepping over the walking limit. */
  softWalkPenalty?: Maybe<Scalars['Float']>;
  /** Used instead of walkReluctance for stairs. */
  stairsReluctance?: Maybe<Scalars['Float']>;
  /** An extra penalty added on transfers (i.e. all boardings except the first one). */
  transferPenalty?: Maybe<Scalars['Int']>;
  /** A global minimum transfer time (in seconds) that specifies the minimum amount of time that must pass between exiting one transit vehicle and boarding another. */
  transferSlack?: Maybe<Scalars['Int']>;
  /** Multiplicative factor on expected turning time. */
  turnReluctance?: Maybe<Scalars['Float']>;
  /** Should traffic congestion be considered when driving? */
  useTraffic?: Maybe<Scalars['Boolean']>;
  /** How much less bad is waiting at the beginning of the trip (replaces waitReluctance on the first boarding). */
  waitAtBeginningFactor?: Maybe<Scalars['Float']>;
  /** How much worse is waiting for a transit vehicle than being on a transit vehicle, as a multiplier. */
  waitReluctance?: Maybe<Scalars['Float']>;
  /** This prevents unnecessary transfers by adding a cost for boarding a vehicle. */
  walkBoardCost?: Maybe<Scalars['Int']>;
  /** How much more reluctant is the user to walk on streets with car traffic allowed. */
  walkOnStreetReluctance?: Maybe<Scalars['Float']>;
  /** A multiplier for how bad walking is, compared to being in transit for equal lengths of time. */
  walkReluctance?: Maybe<Scalars['Float']>;
  /** Max walk speed along streets, in meters per second */
  walkSpeed?: Maybe<Scalars['Float']>;
  /** Whether the trip must be wheelchair accessible. */
  wheelChairAccessible?: Maybe<Scalars['Boolean']>;
};

export enum ServiceAlteration {
  Cancellation = 'cancellation',
  ExtraJourney = 'extraJourney',
  Planned = 'planned',
  Replaced = 'replaced'
}

/** A planned vehicle journey with passengers. */
export type ServiceJourney = {
  /** Return a list of operating/service days a ServiceJourney run on. Cancellation/replaced alterations is not included. */
  activeDates: Array<Maybe<Scalars['Date']>>;
  /** Whether bikes are allowed on service journey. */
  bikesAllowed?: Maybe<BikesAllowed>;
  /** Booking arrangements for flexible services. */
  bookingArrangements?: Maybe<BookingArrangement>;
  directionType?: Maybe<DirectionType>;
  /** Returns scheduled passingTimes for this ServiceJourney for a given date, updated with realtime-updates (if available). NB! This takes a date as argument (default=today) and returns estimatedCalls for that date and should only be used if the date is known when creating the request. For fetching estimatedCalls for a given trip.leg, use leg.serviceJourneyEstimatedCalls instead. */
  estimatedCalls?: Maybe<Array<Maybe<EstimatedCall>>>;
  /** Type of flexible service, or null if service is not flexible. */
  flexibleServiceType?: Maybe<FlexibleServiceType>;
  id: Scalars['ID'];
  journeyPattern?: Maybe<JourneyPattern>;
  /** List of keyValue pairs for the service journey. */
  keyValues?: Maybe<Array<Maybe<KeyValue>>>;
  line: Line;
  /**
   * Publicly announced code for line, differentiating it from other lines for the same operator.
   * @deprecated Use line.publicCode instead.
   */
  linePublicCode?: Maybe<Scalars['String']>;
  notices: Array<Maybe<Notice>>;
  operator?: Maybe<Operator>;
  /** Returns scheduled passing times only - without realtime-updates, for realtime-data use 'estimatedCalls' */
  passingTimes: Array<Maybe<TimetabledPassingTime>>;
  /** Detailed path travelled by service journey. */
  pointsOnLink?: Maybe<PointsOnLink>;
  /** For internal use by operators. */
  privateCode?: Maybe<Scalars['String']>;
  /** Publicly announced code for service journey, differentiating it from other service journeys for the same line. */
  publicCode?: Maybe<Scalars['String']>;
  /** Quays visited by service journey */
  quays: Array<Quay>;
  /** When a trip is added using realtime-data, this is a reference to the replaced ServiceJourney. */
  replacementForServiceJourneyId?: Maybe<Scalars['String']>;
  /**
   * For a Whether journey is as planned, a cancellation, an extra journey or replaced.
   * @deprecated The service-alteration might be different for each service day, so this method is not always giving the correct result. This method will return 'null' if there is a mix of different alterations.
   */
  serviceAlteration?: Maybe<ServiceAlteration>;
  /** Get all situations active for the service journey */
  situations: Array<Maybe<PtSituationElement>>;
  /** The transport submode of the journey, if different from lines transport submode. */
  transportSubmode?: Maybe<TransportSubmode>;
  /** Whether service journey is accessible with wheelchair. */
  wheelchairAccessible?: Maybe<WheelchairBoarding>;
};


/** A planned vehicle journey with passengers. */
export type ServiceJourneyEstimatedCallsArgs = {
  date?: InputMaybe<Scalars['Date']>;
};

export enum Severity {
  /** Situation has no impact on trips. */
  NoImpact = 'noImpact',
  /** Situation has an impact on trips (default). */
  Normal = 'normal',
  /** Situation has a severe impact on trips. */
  Severe = 'severe',
  /** Situation has a slight impact on trips. */
  Slight = 'slight',
  /** Severity is undefined. */
  Undefined = 'undefined',
  /** Situation has unknown impact on trips. */
  Unknown = 'unknown',
  /** Situation has a very severe impact on trips. */
  VerySevere = 'verySevere',
  /** Situation has a very slight impact on trips. */
  VerySlight = 'verySlight'
}

export enum StopCondition {
  /** Situation applies when stop is the destination of the leg. */
  Destination = 'destination',
  /** Situation applies when transfering to another leg at the stop. */
  ExceptionalStop = 'exceptionalStop',
  /** Situation applies when passing the stop, without stopping. */
  NotStopping = 'notStopping',
  /** Situation applies when at the stop, and the stop requires a request to stop. */
  RequestStop = 'requestStop',
  /** Situation applies when stop is the startpoint of the leg. */
  StartPoint = 'startPoint'
}

/** Named place where public transport may be accessed. May be a building complex (e.g. a station) or an on-street location. */
export type StopPlace = PlaceInterface & {
  /** This stop place's adjacent sites */
  adjacentSites?: Maybe<Array<Maybe<Scalars['String']>>>;
  description?: Maybe<Scalars['String']>;
  /** List of visits to this stop place as part of vehicle journeys. */
  estimatedCalls: Array<Maybe<EstimatedCall>>;
  id: Scalars['ID'];
  latitude?: Maybe<Scalars['Float']>;
  longitude?: Maybe<Scalars['Float']>;
  name: Scalars['String'];
  /** Returns parent stop for this stop */
  parent?: Maybe<StopPlace>;
  /** Returns all quays that are children of this stop place */
  quays?: Maybe<Array<Maybe<Quay>>>;
  tariffZones: Array<Maybe<TariffZone>>;
  timezone: Scalars['String'];
  /** The transport mode serviced by this stop place. */
  transportMode?: Maybe<TransportMode>;
  /** The transport submode serviced by this stop place. */
  transportSubmode?: Maybe<TransportSubmode>;
  /** Relative weighting of this stop with regards to interchanges. */
  weighting?: Maybe<InterchangeWeighting>;
  /** Whether this stop place is suitable for wheelchair boarding. */
  wheelchairBoarding?: Maybe<WheelchairBoarding>;
};


/** Named place where public transport may be accessed. May be a building complex (e.g. a station) or an on-street location. */
export type StopPlaceEstimatedCallsArgs = {
  includeCancelledTrips?: InputMaybe<Scalars['Boolean']>;
  numberOfDepartures?: InputMaybe<Scalars['Int']>;
  numberOfDeparturesPerLineAndDestinationDisplay?: InputMaybe<Scalars['Int']>;
  omitNonBoarding?: InputMaybe<Scalars['Boolean']>;
  startTime?: InputMaybe<Scalars['DateTime']>;
  timeRange?: InputMaybe<Scalars['Int']>;
  whiteListed?: InputMaybe<InputWhiteListed>;
  whiteListedModes?: InputMaybe<Array<InputMaybe<Mode>>>;
};


/** Named place where public transport may be accessed. May be a building complex (e.g. a station) or an on-street location. */
export type StopPlaceQuaysArgs = {
  filterByInUse?: InputMaybe<Scalars['Boolean']>;
};

export enum StopType {
  FlexibleArea = 'flexible_area',
  Regular = 'regular'
}

export type TariffZone = {
  id?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
};

export type TimeAndDayOffset = {
  /** Number of days offset from base line time */
  dayOffset?: Maybe<Scalars['Int']>;
  /** Local time */
  time?: Maybe<Scalars['Time']>;
};

/** Scheduled passing times. These are not affected by real time updates. */
export type TimetabledPassingTime = {
  /** Scheduled time of arrival at quay */
  arrival?: Maybe<TimeAndDayOffset>;
  /** Booking arrangements for flexible service. */
  bookingArrangements?: Maybe<BookingArrangement>;
  /** Scheduled time of departure from quay */
  departure?: Maybe<TimeAndDayOffset>;
  destinationDisplay?: Maybe<DestinationDisplay>;
  /** Whether vehicle may be alighted at quay. */
  forAlighting?: Maybe<Scalars['Boolean']>;
  /** Whether vehicle may be boarded at quay. */
  forBoarding?: Maybe<Scalars['Boolean']>;
  notices: Array<Maybe<Notice>>;
  quay?: Maybe<Quay>;
  /** Whether vehicle will only stop on request. */
  requestStop?: Maybe<Scalars['Boolean']>;
  serviceJourney?: Maybe<ServiceJourney>;
  /** Whether this is a timing point or not. Boarding and alighting is not allowed at timing points. */
  timingPoint?: Maybe<Scalars['Boolean']>;
};

export enum TransportMode {
  Air = 'air',
  Bus = 'bus',
  Cableway = 'cableway',
  Coach = 'coach',
  Funicular = 'funicular',
  Lift = 'lift',
  Metro = 'metro',
  Rail = 'rail',
  Tram = 'tram',
  Unknown = 'unknown',
  Water = 'water'
}

export enum TransportSubmode {
  SchengenAreaFlight = 'SchengenAreaFlight',
  AirportBoatLink = 'airportBoatLink',
  AirportLinkBus = 'airportLinkBus',
  AirportLinkRail = 'airportLinkRail',
  AirshipService = 'airshipService',
  AllFunicularServices = 'allFunicularServices',
  AllHireVehicles = 'allHireVehicles',
  AllTaxiServices = 'allTaxiServices',
  BikeTaxi = 'bikeTaxi',
  BlackCab = 'blackCab',
  CableCar = 'cableCar',
  CableFerry = 'cableFerry',
  CanalBarge = 'canalBarge',
  CarTransportRailService = 'carTransportRailService',
  ChairLift = 'chairLift',
  CharterTaxi = 'charterTaxi',
  CityTram = 'cityTram',
  CommunalTaxi = 'communalTaxi',
  CommuterCoach = 'commuterCoach',
  CrossCountryRail = 'crossCountryRail',
  DedicatedLaneBus = 'dedicatedLaneBus',
  DemandAndResponseBus = 'demandAndResponseBus',
  DomesticCharterFlight = 'domesticCharterFlight',
  DomesticFlight = 'domesticFlight',
  DomesticScheduledFlight = 'domesticScheduledFlight',
  DragLift = 'dragLift',
  ExpressBus = 'expressBus',
  Funicular = 'funicular',
  HelicopterService = 'helicopterService',
  HighFrequencyBus = 'highFrequencyBus',
  HighSpeedPassengerService = 'highSpeedPassengerService',
  HighSpeedRail = 'highSpeedRail',
  HighSpeedVehicleService = 'highSpeedVehicleService',
  HireCar = 'hireCar',
  HireCycle = 'hireCycle',
  HireMotorbike = 'hireMotorbike',
  HireVan = 'hireVan',
  IntercontinentalCharterFlight = 'intercontinentalCharterFlight',
  IntercontinentalFlight = 'intercontinentalFlight',
  International = 'international',
  InternationalCarFerry = 'internationalCarFerry',
  InternationalCharterFlight = 'internationalCharterFlight',
  InternationalCoach = 'internationalCoach',
  InternationalFlight = 'internationalFlight',
  InternationalPassengerFerry = 'internationalPassengerFerry',
  InterregionalRail = 'interregionalRail',
  Lift = 'lift',
  Local = 'local',
  LocalBus = 'localBus',
  LocalCarFerry = 'localCarFerry',
  LocalPassengerFerry = 'localPassengerFerry',
  LocalTram = 'localTram',
  LongDistance = 'longDistance',
  Metro = 'metro',
  MiniCab = 'miniCab',
  MobilityBus = 'mobilityBus',
  MobilityBusForRegisteredDisabled = 'mobilityBusForRegisteredDisabled',
  NationalCarFerry = 'nationalCarFerry',
  NationalCoach = 'nationalCoach',
  NationalPassengerFerry = 'nationalPassengerFerry',
  NightBus = 'nightBus',
  NightRail = 'nightRail',
  PostBoat = 'postBoat',
  PostBus = 'postBus',
  RackAndPinionRailway = 'rackAndPinionRailway',
  RailReplacementBus = 'railReplacementBus',
  RailShuttle = 'railShuttle',
  RailTaxi = 'railTaxi',
  RegionalBus = 'regionalBus',
  RegionalCarFerry = 'regionalCarFerry',
  RegionalCoach = 'regionalCoach',
  RegionalPassengerFerry = 'regionalPassengerFerry',
  RegionalRail = 'regionalRail',
  RegionalTram = 'regionalTram',
  ReplacementRailService = 'replacementRailService',
  RiverBus = 'riverBus',
  RoadFerryLink = 'roadFerryLink',
  RoundTripCharterFlight = 'roundTripCharterFlight',
  ScheduledFerry = 'scheduledFerry',
  SchoolAndPublicServiceBus = 'schoolAndPublicServiceBus',
  SchoolBoat = 'schoolBoat',
  SchoolBus = 'schoolBus',
  SchoolCoach = 'schoolCoach',
  ShortHaulInternationalFlight = 'shortHaulInternationalFlight',
  ShuttleBus = 'shuttleBus',
  ShuttleCoach = 'shuttleCoach',
  ShuttleFerryService = 'shuttleFerryService',
  ShuttleFlight = 'shuttleFlight',
  ShuttleTram = 'shuttleTram',
  SightseeingBus = 'sightseeingBus',
  SightseeingCoach = 'sightseeingCoach',
  SightseeingFlight = 'sightseeingFlight',
  SightseeingService = 'sightseeingService',
  SightseeingTram = 'sightseeingTram',
  SleeperRailService = 'sleeperRailService',
  SpecialCoach = 'specialCoach',
  SpecialNeedsBus = 'specialNeedsBus',
  SpecialTrain = 'specialTrain',
  StreetCableCar = 'streetCableCar',
  SuburbanRailway = 'suburbanRailway',
  Telecabin = 'telecabin',
  TelecabinLink = 'telecabinLink',
  TouristCoach = 'touristCoach',
  TouristRailway = 'touristRailway',
  TrainFerry = 'trainFerry',
  TrainTram = 'trainTram',
  Tube = 'tube',
  Undefined = 'undefined',
  UndefinedFunicular = 'undefinedFunicular',
  Unknown = 'unknown',
  UrbanRailway = 'urbanRailway',
  WaterTaxi = 'waterTaxi'
}

/** Filter trips by allowing only certain transport submodes per mode. */
export type TransportSubmodeFilter = {
  /** Set of ids for lines that should be used */
  transportMode: TransportMode;
  /** Set of transport submodes allowed for transport mode. */
  transportSubmodes: Array<InputMaybe<TransportSubmode>>;
};

/** Description of a travel between two places. */
export type Trip = {
  /** The time and date of travel */
  dateTime?: Maybe<Scalars['DateTime']>;
  /** Information about the timings for the trip generation */
  debugOutput: DebugOutput;
  /** The origin */
  fromPlace: Place;
  /** A list of possible error messages as enum */
  messageEnums: Array<Maybe<Scalars['String']>>;
  /** A list of possible error messages in cleartext */
  messageStrings: Array<Maybe<Scalars['String']>>;
  /** The destination */
  toPlace: Place;
  /** A list of possible trip patterns */
  tripPatterns: Array<Maybe<TripPattern>>;
};

/** List of legs constituting a suggested sequence of rides and links for a specific trip. */
export type TripPattern = {
  /** The aimed date and time the trip ends. */
  aimedEndTime?: Maybe<Scalars['DateTime']>;
  /** The aimed date and time the trip starts. */
  aimedStartTime?: Maybe<Scalars['DateTime']>;
  /** This sums the direct durations of each leg. Be careful about using this, as it is not equal to the duration between startTime and endTime. See the directDuration documentation on Leg. */
  directDuration?: Maybe<Scalars['Long']>;
  /** Total distance for the trip, in meters. */
  distance?: Maybe<Scalars['Float']>;
  /** Duration of the trip, in seconds. */
  duration?: Maybe<Scalars['Long']>;
  /**
   * Time that the trip arrives.
   * @deprecated Replaced with expectedEndTime
   */
  endTime?: Maybe<Scalars['DateTime']>;
  /** The expected, realtime adjusted date and time the trip ends. */
  expectedEndTime?: Maybe<Scalars['DateTime']>;
  /** The expected, realtime adjusted date and time the trip starts. */
  expectedStartTime?: Maybe<Scalars['DateTime']>;
  /** A list of legs. Each leg is either a walking (cycling, car) portion of the trip, or a ride leg on a particular vehicle. So a trip where the use walks to the Q train, transfers to the 6, then walks to their destination, has four legs. */
  legs: Array<Maybe<Leg>>;
  /**
   * Time that the trip departs.
   * @deprecated Replaced with expectedStartTime
   */
  startTime?: Maybe<Scalars['DateTime']>;
  /** How much time is spent waiting for transit to arrive, in seconds. */
  waitingTime?: Maybe<Scalars['Long']>;
  /** How far the user has to walk, in meters. */
  walkDistance?: Maybe<Scalars['Float']>;
  /** How much time is spent walking, in seconds. */
  walkTime?: Maybe<Scalars['Long']>;
  /** Weight of the itinerary. Used for debugging. The result might have been modified after (e.g. by removing short legs) and will notnecessarily exactly represent the tripPattern. It is however the weightthat was the basis for choosing the result in the first place. If the result has been heavily modified, this field will be null. */
  weight?: Maybe<Scalars['Float']>;
};

export type ValidityPeriod = {
  /** End of validity period */
  endTime?: Maybe<Scalars['DateTime']>;
  /** Start of validity period */
  startTime?: Maybe<Scalars['DateTime']>;
};

export enum VertexType {
  BikePark = 'bikePark',
  BikeShare = 'bikeShare',
  Normal = 'normal',
  ParkAndRide = 'parkAndRide',
  Transit = 'transit'
}

export enum WheelchairBoarding {
  /** There is no accessibility information for the stopPlace/quay. */
  NoInformation = 'noInformation',
  /** Wheelchair boarding/alighting is not possible at this stop. */
  NotPossible = 'notPossible',
  /** Boarding wheelchair-accessible serviceJourneys is possible at this stopPlace/quay. */
  Possible = 'possible'
}

export type DebugOutput = {
  totalTime?: Maybe<Scalars['Long']>;
};

export type InfoLink = {
  /** Label */
  label?: Maybe<Scalars['String']>;
  /** URI */
  uri?: Maybe<Scalars['String']>;
};

/** A connection to a list of items. */
export type PlaceAtDistanceConnection = {
  /** a list of edges */
  edges?: Maybe<Array<Maybe<PlaceAtDistanceEdge>>>;
  /** details about this specific page */
  pageInfo: PageInfo;
};

/** An edge in a connection */
export type PlaceAtDistanceEdge = {
  /** cursor marks a unique position or index into the connection */
  cursor: Scalars['String'];
  /** The item at the end of the edge */
  node?: Maybe<PlaceAtDistance>;
};

/** A connection to a list of items. */
export type QuayAtDistanceConnection = {
  /** a list of edges */
  edges?: Maybe<Array<Maybe<QuayAtDistanceEdge>>>;
  /** details about this specific page */
  pageInfo: PageInfo;
};

/** An edge in a connection */
export type QuayAtDistanceEdge = {
  /** cursor marks a unique position or index into the connection */
  cursor: Scalars['String'];
  /** The item at the end of the edge */
  node?: Maybe<QuayAtDistance>;
};
