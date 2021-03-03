export type Maybe<T> = T;
export type Exact<T extends { [key: string]: any }> = { [K in keyof T]: T[K] };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** DateTime format accepting ISO dates. Return values on format: yyyy-MM-dd'T'HH:mm:ssXXXX. Example: 2017-04-23T18:25:43+0100 */
  DateTime: any;
  /** Long type */
  Long: any;
  /** Time using the format: HH:mm:SS. Example: 18:25:SS */
  LocalTime: any;
  Coordinates: any;
  /** Date  using the format: yyyy-MM-dd. Example: 2017-04-23 */
  Date: any;
  /** Time using the format: HH:mm:ss. Example: 18:25:43 */
  Time: any;
};

export type QueryType = {
  /** Input type for executing a travel search for a trip between two locations. Returns trip patterns describing suggested alternatives for the trip. */
  trip?: Maybe<Trip>;
  /** Get a single stopPlace based on its id) */
  stopPlace?: Maybe<StopPlace>;
  /** Get all stopPlaces */
  stopPlaces: Array<Maybe<StopPlace>>;
  /** Get all stop places within the specified bounding box */
  stopPlacesByBbox: Array<Maybe<StopPlace>>;
  /** Get a single quay based on its id) */
  quay?: Maybe<Quay>;
  /** Get all quays */
  quays: Array<Maybe<Quay>>;
  /** Get all quays within the specified bounding box */
  quaysByBbox: Array<Maybe<Quay>>;
  /** Get all quays within the specified radius from a location. The returned type has two fields quay and distance */
  quaysByRadius?: Maybe<QuayAtDistanceConnection>;
  /** Get all places (quays, stop places, car parks etc. with coordinates) within the specified radius from a location. The returned type has two fields place and distance. The search is done by walking so the distance is according to the network of walkables. */
  nearest?: Maybe<PlaceAtDistanceConnection>;
  /** Get an authority by ID */
  authority?: Maybe<Authority>;
  /** Get all authorities */
  authorities: Array<Maybe<Authority>>;
  /** Get a operator by ID */
  operator?: Maybe<Operator>;
  /** Get all operators */
  operators: Array<Maybe<Operator>>;
  /** @deprecated Use 'authority' instead. */
  organisation?: Maybe<Organisation>;
  /** @deprecated Use 'authorities' instead. */
  organisations: Array<Maybe<Organisation>>;
  /** Get a single line based on its id */
  line?: Maybe<Line>;
  /** Get all lines */
  lines: Array<Maybe<Line>>;
  /** Get a single service journey based on its id */
  serviceJourney?: Maybe<ServiceJourney>;
  /** Get all service journeys */
  serviceJourneys: Array<Maybe<ServiceJourney>>;
  /** Get a single dated service journey based on its id */
  datedServiceJourney?: Maybe<DatedServiceJourney>;
  /** List dated service journeys */
  datedServiceJourneys: Array<Maybe<DatedServiceJourney>>;
  /** Get all bike rental stations */
  bikeRentalStations: Array<Maybe<BikeRentalStation>>;
  /** Get a single bike rental station based on its id */
  bikeRentalStation?: Maybe<BikeRentalStation>;
  /** Get all bike rental stations within the specified bounding box. */
  bikeRentalStationsByBbox: Array<Maybe<BikeRentalStation>>;
  /** Get a single bike park based on its id */
  bikePark?: Maybe<BikePark>;
  /** Get all bike parks */
  bikeParks: Array<Maybe<BikePark>>;
  /** Get a single car park based on its id */
  carPark?: Maybe<CarPark>;
  /** Get all car parks */
  carParks: Array<Maybe<CarPark>>;
  /** Get default routing parameters. */
  routingParameters?: Maybe<RoutingParameters>;
  /** Get all notices */
  notices: Array<Maybe<Notice>>;
  /** Get all active situations */
  situations: Array<Maybe<PtSituationElement>>;
};


export type QueryTypeTripArgs = {
  dateTime?: Maybe<Scalars['DateTime']>;
  from: Location;
  to: Location;
  wheelchair?: Maybe<Scalars['Boolean']>;
  numTripPatterns?: Maybe<Scalars['Int']>;
  maximumWalkDistance?: Maybe<Scalars['Float']>;
  maxTransferWalkDistance?: Maybe<Scalars['Float']>;
  walkSpeed?: Maybe<Scalars['Float']>;
  bikeSpeed?: Maybe<Scalars['Float']>;
  optimisationMethod?: Maybe<OptimisationMethod>;
  arriveBy?: Maybe<Scalars['Boolean']>;
  vias?: Maybe<Array<Maybe<Location>>>;
  preferred?: Maybe<InputPreferred>;
  unpreferred?: Maybe<InputUnpreferred>;
  banned?: Maybe<InputBanned>;
  whiteListed?: Maybe<InputWhiteListed>;
  transferPenalty?: Maybe<Scalars['Int']>;
  modes?: Maybe<Array<Maybe<Mode>>>;
  transportSubmodes?: Maybe<Array<Maybe<TransportSubmodeFilter>>>;
  allowBikeRental?: Maybe<Scalars['Boolean']>;
  useBikeRentalAvailabilityInformation?: Maybe<Scalars['Boolean']>;
  minimumTransferTime?: Maybe<Scalars['Int']>;
  maximumTransfers?: Maybe<Scalars['Int']>;
  ignoreRealtimeUpdates?: Maybe<Scalars['Boolean']>;
  includePlannedCancellations?: Maybe<Scalars['Boolean']>;
  ignoreInterchanges?: Maybe<Scalars['Boolean']>;
  locale?: Maybe<Locale>;
  heuristicStepsPerMainStep?: Maybe<Scalars['Int']>;
  compactLegsByReversedSearch?: Maybe<Scalars['Boolean']>;
  reverseOptimizeOnTheFly?: Maybe<Scalars['Boolean']>;
  maxPreTransitTime?: Maybe<Scalars['Int']>;
  preTransitPenalty?: Maybe<Scalars['Float']>;
  preTransitOverageRate?: Maybe<Scalars['Float']>;
  preTransitReluctance?: Maybe<Scalars['Float']>;
  maxPreTransitWalkDistance?: Maybe<Scalars['Float']>;
  useFlex?: Maybe<Scalars['Boolean']>;
  banFirstServiceJourneysFromReuseNo?: Maybe<Scalars['Int']>;
  walkBoardCost?: Maybe<Scalars['Int']>;
  walkReluctance?: Maybe<Scalars['Float']>;
  waitReluctance?: Maybe<Scalars['Float']>;
  ignoreMinimumBookingPeriod?: Maybe<Scalars['Boolean']>;
  transitDistanceReluctance?: Maybe<Scalars['Float']>;
};


export type QueryTypeStopPlaceArgs = {
  id: Scalars['String'];
};


export type QueryTypeStopPlacesArgs = {
  ids?: Maybe<Array<Maybe<Scalars['String']>>>;
};


export type QueryTypeStopPlacesByBboxArgs = {
  minimumLatitude?: Maybe<Scalars['Float']>;
  minimumLongitude?: Maybe<Scalars['Float']>;
  maximumLatitude?: Maybe<Scalars['Float']>;
  maximumLongitude?: Maybe<Scalars['Float']>;
  authority?: Maybe<Scalars['String']>;
  multiModalMode?: Maybe<MultiModalMode>;
  filterByInUse?: Maybe<Scalars['Boolean']>;
};


export type QueryTypeQuayArgs = {
  id: Scalars['String'];
};


export type QueryTypeQuaysArgs = {
  ids?: Maybe<Array<Maybe<Scalars['String']>>>;
  name?: Maybe<Scalars['String']>;
};


export type QueryTypeQuaysByBboxArgs = {
  minimumLatitude?: Maybe<Scalars['Float']>;
  minimumLongitude?: Maybe<Scalars['Float']>;
  maximumLatitude?: Maybe<Scalars['Float']>;
  maximumLongitude?: Maybe<Scalars['Float']>;
  authority?: Maybe<Scalars['String']>;
  filterByInUse?: Maybe<Scalars['Boolean']>;
};


export type QueryTypeQuaysByRadiusArgs = {
  latitude: Scalars['Float'];
  longitude: Scalars['Float'];
  radius: Scalars['Int'];
  authority?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  after?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
};


export type QueryTypeNearestArgs = {
  latitude: Scalars['Float'];
  longitude: Scalars['Float'];
  maximumDistance?: Maybe<Scalars['Int']>;
  maximumResults?: Maybe<Scalars['Int']>;
  filterByPlaceTypes?: Maybe<Array<Maybe<FilterPlaceType>>>;
  filterByModes?: Maybe<Array<Maybe<Mode>>>;
  filterByInUse?: Maybe<Scalars['Boolean']>;
  filterByIds?: Maybe<InputFilters>;
  multiModalMode?: Maybe<MultiModalMode>;
  before?: Maybe<Scalars['String']>;
  after?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
};


export type QueryTypeAuthorityArgs = {
  id: Scalars['String'];
};


export type QueryTypeOperatorArgs = {
  id: Scalars['String'];
};


export type QueryTypeOrganisationArgs = {
  id: Scalars['String'];
};


export type QueryTypeLineArgs = {
  id: Scalars['String'];
};


export type QueryTypeLinesArgs = {
  ids?: Maybe<Array<Maybe<Scalars['String']>>>;
  name?: Maybe<Scalars['String']>;
  publicCode?: Maybe<Scalars['String']>;
  publicCodes?: Maybe<Array<Maybe<Scalars['String']>>>;
  transportModes?: Maybe<Array<Maybe<TransportMode>>>;
  authorities?: Maybe<Array<Maybe<Scalars['String']>>>;
  flexibleLineTypes?: Maybe<Array<Maybe<FlexibleLineType>>>;
};


export type QueryTypeServiceJourneyArgs = {
  id: Scalars['String'];
};


export type QueryTypeServiceJourneysArgs = {
  lines?: Maybe<Array<Maybe<Scalars['String']>>>;
  privateCodes?: Maybe<Array<Maybe<Scalars['String']>>>;
  activeDates?: Maybe<Array<Maybe<Scalars['Date']>>>;
  authorities?: Maybe<Array<Maybe<Scalars['String']>>>;
};


export type QueryTypeDatedServiceJourneyArgs = {
  id: Scalars['String'];
};


export type QueryTypeDatedServiceJourneysArgs = {
  lines?: Maybe<Array<Maybe<Scalars['String']>>>;
  serviceJourneys?: Maybe<Array<Maybe<Scalars['String']>>>;
  operatingDays?: Maybe<Array<Maybe<Scalars['Date']>>>;
  alterations?: Maybe<Array<Maybe<ServiceAlteration>>>;
  authorities?: Maybe<Array<Maybe<Scalars['String']>>>;
};


export type QueryTypeBikeRentalStationsArgs = {
  ids?: Maybe<Array<Maybe<Scalars['String']>>>;
};


export type QueryTypeBikeRentalStationArgs = {
  id: Scalars['String'];
};


export type QueryTypeBikeRentalStationsByBboxArgs = {
  minimumLatitude?: Maybe<Scalars['Float']>;
  minimumLongitude?: Maybe<Scalars['Float']>;
  maximumLatitude?: Maybe<Scalars['Float']>;
  maximumLongitude?: Maybe<Scalars['Float']>;
};


export type QueryTypeBikeParkArgs = {
  id: Scalars['String'];
};


export type QueryTypeCarParkArgs = {
  id: Scalars['String'];
};


export type QueryTypeCarParksArgs = {
  ids?: Maybe<Array<Maybe<Scalars['String']>>>;
};


export type QueryTypeSituationsArgs = {
  authorities?: Maybe<Array<Maybe<Scalars['String']>>>;
  severities?: Maybe<Array<Maybe<Severity>>>;
};

/** Description of a travel between two places. */
export type Trip = {
  /** The time and date of travel */
  dateTime?: Maybe<Scalars['DateTime']>;
  /** The origin */
  fromPlace: Place;
  /** The destination */
  toPlace: Place;
  /** A list of possible trip patterns */
  tripPatterns: Array<Maybe<TripPattern>>;
  /** A list of possible error messages as enum */
  messageEnums: Array<Maybe<Scalars['String']>>;
  /** A list of possible error messages in cleartext */
  messageStrings: Array<Maybe<Scalars['String']>>;
  /** Information about the timings for the trip generation */
  debugOutput: DebugOutput;
};


/** Common super class for all places (stop places, quays, car parks, bike parks and bike rental stations ) */
export type Place = {
  /** For transit quays, the name of the quay. For points of interest, the name of the POI. */
  name?: Maybe<Scalars['String']>;
  /** Type of vertex. (Normal, Bike sharing station, Bike P+R, Transit quay) Mostly used for better localization of bike sharing and P+R station names */
  vertexType?: Maybe<VertexType>;
  /** The latitude of the place. */
  latitude: Scalars['Float'];
  /** The longitude of the place. */
  longitude: Scalars['Float'];
  /** The quay related to the place. */
  quay?: Maybe<Quay>;
  /** The bike rental station related to the place */
  bikeRentalStation?: Maybe<BikeRentalStation>;
  /** The bike parking related to the place */
  bikePark?: Maybe<BikePark>;
  /** The car parking related to the place */
  carPark?: Maybe<CarPark>;
};

export enum VertexType {
  Normal = 'normal',
  Transit = 'transit',
  BikePark = 'bikePark',
  BikeShare = 'bikeShare',
  ParkAndRide = 'parkAndRide'
}

/** List of legs constituting a suggested sequence of rides and links for a specific trip. */
export type TripPattern = {
  /**
   * Time that the trip departs.
   * @deprecated Replaced with expectedStartTime
   */
  startTime?: Maybe<Scalars['DateTime']>;
  /**
   * Time that the trip arrives.
   * @deprecated Replaced with expectedEndTime
   */
  endTime?: Maybe<Scalars['DateTime']>;
  /** The aimed date and time the trip starts. */
  aimedStartTime?: Maybe<Scalars['DateTime']>;
  /** The expected, realtime adjusted date and time the trip starts. */
  expectedStartTime?: Maybe<Scalars['DateTime']>;
  /** The aimed date and time the trip ends. */
  aimedEndTime?: Maybe<Scalars['DateTime']>;
  /** The expected, realtime adjusted date and time the trip ends. */
  expectedEndTime?: Maybe<Scalars['DateTime']>;
  /** Duration of the trip, in seconds. */
  duration?: Maybe<Scalars['Long']>;
  /** This sums the direct durations of each leg. Be careful about using this, as it is not equal to the duration between startTime and endTime. See the directDuration documentation on Leg. */
  directDuration?: Maybe<Scalars['Long']>;
  /** How much time is spent waiting for transit to arrive, in seconds. */
  waitingTime?: Maybe<Scalars['Long']>;
  /** Total distance for the trip, in meters. */
  distance?: Maybe<Scalars['Float']>;
  /** How much time is spent walking, in seconds. */
  walkTime?: Maybe<Scalars['Long']>;
  /** How far the user has to walk, in meters. */
  walkDistance?: Maybe<Scalars['Float']>;
  /** A list of legs. Each leg is either a walking (cycling, car) portion of the trip, or a ride leg on a particular vehicle. So a trip where the use walks to the Q train, transfers to the 6, then walks to their destination, has four legs. */
  legs: Array<Maybe<Leg>>;
  /** Weight of the itinerary. Used for debugging. The result might have been modified after (e.g. by removing short legs) and will notnecessarily exactly represent the tripPattern. It is however the weightthat was the basis for choosing the result in the first place. If the result has been heavily modified, this field will be null. */
  weight?: Maybe<Scalars['Float']>;
};


/** Part of a trip pattern. Either a ride on a public transport vehicle or access or path link to/from/between places */
export type Leg = {
  /**
   * The date and time this leg begins.
   * @deprecated Replaced with expectedStartTime
   */
  startTime?: Maybe<Scalars['DateTime']>;
  /**
   * The date and time this leg ends.
   * @deprecated Replaced with expectedEndTime
   */
  endTime?: Maybe<Scalars['DateTime']>;
  /** The aimed date and time this leg starts. */
  aimedStartTime?: Maybe<Scalars['DateTime']>;
  /** The expected, realtime adjusted date and time this leg starts. */
  expectedStartTime?: Maybe<Scalars['DateTime']>;
  /** The aimed date and time this leg ends. */
  aimedEndTime?: Maybe<Scalars['DateTime']>;
  /** The expected, realtime adjusted date and time this leg ends. */
  expectedEndTime?: Maybe<Scalars['DateTime']>;
  /** The mode of transport or access (e.g., foot) used when traversing this leg. */
  mode?: Maybe<Mode>;
  /** The transport sub mode (e.g., localBus or expressBus) used when traversing this leg. Null if leg is not a ride */
  transportSubmode?: Maybe<TransportSubmode>;
  /** The legs's duration in seconds */
  duration?: Maybe<Scalars['Long']>;
  /** In the case of a flexible journey, this will represent the duration of the best-case scenario, where the vehicle drives directly to the destination for the current passenger. */
  directDuration?: Maybe<Scalars['Long']>;
  /** The legs's geometry. */
  pointsOnLink?: Maybe<PointsOnLink>;
  /** For ride legs, the service authority used for this legs. For non-ride legs, null. */
  authority?: Maybe<Authority>;
  /** For ride legs, the operator used for this legs. For non-ride legs, null. */
  operator?: Maybe<Operator>;
  /**
   * For ride legs, the transit organisation that operates the service used for this legs. For non-ride legs, null.
   * @deprecated Use 'authority' instead.
   */
  organisation?: Maybe<Organisation>;
  /**
   * Whether there is real-time data about this leg
   * @deprecated Should not be camelCase. Use realtime instead.
   */
  realTime?: Maybe<Scalars['Boolean']>;
  /** Whether there is real-time data about this leg */
  realtime?: Maybe<Scalars['Boolean']>;
  /** The distance traveled while traversing the leg in meters. */
  distance?: Maybe<Scalars['Float']>;
  /** Whether this leg is a ride leg or not. */
  ride?: Maybe<Scalars['Boolean']>;
  /** Whether this leg is with a rented bike. */
  rentedBike?: Maybe<Scalars['Boolean']>;
  /** The Place where the leg originates. */
  fromPlace: Place;
  /** The Place where the leg ends. */
  toPlace: Place;
  /** EstimatedCall for the quay where the leg originates. */
  fromEstimatedCall?: Maybe<EstimatedCall>;
  /** EstimatedCall for the quay where the leg ends. */
  toEstimatedCall?: Maybe<EstimatedCall>;
  /** For ride legs, the line. For non-ride legs, null. */
  line?: Maybe<Line>;
  /** For ride legs, the dated service journey if it exist in planned data. If not, null. */
  datedServiceJourney?: Maybe<DatedServiceJourney>;
  /** For ride legs, the service journey. For non-ride legs, null. */
  serviceJourney?: Maybe<ServiceJourney>;
  /** For ride legs, intermediate quays between the Place where the leg originates and the Place where the leg ends. For non-ride legs, empty list. */
  intermediateQuays: Array<Maybe<Quay>>;
  /** For ride legs, estimated calls for quays between the Place where the leg originates and the Place where the leg ends. For non-ride legs, empty list. */
  intermediateEstimatedCalls: Array<Maybe<EstimatedCall>>;
  /** For ride legs, all estimated calls for the service journey. For non-ride legs, empty list. */
  serviceJourneyEstimatedCalls: Array<Maybe<EstimatedCall>>;
  /** Do we continue from a specified via place */
  via?: Maybe<Scalars['Boolean']>;
  /** All relevant situations for this leg */
  situations: Array<Maybe<PtSituationElement>>;
  /** Do we continue from a specified via place */
  steps: Array<Maybe<PathGuidance>>;
  interchangeFrom?: Maybe<Interchange>;
  interchangeTo?: Maybe<Interchange>;
  bookingArrangements?: Maybe<BookingArrangement>;
};

export enum Mode {
  Air = 'air',
  Bicycle = 'bicycle',
  Bus = 'bus',
  Cableway = 'cableway',
  Water = 'water',
  Funicular = 'funicular',
  Lift = 'lift',
  Rail = 'rail',
  Metro = 'metro',
  Tram = 'tram',
  Coach = 'coach',
  /** Any for of public transportation */
  Transit = 'transit',
  Foot = 'foot',
  Car = 'car',
  /** Combine with foot and transit for park and ride. */
  CarPark = 'car_park',
  /** Combine with foot and transit for kiss and ride. */
  CarDropoff = 'car_dropoff',
  /** Combine with foot and transit for ride and kiss. */
  CarPickup = 'car_pickup'
}

export enum TransportSubmode {
  Unknown = 'unknown',
  Undefined = 'undefined',
  InternationalFlight = 'internationalFlight',
  DomesticFlight = 'domesticFlight',
  IntercontinentalFlight = 'intercontinentalFlight',
  DomesticScheduledFlight = 'domesticScheduledFlight',
  ShuttleFlight = 'shuttleFlight',
  IntercontinentalCharterFlight = 'intercontinentalCharterFlight',
  InternationalCharterFlight = 'internationalCharterFlight',
  RoundTripCharterFlight = 'roundTripCharterFlight',
  SightseeingFlight = 'sightseeingFlight',
  HelicopterService = 'helicopterService',
  DomesticCharterFlight = 'domesticCharterFlight',
  SchengenAreaFlight = 'SchengenAreaFlight',
  AirshipService = 'airshipService',
  ShortHaulInternationalFlight = 'shortHaulInternationalFlight',
  CanalBarge = 'canalBarge',
  LocalBus = 'localBus',
  RegionalBus = 'regionalBus',
  ExpressBus = 'expressBus',
  NightBus = 'nightBus',
  PostBus = 'postBus',
  SpecialNeedsBus = 'specialNeedsBus',
  MobilityBus = 'mobilityBus',
  MobilityBusForRegisteredDisabled = 'mobilityBusForRegisteredDisabled',
  SightseeingBus = 'sightseeingBus',
  ShuttleBus = 'shuttleBus',
  HighFrequencyBus = 'highFrequencyBus',
  DedicatedLaneBus = 'dedicatedLaneBus',
  SchoolBus = 'schoolBus',
  SchoolAndPublicServiceBus = 'schoolAndPublicServiceBus',
  RailReplacementBus = 'railReplacementBus',
  DemandAndResponseBus = 'demandAndResponseBus',
  AirportLinkBus = 'airportLinkBus',
  InternationalCoach = 'internationalCoach',
  NationalCoach = 'nationalCoach',
  ShuttleCoach = 'shuttleCoach',
  RegionalCoach = 'regionalCoach',
  SpecialCoach = 'specialCoach',
  SchoolCoach = 'schoolCoach',
  SightseeingCoach = 'sightseeingCoach',
  TouristCoach = 'touristCoach',
  CommuterCoach = 'commuterCoach',
  Funicular = 'funicular',
  StreetCableCar = 'streetCableCar',
  AllFunicularServices = 'allFunicularServices',
  UndefinedFunicular = 'undefinedFunicular',
  Metro = 'metro',
  Tube = 'tube',
  UrbanRailway = 'urbanRailway',
  CityTram = 'cityTram',
  LocalTram = 'localTram',
  RegionalTram = 'regionalTram',
  SightseeingTram = 'sightseeingTram',
  ShuttleTram = 'shuttleTram',
  TrainTram = 'trainTram',
  Telecabin = 'telecabin',
  CableCar = 'cableCar',
  Lift = 'lift',
  ChairLift = 'chairLift',
  DragLift = 'dragLift',
  TelecabinLink = 'telecabinLink',
  Local = 'local',
  HighSpeedRail = 'highSpeedRail',
  SuburbanRailway = 'suburbanRailway',
  RegionalRail = 'regionalRail',
  InterregionalRail = 'interregionalRail',
  LongDistance = 'longDistance',
  International = 'international',
  SleeperRailService = 'sleeperRailService',
  NightRail = 'nightRail',
  CarTransportRailService = 'carTransportRailService',
  TouristRailway = 'touristRailway',
  AirportLinkRail = 'airportLinkRail',
  RailShuttle = 'railShuttle',
  ReplacementRailService = 'replacementRailService',
  SpecialTrain = 'specialTrain',
  CrossCountryRail = 'crossCountryRail',
  RackAndPinionRailway = 'rackAndPinionRailway',
  InternationalCarFerry = 'internationalCarFerry',
  NationalCarFerry = 'nationalCarFerry',
  RegionalCarFerry = 'regionalCarFerry',
  LocalCarFerry = 'localCarFerry',
  InternationalPassengerFerry = 'internationalPassengerFerry',
  NationalPassengerFerry = 'nationalPassengerFerry',
  RegionalPassengerFerry = 'regionalPassengerFerry',
  LocalPassengerFerry = 'localPassengerFerry',
  PostBoat = 'postBoat',
  TrainFerry = 'trainFerry',
  RoadFerryLink = 'roadFerryLink',
  AirportBoatLink = 'airportBoatLink',
  HighSpeedVehicleService = 'highSpeedVehicleService',
  HighSpeedPassengerService = 'highSpeedPassengerService',
  SightseeingService = 'sightseeingService',
  SchoolBoat = 'schoolBoat',
  CableFerry = 'cableFerry',
  RiverBus = 'riverBus',
  ScheduledFerry = 'scheduledFerry',
  ShuttleFerryService = 'shuttleFerryService',
  CommunalTaxi = 'communalTaxi',
  CharterTaxi = 'charterTaxi',
  WaterTaxi = 'waterTaxi',
  RailTaxi = 'railTaxi',
  BikeTaxi = 'bikeTaxi',
  BlackCab = 'blackCab',
  MiniCab = 'miniCab',
  AllTaxiServices = 'allTaxiServices',
  HireCar = 'hireCar',
  HireVan = 'hireVan',
  HireMotorbike = 'hireMotorbike',
  HireCycle = 'hireCycle',
  AllHireVehicles = 'allHireVehicles'
}

/** A list of coordinates encoded as a polyline string (see http://code.google.com/apis/maps/documentation/polylinealgorithm.html) */
export type PointsOnLink = {
  /** The number of points in the string */
  length?: Maybe<Scalars['Int']>;
  /** The encoded points of the polyline. Be aware that the string could contain escape characters that need to be accounted for. (https://www.freeformatter.com/javascript-escape.html) */
  points?: Maybe<Scalars['String']>;
};

/** A series of turn by turn instructions used for walking, biking and driving. */
export type PathGuidance = {
  /** The distance in meters that this step takes. */
  distance?: Maybe<Scalars['Float']>;
  /** The relative direction of this step. */
  relativeDirection?: Maybe<RelativeDirection>;
  /** The name of the street. */
  streetName?: Maybe<Scalars['String']>;
  /** The absolute direction of this step. */
  heading?: Maybe<AbsoluteDirection>;
  /** When exiting a highway or traffic circle, the exit name/number. */
  exit?: Maybe<Scalars['String']>;
  /** Indicates whether or not a street changes direction at an intersection. */
  stayOn?: Maybe<Scalars['Boolean']>;
  /** This step is on an open area, such as a plaza or train platform, and thus the directions should say something like "cross" */
  area?: Maybe<Scalars['Boolean']>;
  /** The name of this street was generated by the system, so we should only display it once, and generally just display right/left directions */
  bogusName?: Maybe<Scalars['Boolean']>;
  /** The latitude of the step. */
  latitude?: Maybe<Scalars['Float']>;
  /** The longitude of the step. */
  longitude?: Maybe<Scalars['Float']>;
  /** Direction information as readable text. */
  legStepText?: Maybe<Scalars['String']>;
};


/** A series of turn by turn instructions used for walking, biking and driving. */
export type PathGuidanceLegStepTextArgs = {
  locale?: Maybe<Locale>;
};

export enum RelativeDirection {
  Depart = 'depart',
  HardLeft = 'hardLeft',
  Left = 'left',
  SlightlyLeft = 'slightlyLeft',
  Continue = 'continue',
  SlightlyRight = 'slightlyRight',
  Right = 'right',
  HardRight = 'hardRight',
  CircleClockwise = 'circleClockwise',
  CircleCounterclockwise = 'circleCounterclockwise',
  Elevator = 'elevator',
  UturnLeft = 'uturnLeft',
  UturnRight = 'uturnRight'
}

export enum AbsoluteDirection {
  North = 'north',
  Northeast = 'northeast',
  East = 'east',
  Southeast = 'southeast',
  South = 'south',
  Southwest = 'southwest',
  West = 'west',
  Northwest = 'northwest'
}

export enum Locale {
  No = 'no',
  Us = 'us'
}

export type Interchange = {
  /** The Line/Route/ServiceJourney changes, but the passenger can stay seated. */
  staySeated?: Maybe<Scalars['Boolean']>;
  /** The interchange is guaranteed by the operator(s). Usually up to a maximum wait time. */
  guaranteed?: Maybe<Scalars['Boolean']>;
  FromLine?: Maybe<Line>;
  ToLine?: Maybe<Line>;
  FromServiceJourney?: Maybe<ServiceJourney>;
  ToServiceJourney?: Maybe<ServiceJourney>;
};

export type BookingArrangement = {
  /** Who has access to book service? */
  bookingAccess?: Maybe<BookingAccess>;
  /** How should service be booked? */
  bookingMethods?: Maybe<Array<Maybe<BookingMethod>>>;
  /** When should service be booked? */
  bookWhen?: Maybe<PurchaseWhen>;
  /** Latest time service can be booked. ISO 8601 timestamp */
  latestBookingTime?: Maybe<Scalars['LocalTime']>;
  /** Minimum period in advance service can be booked as a ISO 8601 duration */
  minimumBookingPeriod?: Maybe<Scalars['String']>;
  /** Textual description of booking arrangement for service */
  bookingNote?: Maybe<Scalars['String']>;
  /** When should ticket be purchased? */
  buyWhen?: Maybe<Array<Maybe<PurchaseMoment>>>;
  /** Who should ticket be contacted for booking */
  bookingContact?: Maybe<Contact>;
};

export enum BookingAccess {
  PublicAccess = 'publicAccess',
  AuthorisedPublic = 'authorisedPublic',
  Staff = 'staff',
  Other = 'other'
}

export enum BookingMethod {
  CallDriver = 'callDriver',
  CallOffice = 'callOffice',
  Online = 'online',
  Other = 'other',
  PhoneAtStop = 'phoneAtStop',
  Text = 'text',
  None = 'none'
}

export enum PurchaseWhen {
  AdvanceOnly = 'advanceOnly',
  UntilPreviousDay = 'untilPreviousDay',
  DayOfTravelOnly = 'dayOfTravelOnly',
  AdvanceAndDayOfTravel = 'advanceAndDayOfTravel',
  TimeOfTravelOnly = 'timeOfTravelOnly',
  SubscriptionChargeMoment = 'subscriptionChargeMoment',
  Other = 'other'
}


export enum PurchaseMoment {
  OnReservation = 'onReservation',
  InAdvance = 'inAdvance',
  InAdvanceOnly = 'inAdvanceOnly',
  BeforeBoarding = 'beforeBoarding',
  BeforeBoardingOnly = 'beforeBoardingOnly',
  OnBoarding = 'onBoarding',
  OnBoardingOnly = 'onBoardingOnly',
  AfterBoarding = 'afterBoarding',
  OnCheckIn = 'onCheckIn',
  OnCheckOut = 'onCheckOut',
  SubscriptionOnly = 'subscriptionOnly',
  Other = 'other'
}

export type Contact = {
  /** Name of person to contact */
  contactPerson?: Maybe<Scalars['String']>;
  /** Email adress for contact */
  email?: Maybe<Scalars['String']>;
  /** Url for contact */
  url?: Maybe<Scalars['String']>;
  /** Phone number for contact */
  phone?: Maybe<Scalars['String']>;
  /** Textual description of how to get in contact */
  furtherDetails?: Maybe<Scalars['String']>;
};

export type DebugOutput = {
  totalTime?: Maybe<Scalars['Long']>;
};

/** Input format for specifying a location through either a place reference (id), coordinates or both. If both place and coordinates are provided the place ref will be used if found, coordinates will only be used if place is not known. */
export type Location = {
  /** The name of the location. */
  name?: Maybe<Scalars['String']>;
  /** Id for the place. */
  place?: Maybe<Scalars['String']>;
  /** Coordinates for the location */
  coordinates?: Maybe<InputCoordinates>;
};

/** Input type for coordinates in the WGS84 system */
export type InputCoordinates = {
  /** The latitude of the place. */
  latitude: Scalars['Float'];
  /** The longitude of the place. */
  longitude: Scalars['Float'];
};

export enum OptimisationMethod {
  Quick = 'quick',
  Safe = 'safe',
  Flat = 'flat',
  Greenways = 'greenways',
  Triangle = 'triangle',
  Transfers = 'transfers'
}

/** Preferences for trip search. */
export type InputPreferred = {
  /** Set of ids of lines preferred by user. */
  lines?: Maybe<Array<Maybe<Scalars['String']>>>;
  /** Set of ids of authorities preferred by user. */
  authorities?: Maybe<Array<Maybe<Scalars['String']>>>;
  /** Deprecated! Use 'authorities' instead. */
  organisations?: Maybe<Array<Maybe<Scalars['String']>>>;
  /** Penalty added for using a line that is not preferred if user has set any line as preferred. In number of seconds that user is willing to wait for preferred line. */
  otherThanPreferredLinesPenalty?: Maybe<Scalars['Int']>;
};

/** Negative preferences for trip search. Unpreferred elements may still be used in suggested trips if alternatives are not desirable, see InputBanned for hard limitations. */
export type InputUnpreferred = {
  /** Set of ids of lines user prefers not to use. */
  lines?: Maybe<Array<Maybe<Scalars['String']>>>;
  /** Set of ids of authorities user prefers not to use. */
  authorities?: Maybe<Array<Maybe<Scalars['String']>>>;
  /** Deprecated! Use 'authorities' instead. */
  organisations?: Maybe<Array<Maybe<Scalars['String']>>>;
};

/** Filter trips by disallowing trip patterns involving certain elements */
export type InputBanned = {
  /** Set of ids for lines that should not be used */
  lines?: Maybe<Array<Maybe<Scalars['String']>>>;
  /** Set of ids for authorities that should not be used */
  authorities?: Maybe<Array<Maybe<Scalars['String']>>>;
  /** Deprecated! Use 'authorities' instead. */
  organisations?: Maybe<Array<Maybe<Scalars['String']>>>;
  /** Set of ids of quays that should not be allowed for boarding or alighting. Trip patterns that travel through the quay will still be permitted. */
  quays?: Maybe<Array<Maybe<Scalars['String']>>>;
  /** Set of ids of quays that should not be allowed for boarding, alighting or traveling thorugh. */
  quaysHard?: Maybe<Array<Maybe<Scalars['String']>>>;
  /** Set of ids of service journeys that should not be used. */
  serviceJourneys?: Maybe<Array<Maybe<Scalars['String']>>>;
};

/** Filter trips by only allowing trip patterns involving certain elements. If both lines and authorities are specificed, only one must be valid for each trip to be used. */
export type InputWhiteListed = {
  /** Set of ids for lines that should be used */
  lines?: Maybe<Array<Maybe<Scalars['String']>>>;
  /** Set of ids for authorities that should be used */
  authorities?: Maybe<Array<Maybe<Scalars['String']>>>;
  /** Deprecated! Use 'authorities' instead. */
  organisations?: Maybe<Array<Maybe<Scalars['String']>>>;
};

/** Filter trips by allowing only certain transport submodes per mode. */
export type TransportSubmodeFilter = {
  /** Set of ids for lines that should be used */
  transportMode: TransportMode;
  /** Set of transport submodes allowed for transport mode. */
  transportSubmodes: Array<Maybe<TransportSubmode>>;
};

export enum TransportMode {
  Air = 'air',
  Bus = 'bus',
  Cableway = 'cableway',
  Water = 'water',
  Funicular = 'funicular',
  Lift = 'lift',
  Rail = 'rail',
  Metro = 'metro',
  Tram = 'tram',
  Coach = 'coach',
  Unknown = 'unknown'
}

/** Named place where public transport may be accessed. May be a building complex (e.g. a station) or an on-street location. */
export type StopPlace = PlaceInterface & {
  id: Scalars['ID'];
  name: Scalars['String'];
  latitude?: Maybe<Scalars['Float']>;
  longitude?: Maybe<Scalars['Float']>;
  description?: Maybe<Scalars['String']>;
  /** Whether this stop place is suitable for wheelchair boarding. */
  wheelchairBoarding?: Maybe<WheelchairBoarding>;
  /** Relative weighting of this stop with regards to interchanges. */
  weighting?: Maybe<InterchangeWeighting>;
  tariffZones: Array<Maybe<TariffZone>>;
  /** The transport mode serviced by this stop place. */
  transportMode?: Maybe<TransportMode>;
  /** The transport submode serviced by this stop place. */
  transportSubmode?: Maybe<TransportSubmode>;
  /** This stop place's adjacent sites */
  adjacentSites?: Maybe<Array<Maybe<Scalars['String']>>>;
  timezone: Scalars['String'];
  /** Returns all quays that are children of this stop place */
  quays?: Maybe<Array<Maybe<Quay>>>;
  /** Returns parent stop for this stop */
  parent?: Maybe<StopPlace>;
  /** List of visits to this stop place as part of vehicle journeys. */
  estimatedCalls: Array<Maybe<EstimatedCall>>;
};


/** Named place where public transport may be accessed. May be a building complex (e.g. a station) or an on-street location. */
export type StopPlaceQuaysArgs = {
  filterByInUse?: Maybe<Scalars['Boolean']>;
};


/** Named place where public transport may be accessed. May be a building complex (e.g. a station) or an on-street location. */
export type StopPlaceEstimatedCallsArgs = {
  startTime?: Maybe<Scalars['DateTime']>;
  timeRange?: Maybe<Scalars['Int']>;
  numberOfDepartures?: Maybe<Scalars['Int']>;
  numberOfDeparturesPerLineAndDestinationDisplay?: Maybe<Scalars['Int']>;
  omitNonBoarding?: Maybe<Scalars['Boolean']>;
  includeCancelledTrips?: Maybe<Scalars['Boolean']>;
  whiteListed?: Maybe<InputWhiteListed>;
  whiteListedModes?: Maybe<Array<Maybe<Mode>>>;
};

export enum WheelchairBoarding {
  /** There is no accessibility information for the stopPlace/quay. */
  NoInformation = 'noInformation',
  /** Boarding wheelchair-accessible serviceJourneys is possible at this stopPlace/quay. */
  Possible = 'possible',
  /** Wheelchair boarding/alighting is not possible at this stop. */
  NotPossible = 'notPossible'
}

export enum InterchangeWeighting {
  /** Highest priority interchange. */
  PreferredInterchange = 'preferredInterchange',
  /** Second highest priority interchange. */
  RecommendedInterchange = 'recommendedInterchange',
  /** Third highest priority interchange. */
  InterchangeAllowed = 'interchangeAllowed',
  /** Interchange not allowed. */
  NoInterchange = 'noInterchange'
}

export type TariffZone = {
  id?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
};

/** Interface for places, i.e. quays, stop places, parks */
export type PlaceInterface = {
  id: Scalars['ID'];
  latitude?: Maybe<Scalars['Float']>;
  longitude?: Maybe<Scalars['Float']>;
};

export enum MultiModalMode {
  /** Multi modal parent stop places without their mono modal children. */
  Parent = 'parent',
  /** Only mono modal children stop places, not their multi modal parent stop */
  Child = 'child',
  /** Both multiModal parents and their mono modal child stop places. */
  All = 'all'
}

/** A place such as platform, stance, or quayside where passengers have access to PT vehicles. */
export type Quay = PlaceInterface & {
  id: Scalars['ID'];
  name: Scalars['String'];
  latitude?: Maybe<Scalars['Float']>;
  longitude?: Maybe<Scalars['Float']>;
  description?: Maybe<Scalars['String']>;
  /** The stop place to which this quay belongs to. */
  stopPlace?: Maybe<StopPlace>;
  /** Whether this quay is suitable for wheelchair boarding. */
  wheelchairAccessible?: Maybe<WheelchairBoarding>;
  timezone: Scalars['String'];
  /** Public code used to identify this quay within the stop place. For instance a platform code. */
  publicCode?: Maybe<Scalars['String']>;
  /** List of lines servicing this quay */
  lines: Array<Line>;
  /** List of journey patterns servicing this quay */
  journeyPatterns: Array<Maybe<JourneyPattern>>;
  /** List of visits to this quay as part of vehicle journeys. */
  estimatedCalls: Array<Maybe<EstimatedCall>>;
  /** Get all situations active for the quay */
  situations: Array<Maybe<PtSituationElement>>;
  stopType?: Maybe<StopType>;
  /** Geometry for flexible area. */
  flexibleArea?: Maybe<Scalars['Coordinates']>;
};


/** A place such as platform, stance, or quayside where passengers have access to PT vehicles. */
export type QuayEstimatedCallsArgs = {
  startTime?: Maybe<Scalars['DateTime']>;
  timeRange?: Maybe<Scalars['Int']>;
  numberOfDepartures?: Maybe<Scalars['Int']>;
  numberOfDeparturesPerLineAndDestinationDisplay?: Maybe<Scalars['Int']>;
  omitNonBoarding?: Maybe<Scalars['Boolean']>;
  includeCancelledTrips?: Maybe<Scalars['Boolean']>;
  whiteListed?: Maybe<InputWhiteListed>;
  whiteListedModes?: Maybe<Array<Maybe<Mode>>>;
};

/** Simple public transport situation element */
export type PtSituationElement = {
  id: Scalars['ID'];
  /** Get affected authority for this situation element */
  authority?: Maybe<Authority>;
  /** @deprecated Use 'authority' instead. */
  organisation?: Maybe<Organisation>;
  lines: Array<Maybe<Line>>;
  serviceJourneys: Array<Maybe<ServiceJourney>>;
  datedServiceJourneys: Array<Maybe<DatedServiceJourney>>;
  quays: Array<Maybe<Quay>>;
  stopPlaces: Array<Maybe<StopPlace>>;
  /** Get all journey patterns for this situation element */
  journeyPatterns: Array<Maybe<JourneyPattern>>;
  /** Summary of situation in all different translations available */
  summary: Array<MultilingualString>;
  /** Description of situation in all different translations available */
  description: Array<MultilingualString>;
  /**
   * Details of situation in all different translations available
   * @deprecated Not allowed according to profile. Use ´advice´ instead.
   */
  detail: Array<MultilingualString>;
  /** Advice of situation in all different translations available */
  advice: Array<MultilingualString>;
  /**
   * Url with more information
   * @deprecated Use the attribute infoLinks instead.
   */
  infoLink?: Maybe<Scalars['String']>;
  /** Optional links to more information. */
  infoLinks?: Maybe<Array<Maybe<InfoLink>>>;
  /** Period this situation is in effect */
  validityPeriod?: Maybe<ValidityPeriod>;
  /** ReportType of this situation */
  reportType?: Maybe<ReportType>;
  /**
   * StopConditions of this situation
   * @deprecated Temporary attribute used for data-verification.
   */
  stopConditions: Array<Maybe<StopCondition>>;
  /** Operator's internal id for this situation */
  situationNumber?: Maybe<Scalars['String']>;
  /** Severity of this situation  */
  severity?: Maybe<Severity>;
  /**
   * Authority that reported this situation
   * @deprecated Not yet officially supported. May be removed or renamed.
   */
  reportAuthority?: Maybe<Authority>;
  /** Priority-level of this situation, 1 is highest priority, 0 means unknown. */
  priority?: Maybe<Scalars['Int']>;
};

/** Text with language */
export type MultilingualString = {
  value?: Maybe<Scalars['String']>;
  language?: Maybe<Scalars['String']>;
};

export type InfoLink = {
  /** URI */
  uri?: Maybe<Scalars['String']>;
  /** Label */
  label?: Maybe<Scalars['String']>;
};

export type ValidityPeriod = {
  /** Start of validity period */
  startTime?: Maybe<Scalars['DateTime']>;
  /** End of validity period */
  endTime?: Maybe<Scalars['DateTime']>;
};

export enum ReportType {
  /** Indicates a general info-message that should not affect trip. */
  General = 'general',
  /** Indicates an incident that may affect trip. */
  Incident = 'incident'
}

export enum StopCondition {
  /** Situation applies when stop is the destination of the leg. */
  Destination = 'destination',
  /** Situation applies when stop is the startpoint of the leg. */
  StartPoint = 'startPoint',
  /** Situation applies when transfering to another leg at the stop. */
  ExceptionalStop = 'exceptionalStop',
  /** Situation applies when passing the stop, without stopping. */
  NotStopping = 'notStopping',
  /** Situation applies when at the stop, and the stop requires a request to stop. */
  RequestStop = 'requestStop'
}

export enum Severity {
  /** Situation has unknown impact on trips. */
  Unknown = 'unknown',
  /** Situation has no impact on trips. */
  NoImpact = 'noImpact',
  /** Situation has a very slight impact on trips. */
  VerySlight = 'verySlight',
  /** Situation has a slight impact on trips. */
  Slight = 'slight',
  /** Situation has an impact on trips (default). */
  Normal = 'normal',
  /** Situation has a severe impact on trips. */
  Severe = 'severe',
  /** Situation has a very severe impact on trips. */
  VerySevere = 'verySevere',
  /** Severity is undefined. */
  Undefined = 'undefined'
}

export enum StopType {
  Regular = 'regular',
  FlexibleArea = 'flexible_area'
}


/** A connection to a list of items. */
export type QuayAtDistanceConnection = {
  /** a list of edges */
  edges?: Maybe<Array<Maybe<QuayAtDistanceEdge>>>;
  /** details about this specific page */
  pageInfo: PageInfo;
};

/** An edge in a connection */
export type QuayAtDistanceEdge = {
  /** The item at the end of the edge */
  node?: Maybe<QuayAtDistance>;
  /** cursor marks a unique position or index into the connection */
  cursor: Scalars['String'];
};

export type QuayAtDistance = {
  id: Scalars['ID'];
  quay?: Maybe<Quay>;
  distance?: Maybe<Scalars['Int']>;
};

/** Information about pagination in a connection. */
export type PageInfo = {
  /** When paginating forwards, are there more items? */
  hasNextPage: Scalars['Boolean'];
  /** When paginating backwards, are there more items? */
  hasPreviousPage: Scalars['Boolean'];
  /** When paginating backwards, the cursor to continue. */
  startCursor?: Maybe<Scalars['String']>;
  /** When paginating forwards, the cursor to continue. */
  endCursor?: Maybe<Scalars['String']>;
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
  /** The item at the end of the edge */
  node?: Maybe<PlaceAtDistance>;
  /** cursor marks a unique position or index into the connection */
  cursor: Scalars['String'];
};

export type PlaceAtDistance = {
  /** @deprecated Id is not referable or meaningful and will be removed */
  id: Scalars['ID'];
  place?: Maybe<PlaceInterface>;
  distance?: Maybe<Scalars['Int']>;
};

export enum FilterPlaceType {
  /** Quay */
  Quay = 'quay',
  /** StopPlace */
  StopPlace = 'stopPlace',
  /** Bicycle rent stations */
  BicycleRent = 'bicycleRent',
  /** Bike parks */
  BikePark = 'bikePark',
  /** Car parks */
  CarPark = 'carPark'
}

export type InputFilters = {
  /** Quays to include by id. */
  quays?: Maybe<Array<Maybe<Scalars['String']>>>;
  /** Lines to include by id. */
  lines?: Maybe<Array<Maybe<Scalars['String']>>>;
  /** Bike rentals to include by id. */
  bikeRentalStations?: Maybe<Array<Maybe<Scalars['String']>>>;
  /** Bike parks to include by id. */
  bikeParks?: Maybe<Array<Maybe<Scalars['String']>>>;
  /** Car parks to include by id. */
  carParks?: Maybe<Array<Maybe<Scalars['String']>>>;
};

/** Authority involved in public transportation. An organisation under which the responsibility of organising the transport service in a certain area is placed. */
export type Authority = {
  /** Authority id */
  id: Scalars['ID'];
  name: Scalars['String'];
  url?: Maybe<Scalars['String']>;
  timezone: Scalars['String'];
  lang?: Maybe<Scalars['String']>;
  phone?: Maybe<Scalars['String']>;
  fareUrl?: Maybe<Scalars['String']>;
  lines: Array<Maybe<Line>>;
  /** Get all situations active for the authority */
  situations: Array<Maybe<PtSituationElement>>;
};

/** A group of routes which is generally known to the public by a similar name or number */
export type Line = {
  id: Scalars['ID'];
  authority?: Maybe<Authority>;
  operator?: Maybe<Operator>;
  /** @deprecated Use 'authority' instead. */
  organisation?: Maybe<Organisation>;
  /** Publicly announced code for line, differentiating it from other lines for the same operator. */
  publicCode?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  transportMode?: Maybe<TransportMode>;
  transportSubmode?: Maybe<TransportSubmode>;
  description?: Maybe<Scalars['String']>;
  url?: Maybe<Scalars['String']>;
  presentation?: Maybe<Presentation>;
  bikesAllowed?: Maybe<BikesAllowed>;
  journeyPatterns?: Maybe<Array<Maybe<JourneyPattern>>>;
  quays: Array<Maybe<Quay>>;
  serviceJourneys: Array<Maybe<ServiceJourney>>;
  notices: Array<Maybe<Notice>>;
  /** Get all situations active for the line */
  situations: Array<Maybe<PtSituationElement>>;
  /** List of keyValue pairs for the line. */
  keyValues?: Maybe<Array<Maybe<KeyValue>>>;
  /** Type of flexible line, or null if line is not flexible. */
  flexibleLineType?: Maybe<FlexibleLineType>;
  /** Booking arrangements for flexible line. */
  bookingArrangements?: Maybe<BookingArrangement>;
};

/** Types describing common presentation properties */
export type Presentation = {
  colour?: Maybe<Scalars['String']>;
  textColour?: Maybe<Scalars['String']>;
};

export enum BikesAllowed {
  /** There is no bike information for the trip. */
  NoInformation = 'noInformation',
  /** The vehicle being used on this particular trip can accommodate at least one bicycle. */
  Allowed = 'allowed',
  /** No bicycles are allowed on this trip. */
  NotAllowed = 'notAllowed'
}

export type JourneyPattern = {
  id: Scalars['ID'];
  line: Line;
  directionType?: Maybe<DirectionType>;
  name?: Maybe<Scalars['String']>;
  /** @deprecated Get destinationDisplay from estimatedCall or timetabledPassingTime instead. DestinationDisplay from JourneyPattern is not correct according to model, will give misleading results in some cases and will be removed! (This is because a DestinationDisplay can change in the middle of a JourneyPattern.) */
  destinationDisplay?: Maybe<DestinationDisplay>;
  serviceJourneys: Array<ServiceJourney>;
  /** List of service journeys for the journey pattern for a given date */
  serviceJourneysForDate: Array<ServiceJourney>;
  /** Quays visited by service journeys for this journey patterns */
  quays: Array<Quay>;
  pointsOnLink?: Maybe<PointsOnLink>;
  /** Get all situations active for the journey pattern */
  situations: Array<Maybe<PtSituationElement>>;
  notices: Array<Maybe<Notice>>;
};


export type JourneyPatternServiceJourneysForDateArgs = {
  date?: Maybe<Scalars['Date']>;
};

export enum DirectionType {
  Unknown = 'unknown',
  Outbound = 'outbound',
  Inbound = 'inbound',
  Clockwise = 'clockwise',
  Anticlockwise = 'anticlockwise'
}

/** An advertised destination of a specific journey pattern, usually displayed on a head sign or at other on-board locations. */
export type DestinationDisplay = {
  /** Name of destination to show on front of vehicle. */
  frontText?: Maybe<Scalars['String']>;
};

/** A planned vehicle journey with passengers. */
export type ServiceJourney = {
  id: Scalars['ID'];
  line: Line;
  /** Return a list of operating/service days a ServiceJourney run on. Cancellation/replaced alterations is not included. */
  activeDates: Array<Maybe<Scalars['Date']>>;
  /**
   * For a Whether journey is as planned, a cancellation, an extra journey or replaced.
   * @deprecated The service-alteration might be different for each service day, so this method is not always giving the correct result. This method will return 'null' if there is a mix of different alterations.
   */
  serviceAlteration?: Maybe<ServiceAlteration>;
  /** The transport submode of the journey, if different from lines transport submode. */
  transportSubmode?: Maybe<TransportSubmode>;
  /** Publicly announced code for service journey, differentiating it from other service journeys for the same line. */
  publicCode?: Maybe<Scalars['String']>;
  /** For internal use by operators. */
  privateCode?: Maybe<Scalars['String']>;
  /**
   * Publicly announced code for line, differentiating it from other lines for the same operator.
   * @deprecated Use line.publicCode instead.
   */
  linePublicCode?: Maybe<Scalars['String']>;
  operator?: Maybe<Operator>;
  directionType?: Maybe<DirectionType>;
  /** Whether service journey is accessible with wheelchair. */
  wheelchairAccessible?: Maybe<WheelchairBoarding>;
  /** Whether bikes are allowed on service journey. */
  bikesAllowed?: Maybe<BikesAllowed>;
  journeyPattern?: Maybe<JourneyPattern>;
  /** Quays visited by service journey */
  quays: Array<Quay>;
  /** Returns scheduled passing times only - without realtime-updates, for realtime-data use 'estimatedCalls' */
  passingTimes: Array<Maybe<TimetabledPassingTime>>;
  /** Returns scheduled passingTimes for this ServiceJourney for a given date, updated with realtime-updates (if available). NB! This takes a date as argument (default=today) and returns estimatedCalls for that date and should only be used if the date is known when creating the request. For fetching estimatedCalls for a given trip.leg, use leg.serviceJourneyEstimatedCalls instead. */
  estimatedCalls?: Maybe<Array<Maybe<EstimatedCall>>>;
  /** Detailed path travelled by service journey. */
  pointsOnLink?: Maybe<PointsOnLink>;
  notices: Array<Maybe<Notice>>;
  /** Get all situations active for the service journey */
  situations: Array<Maybe<PtSituationElement>>;
  /** List of keyValue pairs for the service journey. */
  keyValues?: Maybe<Array<Maybe<KeyValue>>>;
  /** Type of flexible service, or null if service is not flexible. */
  flexibleServiceType?: Maybe<FlexibleServiceType>;
  /** Booking arrangements for flexible services. */
  bookingArrangements?: Maybe<BookingArrangement>;
  /** When a trip is added using realtime-data, this is a reference to the replaced ServiceJourney. */
  replacementForServiceJourneyId?: Maybe<Scalars['String']>;
};


/** A planned vehicle journey with passengers. */
export type ServiceJourneyEstimatedCallsArgs = {
  date?: Maybe<Scalars['Date']>;
};


export enum ServiceAlteration {
  Planned = 'planned',
  Cancellation = 'cancellation',
  ExtraJourney = 'extraJourney',
  Replaced = 'replaced'
}

/** Scheduled passing times. These are not affected by real time updates. */
export type TimetabledPassingTime = {
  quay?: Maybe<Quay>;
  /** Scheduled time of arrival at quay */
  arrival?: Maybe<TimeAndDayOffset>;
  /** Scheduled time of departure from quay */
  departure?: Maybe<TimeAndDayOffset>;
  /** Whether this is a timing point or not. Boarding and alighting is not allowed at timing points. */
  timingPoint?: Maybe<Scalars['Boolean']>;
  /** Whether vehicle may be boarded at quay. */
  forBoarding?: Maybe<Scalars['Boolean']>;
  /** Whether vehicle may be alighted at quay. */
  forAlighting?: Maybe<Scalars['Boolean']>;
  /** Whether vehicle will only stop on request. */
  requestStop?: Maybe<Scalars['Boolean']>;
  serviceJourney?: Maybe<ServiceJourney>;
  destinationDisplay?: Maybe<DestinationDisplay>;
  notices: Array<Maybe<Notice>>;
  /** Booking arrangements for flexible service. */
  bookingArrangements?: Maybe<BookingArrangement>;
};

export type TimeAndDayOffset = {
  /** Local time */
  time?: Maybe<Scalars['Time']>;
  /** Number of days offset from base line time */
  dayOffset?: Maybe<Scalars['Int']>;
};


export type Notice = {
  id?: Maybe<Scalars['String']>;
  text?: Maybe<Scalars['String']>;
  publicCode?: Maybe<Scalars['String']>;
};

/** List of visits to quays as part of vehicle journeys. Updated with real time information where available */
export type EstimatedCall = {
  quay?: Maybe<Quay>;
  /** Scheduled time of arrival at quay. Not affected by read time updated */
  aimedArrivalTime?: Maybe<Scalars['DateTime']>;
  /** Expected time of arrival at quay. Updated with real time information if available. */
  expectedArrivalTime?: Maybe<Scalars['DateTime']>;
  /** Actual time of arrival at quay. Updated from real time information if available */
  actualArrivalTime?: Maybe<Scalars['DateTime']>;
  /** Scheduled time of departure from quay. Not affected by read time updated */
  aimedDepartureTime?: Maybe<Scalars['DateTime']>;
  /** Expected time of departure from quay. Updated with real time information if available. */
  expectedDepartureTime?: Maybe<Scalars['DateTime']>;
  /** Actual time of departure from quay. Updated with real time information if available */
  actualDepartureTime?: Maybe<Scalars['DateTime']>;
  /**
   * Scheduled time of arrival at quay. Not affected by read time updated
   * @deprecated Use aimedArrivalTime
   */
  aimedArrival?: Maybe<TimeAndDayOffset>;
  /**
   * Expected time of arrival at quay. Updated with real time information if available
   * @deprecated Use expectedArrivalTime
   */
  expectedArrival?: Maybe<TimeAndDayOffset>;
  /**
   * Scheduled time of departure from quay. Not affected by read time updated
   * @deprecated Use aimedDepartureTime
   */
  aimedDeparture?: Maybe<TimeAndDayOffset>;
  /**
   * Expected time of departure from quay. Updated with real time information if available
   * @deprecated Use expectedDepartureTime
   */
  expectedDeparture?: Maybe<TimeAndDayOffset>;
  /** Whether this is a timing point or not. Boarding and alighting is not allowed at timing points. */
  timingPoint?: Maybe<Scalars['Boolean']>;
  /** Whether this call has been updated with real time information. */
  realtime?: Maybe<Scalars['Boolean']>;
  /** Whether the updated estimates are expected to be inaccurate. */
  predictionInaccurate?: Maybe<Scalars['Boolean']>;
  realtimeState?: Maybe<RealtimeState>;
  /**
   * OccupancyStatus.
   * @deprecated Not yet officially supported.
   */
  occupancyStatus?: Maybe<Occupancy>;
  /** Whether vehicle may be boarded at quay. */
  forBoarding?: Maybe<Scalars['Boolean']>;
  /** Whether vehicle may be alighted at quay. */
  forAlighting?: Maybe<Scalars['Boolean']>;
  /** Whether vehicle will only stop on request. */
  requestStop?: Maybe<Scalars['Boolean']>;
  /** Whether stop is cancellation. */
  cancellation?: Maybe<Scalars['Boolean']>;
  /** The date the estimated call is valid for. */
  date?: Maybe<Scalars['Date']>;
  serviceJourney?: Maybe<ServiceJourney>;
  destinationDisplay?: Maybe<DestinationDisplay>;
  notices: Array<Maybe<Notice>>;
  /** Get all relevant situations for this EstimatedCall. */
  situations: Array<Maybe<PtSituationElement>>;
  /** Booking arrangements for flexible service. */
  bookingArrangements?: Maybe<BookingArrangement>;
  /** Whether this call is part of a flexible trip. This means that arrival or departure times are not scheduled but estimated within specified operating hours. */
  flexible?: Maybe<Scalars['Boolean']>;
  /**
   * Server name - for debugging only!
   * @deprecated For debugging only
   */
  hostname?: Maybe<Scalars['String']>;
};

export enum RealtimeState {
  /** The service journey information comes from the regular time table, i.e. no real-time update has been applied. */
  Scheduled = 'scheduled',
  /** The service journey information has been updated, but the journey pattern stayed the same as the journey pattern of the scheduled service journey. */
  Updated = 'updated',
  /** The service journey has been canceled by a real-time update. */
  Canceled = 'canceled',
  /** The service journey has been added using a real-time update, i.e. the service journey was not present in the regular time table. */
  Added = 'Added',
  /** The service journey information has been updated and resulted in a different journey pattern compared to the journey pattern of the scheduled service journey. */
  Modified = 'modified'
}

export enum Occupancy {
  /** The Occupancy is unknown. DEFAULT. */
  Unknown = 'unknown',
  /** The vehicle is considered empty by most measures, and has few or no passengers onboard, but is still accepting passengers. */
  Empty = 'empty',
  /** The vehicle has a large percentage of seats available. What percentage of free seats out of the total seats available is to be considered large enough to fall into this category is determined at the discretion of the producer. */
  ManySeatsAvailable = 'manySeatsAvailable',
  /** The vehicle has a small percentage of seats available. What percentage of free seats out of the total seats available is to be considered small enough to fall into this category is determined at the discretion of the producer. */
  FewSeatsAvailable = 'fewSeatsAvailable',
  /** The vehicle can currently accommodate only standing passengers. */
  StandingRoomOnly = 'standingRoomOnly',
  /** The vehicle can currently accommodate only standing passengers and has limited space for them. */
  CrushedStandingRoomOnly = 'crushedStandingRoomOnly',
  /** The vehicle is considered full by most measures, but may still be allowing passengers to board. */
  Full = 'full',
  /** The vehicle can not accept passengers. */
  NotAcceptingPassengers = 'notAcceptingPassengers'
}

export type KeyValue = {
  /** Identifier of value. */
  key?: Maybe<Scalars['String']>;
  /** The actual value */
  value?: Maybe<Scalars['String']>;
  /** Identifier of type of key */
  typeOfKey?: Maybe<Scalars['String']>;
};

export enum FlexibleServiceType {
  DynamicPassingTimes = 'dynamicPassingTimes',
  FixedHeadwayFrequency = 'fixedHeadwayFrequency',
  FixedPassingTimes = 'fixedPassingTimes',
  NotFlexible = 'notFlexible',
  Other = 'other'
}

export enum FlexibleLineType {
  CorridorService = 'corridorService',
  MainRouteWithFlexibleEnds = 'mainRouteWithFlexibleEnds',
  FlexibleAreasOnly = 'flexibleAreasOnly',
  HailAndRideSections = 'hailAndRideSections',
  FixedStopAreaWide = 'fixedStopAreaWide',
  FreeAreaAreaWide = 'freeAreaAreaWide',
  MixedFlexible = 'mixedFlexible',
  MixedFlexibleAndFixed = 'mixedFlexibleAndFixed',
  Fixed = 'fixed',
  Other = 'other'
}

/** Organisation providing public transport services. */
export type Operator = {
  /** Operator id */
  id: Scalars['ID'];
  name: Scalars['String'];
  url?: Maybe<Scalars['String']>;
  phone?: Maybe<Scalars['String']>;
  /** Branding for operator. */
  branding?: Maybe<Branding>;
  lines: Array<Maybe<Line>>;
  serviceJourney: Array<Maybe<ServiceJourney>>;
};

export type Branding = {
  id?: Maybe<Scalars['String']>;
  /** Full name to be used for branding. */
  name?: Maybe<Scalars['String']>;
  /** Description of branding. */
  description?: Maybe<Scalars['String']>;
  /** URL to be used for branding */
  url?: Maybe<Scalars['String']>;
  /** URL to an image be used for branding */
  image?: Maybe<Scalars['String']>;
};

/** Deprecated! Replaced by authority and operator. */
export type Organisation = {
  /** Organisation id */
  id: Scalars['ID'];
  name: Scalars['String'];
  url?: Maybe<Scalars['String']>;
  timezone: Scalars['String'];
  lang?: Maybe<Scalars['String']>;
  phone?: Maybe<Scalars['String']>;
  fareUrl?: Maybe<Scalars['String']>;
  lines: Array<Maybe<Line>>;
  /** Get all situations active for the organisation */
  situations: Array<Maybe<PtSituationElement>>;
};

/** A planned vehicle journey with passengers on a given date. */
export type DatedServiceJourney = {
  id: Scalars['ID'];
  /** Return the operating/service day the ServiceJourney run on. */
  operatingDay: Scalars['Date'];
  /** Whether journey is as planned, a cancellation, an extra journey or replaced. */
  serviceAlteration?: Maybe<ServiceAlteration>;
  serviceJourney: ServiceJourney;
  /** The DatedServiceJourney replaced by this DSJ. This is based on planed alterations, not real-time cancelations. */
  replacementFor?: Maybe<DatedServiceJourney>;
  /** Get all situations active for the DatedServiceJourney */
  situations: Array<Maybe<PtSituationElement>>;
};

export type BikeRentalStation = PlaceInterface & {
  id: Scalars['ID'];
  name: Scalars['String'];
  description?: Maybe<Scalars['String']>;
  bikesAvailable?: Maybe<Scalars['Int']>;
  spacesAvailable?: Maybe<Scalars['Int']>;
  realtimeOccupancyAvailable?: Maybe<Scalars['Boolean']>;
  allowDropoff?: Maybe<Scalars['Boolean']>;
  networks: Array<Maybe<Scalars['String']>>;
  longitude?: Maybe<Scalars['Float']>;
  latitude?: Maybe<Scalars['Float']>;
};

export type BikePark = PlaceInterface & {
  id: Scalars['ID'];
  name: Scalars['String'];
  spacesAvailable?: Maybe<Scalars['Int']>;
  realtime?: Maybe<Scalars['Boolean']>;
  longitude?: Maybe<Scalars['Float']>;
  latitude?: Maybe<Scalars['Float']>;
};

export type CarPark = PlaceInterface & {
  id: Scalars['ID'];
  name: Scalars['String'];
  capacity?: Maybe<Scalars['Int']>;
  spacesAvailable?: Maybe<Scalars['Int']>;
  capacityHandicap?: Maybe<Scalars['Int']>;
  spacesAvailableHandicap?: Maybe<Scalars['Int']>;
  capacityRecharging?: Maybe<Scalars['Int']>;
  spacesAvailableRecharging?: Maybe<Scalars['Int']>;
  realtimeOccupancyAvailable?: Maybe<Scalars['Boolean']>;
  longitude?: Maybe<Scalars['Float']>;
  latitude?: Maybe<Scalars['Float']>;
};

/** The default parameters used in travel searches. */
export type RoutingParameters = {
  /** Max walk speed along streets, in meters per second */
  walkSpeed?: Maybe<Scalars['Float']>;
  /** Max bike speed along streets, in meters per second */
  bikeSpeed?: Maybe<Scalars['Float']>;
  /** Max car speed along streets, in meters per second */
  carSpeed?: Maybe<Scalars['Float']>;
  /** The maximum distance (in meters) the user is willing to walk for access/egress legs. */
  maxWalkDistance?: Maybe<Scalars['Float']>;
  /** The maximum distance (in meters) the user is willing to walk for transfer legs. */
  maxTransferWalkDistance?: Maybe<Scalars['Float']>;
  /** The maximum time (in seconds) of pre-transit travel when using drive-to-transit (park and ride or kiss and ride). */
  maxPreTransitTime?: Maybe<Scalars['Float']>;
  /** Whether the trip must be wheelchair accessible. */
  wheelChairAccessible?: Maybe<Scalars['Boolean']>;
  /** The maximum number of itineraries to return. */
  numItineraries?: Maybe<Scalars['Int']>;
  /** The maximum slope of streets for wheelchair trips. */
  maxSlope?: Maybe<Scalars['Float']>;
  /** Whether the planner should return intermediate stops lists for transit legs. */
  showIntermediateStops?: Maybe<Scalars['Boolean']>;
  /** An extra penalty added on transfers (i.e. all boardings except the first one). */
  transferPenalty?: Maybe<Scalars['Int']>;
  /** A multiplier for how bad walking is, compared to being in transit for equal lengths of time. */
  walkReluctance?: Maybe<Scalars['Float']>;
  /** Used instead of walkReluctance for stairs. */
  stairsReluctance?: Maybe<Scalars['Float']>;
  /** Multiplicative factor on expected turning time. */
  turnReluctance?: Maybe<Scalars['Float']>;
  /** How much more reluctant is the user to walk on streets with car traffic allowed. */
  walkOnStreetReluctance?: Maybe<Scalars['Float']>;
  /** How long does it take to get on an elevator, on average. */
  elevatorBoardTime?: Maybe<Scalars['Int']>;
  /** What is the cost of boarding a elevator? */
  elevatorBoardCost?: Maybe<Scalars['Int']>;
  /** How long does it take to advance one floor on an elevator? */
  elevatorHopTime?: Maybe<Scalars['Int']>;
  /** What is the cost of travelling one floor on an elevator? */
  elevatorHopCost?: Maybe<Scalars['Int']>;
  /** Time to rent a bike. */
  bikeRentalPickupTime?: Maybe<Scalars['Int']>;
  /** Cost to rent a bike. */
  bikeRentalPickupCost?: Maybe<Scalars['Int']>;
  /** Time to drop-off a rented bike. */
  bikeRentalDropOffTime?: Maybe<Scalars['Int']>;
  /** Cost to drop-off a rented bike. */
  bikeRentalDropOffCost?: Maybe<Scalars['Int']>;
  /** Time to park a bike. */
  bikeParkTime?: Maybe<Scalars['Int']>;
  /** Cost to park a bike. */
  bikeParkCost?: Maybe<Scalars['Int']>;
  /** Time to park a car in a park and ride, w/o taking into account driving and walking cost. */
  carDropOffTime?: Maybe<Scalars['Int']>;
  /** How much worse is waiting for a transit vehicle than being on a transit vehicle, as a multiplier. */
  waitReluctance?: Maybe<Scalars['Float']>;
  /** How much less bad is waiting at the beginning of the trip (replaces waitReluctance on the first boarding). */
  waitAtBeginningFactor?: Maybe<Scalars['Float']>;
  /** This prevents unnecessary transfers by adding a cost for boarding a vehicle. */
  walkBoardCost?: Maybe<Scalars['Int']>;
  /** Separate cost for boarding a vehicle with a bicycle, which is more difficult than on foot. */
  bikeBoardCost?: Maybe<Scalars['Int']>;
  /** Penalty added for using every route that is not preferred if user set any route as preferred. We return number of seconds that we are willing to wait for preferred route. */
  otherThanPreferredRoutesPenalty?: Maybe<Scalars['Int']>;
  /** A global minimum transfer time (in seconds) that specifies the minimum amount of time that must pass between exiting one transit vehicle and boarding another. */
  transferSlack?: Maybe<Scalars['Int']>;
  /** Invariant: boardSlack + alightSlack <= transferSlack. */
  boardSlack?: Maybe<Scalars['Int']>;
  /** Invariant: boardSlack + alightSlack <= transferSlack. */
  alightSlack?: Maybe<Scalars['Int']>;
  /** Maximum number of transfers returned in a trip plan. */
  maxTransfers?: Maybe<Scalars['Int']>;
  /** When true, reverse optimize this search on the fly whenever needed, rather than reverse-optimizing the entire path when it's done. */
  reverseOptimizeOnTheFly?: Maybe<Scalars['Boolean']>;
  /** When true, do a full reversed search to compact the legs of the GraphPath. */
  compactLegsByReversedSearch?: Maybe<Scalars['Boolean']>;
  /** The deceleration speed of an automobile, in meters per second per second. */
  carDecelerationSpeed?: Maybe<Scalars['Float']>;
  /** The acceleration speed of an automobile, in meters per second per second. */
  carAccelerationSpeed?: Maybe<Scalars['Float']>;
  /** When true, realtime updates are ignored during this search. */
  ignoreRealTimeUpdates?: Maybe<Scalars['Boolean']>;
  /** When true, service journeys cancelled in scheduled route data will be included during this search. */
  includedPlannedCancellations?: Maybe<Scalars['Boolean']>;
  /** If true, the remaining weight heuristic is disabled. */
  disableRemainingWeightHeuristic?: Maybe<Scalars['Boolean']>;
  softWalkLimiting?: Maybe<Scalars['Boolean']>;
  softPreTransitLimiting?: Maybe<Scalars['Boolean']>;
  /** A jump in cost when stepping over the walking limit. */
  softWalkPenalty?: Maybe<Scalars['Float']>;
  /** A jump in cost for every meter over the walking limit. */
  softWalkOverageRate?: Maybe<Scalars['Float']>;
  /** A jump in cost when stepping over the pre-transit time limit. */
  preTransitPenalty?: Maybe<Scalars['Float']>;
  /** A jump in cost for every second over the pre-transit time limit. */
  preTransitOverageRate?: Maybe<Scalars['Float']>;
  allowBikeRental?: Maybe<Scalars['Boolean']>;
  bikeParkAndRide?: Maybe<Scalars['Boolean']>;
  parkAndRide?: Maybe<Scalars['Boolean']>;
  kissAndRide?: Maybe<Scalars['Boolean']>;
  rideAndKiss?: Maybe<Scalars['Boolean']>;
  /** Should traffic congestion be considered when driving? */
  useTraffic?: Maybe<Scalars['Boolean']>;
  /** Accept only paths that use transit (no street-only paths). */
  onlyTransitTrips?: Maybe<Scalars['Boolean']>;
  /** Option to disable the default filtering of GTFS-RT alerts by time. */
  disableAlertFiltering?: Maybe<Scalars['Boolean']>;
  /** Whether to apply the ellipsoid->geoid offset to all elevations in the response. */
  geoIdElevation?: Maybe<Scalars['Boolean']>;
  /** Whether to apply the ellipsoid->geoid offset to all elevations in the response. */
  preferredInterchangePenalty?: Maybe<Scalars['Int']>;
  /** Whether to apply the ellipsoid->geoid offset to all elevations in the response. */
  recommendedInterchangePenalty?: Maybe<Scalars['Int']>;
  /** Whether to apply the ellipsoid->geoid offset to all elevations in the response. */
  interchangeAllowedPenalty?: Maybe<Scalars['Int']>;
  /** Whether to apply the ellipsoid->geoid offset to all elevations in the response. */
  noInterchangePenalty?: Maybe<Scalars['Int']>;
  /** How much worse driving before and after transit is than riding on transit. Applies to ride and kiss, kiss and ride and park and ride. */
  preTransitReluctance?: Maybe<Scalars['Float']>;
};
