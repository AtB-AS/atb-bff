export type Maybe<T> = T;
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
  /** Date time using the format: yyyy-MM-dd'T'HH:mm:ss.SSSXXXX. Example: 2017-04-23T18:25:43.511+0100 */
  DateTime: any;
  Coordinates: any;
  /** Built-in java.math.BigInteger */
  BigInteger: any;
  /** Built-in java.math.BigDecimal */
  BigDecimal: any;
};


export type WaitingRoomEquipmentInput = {
  seats?: Maybe<Scalars['BigInteger']>;
  heated?: Maybe<Scalars['Boolean']>;
  stepFree?: Maybe<Scalars['Boolean']>;
};

export type EmbeddableMultilingualStringInput = {
  value?: Maybe<Scalars['String']>;
  lang?: Maybe<Scalars['String']>;
};

/** Transfer durations in seconds */
export type PathLinkInput = {
  id?: Maybe<Scalars['String']>;
  from?: Maybe<PathLinkEndInput>;
  to?: Maybe<PathLinkEndInput>;
  transferDuration?: Maybe<TransferDurationInput>;
  geometry?: Maybe<GeoJsonInput>;
};

/** A reference to an entity without version */
export type VersionLessEntityRefInput = {
  /** The NeTEx ID of the of the referenced entity. The reference must already exist */
  ref: Scalars['String'];
};


export type PathLinkEndInput = {
  placeRef?: Maybe<EntityRefInput>;
};

export type PrivateCode = {
  type?: Maybe<Scalars['String']>;
  value?: Maybe<Scalars['String']>;
};

export type AccessibilityAssessmentInput = {
  id?: Maybe<Scalars['String']>;
  limitations?: Maybe<AccessibilityLimitationsInput>;
};

/** A reference to an entity without version */
export type VersionLessEntityRef = {
  /** The NeTEx ID of the of the referenced entity. The reference must already exist */
  ref?: Maybe<Scalars['String']>;
};

export type TicketingEquipmentInput = {
  ticketOffice?: Maybe<Scalars['Boolean']>;
  ticketMachines?: Maybe<Scalars['Boolean']>;
  numberOfMachines?: Maybe<Scalars['BigInteger']>;
};

export type SanitaryEquipment = {
  id?: Maybe<Scalars['String']>;
  numberOfToilets?: Maybe<Scalars['BigInteger']>;
  gender?: Maybe<Gender>;
};

export type ParentStopPlace = StopPlaceInterface & {
  versionComment?: Maybe<Scalars['String']>;
  changedBy?: Maybe<Scalars['String']>;
  topographicPlace?: Maybe<TopographicPlace>;
  validBetween?: Maybe<ValidBetween>;
  alternativeNames?: Maybe<Array<Maybe<AlternativeName>>>;
  tariffZones?: Maybe<Array<Maybe<TariffZone>>>;
  tags?: Maybe<Array<Maybe<Tag>>>;
  groups?: Maybe<Array<Maybe<GroupOfStopPlaces>>>;
  placeEquipments?: Maybe<PlaceEquipments>;
  /** This field is set either on StopPlace (i.e. all Quays are equal), or on every Quay. */
  accessibilityAssessment?: Maybe<AccessibilityAssessment>;
  publicCode?: Maybe<Scalars['String']>;
  privateCode?: Maybe<PrivateCode>;
  modificationEnumeration?: Maybe<ModificationEnumerationType>;
  id?: Maybe<Scalars['String']>;
  name?: Maybe<EmbeddableMultilingualString>;
  shortName?: Maybe<EmbeddableMultilingualString>;
  description?: Maybe<EmbeddableMultilingualString>;
  version?: Maybe<Scalars['String']>;
  geometry?: Maybe<GeoJson>;
  /** @deprecated Moved to keyValues */
  importedId?: Maybe<Array<Maybe<Scalars['String']>>>;
  keyValues?: Maybe<Array<Maybe<KeyValues>>>;
  polygon?: Maybe<GeoJson>;
  children?: Maybe<Array<Maybe<StopPlace>>>;
};

export type CycleStorageEquipment = {
  id?: Maybe<Scalars['String']>;
  numberOfSpaces?: Maybe<Scalars['BigInteger']>;
  cycleStorageType?: Maybe<CycleStorageType>;
};

export type ShelterEquipmentInput = {
  seats?: Maybe<Scalars['BigInteger']>;
  stepFree?: Maybe<Scalars['Boolean']>;
  enclosed?: Maybe<Scalars['Boolean']>;
};

export type PrivateCodeInput = {
  type?: Maybe<Scalars['String']>;
  value: Scalars['String'];
};

export enum TransportModeType {
  Air = 'air',
  Bus = 'bus',
  Metro = 'metro',
  Rail = 'rail',
  Tram = 'tram',
  Water = 'water',
  Cableway = 'cableway',
  Funicular = 'funicular'
}

/** A reference to an entity with version */
export type EntityRefInput = {
  /** The NeTEx ID of the of the referenced entity. The reference must already exist */
  ref: Scalars['String'];
  /** The version of the referenced entity. */
  version?: Maybe<Scalars['String']>;
};


export type TicketingEquipment = {
  id?: Maybe<Scalars['String']>;
  ticketOffice?: Maybe<Scalars['Boolean']>;
  ticketMachines?: Maybe<Scalars['Boolean']>;
  numberOfMachines?: Maybe<Scalars['BigInteger']>;
};

export enum ParkingStayType {
  ShortStay = 'shortStay',
  MidTerm = 'midTerm',
  LongTerm = 'longTerm',
  Dropoff = 'dropoff',
  Unlimited = 'unlimited',
  Other = 'other',
  All = 'all'
}

export type ValidBetween = {
  /** Date time using the format: yyyy-MM-dd'T'HH:mm:ss.SSSXXXX. Example: 2017-04-23T18:25:43.511+0100 */
  fromDate?: Maybe<Scalars['DateTime']>;
  /** Date time using the format: yyyy-MM-dd'T'HH:mm:ss.SSSXXXX. Example: 2017-04-23T18:25:43.511+0100 */
  toDate?: Maybe<Scalars['DateTime']>;
};

export enum ParkingType {
  ParkAndRide = 'parkAndRide',
  LiftShareParking = 'liftShareParking',
  UrbanParking = 'urbanParking',
  AirportParking = 'airportParking',
  TrainStationParking = 'trainStationParking',
  ExhibitionCentreParking = 'exhibitionCentreParking',
  RentalCarParking = 'rentalCarParking',
  ShoppingCentreParking = 'shoppingCentreParking',
  MotorwayParking = 'motorwayParking',
  Roadside = 'roadside',
  ParkingZone = 'parkingZone',
  Undefined = 'undefined',
  CycleRental = 'cycleRental',
  Other = 'other'
}

export type AlternativeName = {
  nameType: NameType;
  name: EmbeddableMultilingualString;
};

export type AlternativeNameInput = {
  nameType?: Maybe<NameType>;
  name: EmbeddableMultilingualStringInput;
};

export enum LimitationStatusType {
  False = 'FALSE',
  True = 'TRUE',
  Partial = 'PARTIAL',
  Unknown = 'UNKNOWN'
}

export enum ParkingLayoutType {
  Covered = 'covered',
  OpenSpace = 'openSpace',
  Multistorey = 'multistorey',
  Underground = 'underground',
  Roadside = 'roadside',
  Undefined = 'undefined',
  Other = 'other',
  CycleHire = 'cycleHire'
}

export type AddToMultiModalStopPlaceInput = {
  parentSiteRef: Scalars['String'];
  versionComment?: Maybe<Scalars['String']>;
  validBetween?: Maybe<ValidBetweenInput>;
  stopPlaceIds: Array<Maybe<Scalars['String']>>;
};

/** Query and search for data */
export type StopPlaceRegister = {
  /** Search for StopPlaces */
  stopPlace?: Maybe<Array<Maybe<StopPlaceInterface>>>;
  /** Find StopPlaces within given BoundingBox. */
  stopPlaceBBox?: Maybe<Array<Maybe<StopPlaceInterface>>>;
  /** Find topographic places */
  topographicPlace?: Maybe<Array<Maybe<TopographicPlace>>>;
  /** Find path links */
  pathLink?: Maybe<Array<Maybe<PathLink>>>;
  /** Find parking */
  parking?: Maybe<Array<Maybe<Parking>>>;
  /** List all valid Transportmode/Submode-combinations. */
  validTransportModes?: Maybe<Array<Maybe<TransportModes>>>;
  /** Check if authorized for entity with role */
  checkAuthorized?: Maybe<AuthorizationCheck>;
  /** Fetches already used tags by name distinctively */
  tags?: Maybe<Array<Maybe<Tag>>>;
  /** Group of stop places */
  groupOfStopPlaces?: Maybe<Array<Maybe<GroupOfStopPlaces>>>;
  /** Tariff zones */
  tariffZones?: Maybe<Array<Maybe<TariffZone>>>;
};


/** Query and search for data */
export type StopPlaceRegisterStopPlaceArgs = {
  page?: Maybe<Scalars['Int']>;
  size?: Maybe<Scalars['Int']>;
  allVersions?: Maybe<Scalars['Boolean']>;
  id?: Maybe<Scalars['String']>;
  version?: Maybe<Scalars['Int']>;
  versionValidity?: Maybe<VersionValidity>;
  stopPlaceType?: Maybe<Array<Maybe<StopPlaceType>>>;
  countyReference?: Maybe<Array<Maybe<Scalars['String']>>>;
  countryReference?: Maybe<Array<Maybe<Scalars['String']>>>;
  tags?: Maybe<Array<Maybe<Scalars['String']>>>;
  municipalityReference?: Maybe<Array<Maybe<Scalars['String']>>>;
  query?: Maybe<Scalars['String']>;
  importedId?: Maybe<Scalars['String']>;
  pointInTime?: Maybe<Scalars['DateTime']>;
  key?: Maybe<Scalars['String']>;
  withoutLocationOnly?: Maybe<Scalars['Boolean']>;
  withoutQuaysOnly?: Maybe<Scalars['Boolean']>;
  withDuplicatedQuayImportedIds?: Maybe<Scalars['Boolean']>;
  withNearbySimilarDuplicates?: Maybe<Scalars['Boolean']>;
  hasParking?: Maybe<Scalars['Boolean']>;
  onlyMonomodalStopPlaces?: Maybe<Scalars['Boolean']>;
  values?: Maybe<Array<Maybe<Scalars['String']>>>;
  withTags?: Maybe<Scalars['Boolean']>;
  code?: Maybe<Scalars['String']>;
};


/** Query and search for data */
export type StopPlaceRegisterStopPlaceBBoxArgs = {
  page?: Maybe<Scalars['Int']>;
  size?: Maybe<Scalars['Int']>;
  lonMin: Scalars['BigDecimal'];
  latMin: Scalars['BigDecimal'];
  lonMax: Scalars['BigDecimal'];
  latMax: Scalars['BigDecimal'];
  ignoreStopPlaceId?: Maybe<Scalars['String']>;
  includeExpired?: Maybe<Scalars['Boolean']>;
  pointInTime?: Maybe<Scalars['DateTime']>;
};


/** Query and search for data */
export type StopPlaceRegisterTopographicPlaceArgs = {
  id?: Maybe<Scalars['String']>;
  allVersions?: Maybe<Scalars['Boolean']>;
  topographicPlaceType?: Maybe<TopographicPlaceType>;
  query?: Maybe<Scalars['String']>;
};


/** Query and search for data */
export type StopPlaceRegisterPathLinkArgs = {
  id?: Maybe<Scalars['String']>;
  allVersions?: Maybe<Scalars['Boolean']>;
  stopPlaceId?: Maybe<Scalars['String']>;
};


/** Query and search for data */
export type StopPlaceRegisterParkingArgs = {
  page?: Maybe<Scalars['Int']>;
  size?: Maybe<Scalars['Int']>;
  id?: Maybe<Scalars['String']>;
  version?: Maybe<Scalars['Int']>;
  stopPlaceId?: Maybe<Scalars['String']>;
  allVersions?: Maybe<Scalars['Boolean']>;
};


/** Query and search for data */
export type StopPlaceRegisterCheckAuthorizedArgs = {
  id?: Maybe<Scalars['String']>;
};


/** Query and search for data */
export type StopPlaceRegisterTagsArgs = {
  name: Scalars['String'];
};


/** Query and search for data */
export type StopPlaceRegisterGroupOfStopPlacesArgs = {
  page?: Maybe<Scalars['Int']>;
  size?: Maybe<Scalars['Int']>;
  id?: Maybe<Scalars['String']>;
  query?: Maybe<Scalars['String']>;
  stopPlaceId?: Maybe<Scalars['String']>;
};


/** Query and search for data */
export type StopPlaceRegisterTariffZonesArgs = {
  page?: Maybe<Scalars['Int']>;
  size?: Maybe<Scalars['Int']>;
  query?: Maybe<Scalars['String']>;
};

export enum InterchangeWeightingType {
  NoInterchange = 'noInterchange',
  InterchangeAllowed = 'interchangeAllowed',
  RecommendedInterchange = 'recommendedInterchange',
  PreferredInterchange = 'preferredInterchange'
}

export type CycleStorageEquipmentInput = {
  numberOfSpaces?: Maybe<Scalars['BigInteger']>;
  cycleStorageType?: Maybe<CycleStorageType>;
};

/** Transfer durations in seconds */
export type TransferDurationInput = {
  id?: Maybe<Scalars['String']>;
  /** Default duration in seconds */
  defaultDuration?: Maybe<Scalars['Int']>;
  /** Frequent traveller duration in seconds */
  frequentTravellerDuration?: Maybe<Scalars['Int']>;
  /** Occasional traveller duration in seconds */
  occasionalTravellerDuration?: Maybe<Scalars['Int']>;
  /** Mobility restriced traveller duration in seconds */
  mobilityRestrictedTravellerDuration?: Maybe<Scalars['Int']>;
};

export enum Gender {
  Both = 'both',
  FemaleOnly = 'femaleOnly',
  MaleOnly = 'maleOnly',
  SameSexOnly = 'sameSexOnly'
}

export enum ParkingUserType {
  AllUsers = 'allUsers',
  Staff = 'staff',
  Visitors = 'visitors',
  RegisteredDisabled = 'registeredDisabled',
  Registered = 'registered',
  Rental = 'rental',
  Doctors = 'doctors',
  ResidentsWithPermits = 'residentsWithPermits',
  ReservationHolders = 'reservationHolders',
  EmergencyServices = 'emergencyServices',
  Other = 'other',
  All = 'all'
}

export enum StopPlaceType {
  OnstreetBus = 'onstreetBus',
  OnstreetTram = 'onstreetTram',
  Airport = 'airport',
  RailStation = 'railStation',
  MetroStation = 'metroStation',
  BusStation = 'busStation',
  CoachStation = 'coachStation',
  TramStation = 'tramStation',
  HarbourPort = 'harbourPort',
  FerryPort = 'ferryPort',
  FerryStop = 'ferryStop',
  LiftStation = 'liftStation',
  VehicleRailInterchange = 'vehicleRailInterchange',
  Other = 'other'
}

export type KeyValuesInput = {
  key?: Maybe<Scalars['String']>;
  values?: Maybe<Array<Maybe<Scalars['String']>>>;
};

export type Quay = {
  placeEquipments?: Maybe<PlaceEquipments>;
  /** This field is set either on StopPlace (i.e. all Quays are equal), or on every Quay. */
  accessibilityAssessment?: Maybe<AccessibilityAssessment>;
  publicCode?: Maybe<Scalars['String']>;
  privateCode?: Maybe<PrivateCode>;
  modificationEnumeration?: Maybe<ModificationEnumerationType>;
  id?: Maybe<Scalars['String']>;
  name?: Maybe<EmbeddableMultilingualString>;
  shortName?: Maybe<EmbeddableMultilingualString>;
  description?: Maybe<EmbeddableMultilingualString>;
  version?: Maybe<Scalars['String']>;
  validBetween?: Maybe<ValidBetween>;
  geometry?: Maybe<GeoJson>;
  /** @deprecated Moved to keyValues */
  importedId?: Maybe<Array<Maybe<Scalars['String']>>>;
  keyValues?: Maybe<Array<Maybe<KeyValues>>>;
  polygon?: Maybe<GeoJson>;
  compassBearing?: Maybe<Scalars['BigDecimal']>;
  alternativeNames?: Maybe<Array<Maybe<AlternativeName>>>;
};

export type ValidBetweenInput = {
  /** When the new version is valid from */
  fromDate: Scalars['DateTime'];
  /** When the version is no longer valid */
  toDate?: Maybe<Scalars['DateTime']>;
};

export type ParentStopPlaceInput = {
  /** Ignore when creating new */
  id?: Maybe<Scalars['String']>;
  name?: Maybe<EmbeddableMultilingualStringInput>;
  shortName?: Maybe<EmbeddableMultilingualStringInput>;
  publicCode?: Maybe<Scalars['String']>;
  privateCode?: Maybe<PrivateCodeInput>;
  description?: Maybe<EmbeddableMultilingualStringInput>;
  geometry?: Maybe<GeoJsonInput>;
  alternativeNames?: Maybe<Array<Maybe<AlternativeNameInput>>>;
  placeEquipments?: Maybe<PlaceEquipmentsInput>;
  keyValues?: Maybe<Array<Maybe<KeyValuesInput>>>;
  /** This field is set either on StopPlace (i.e. all Quays are equal), or on every Quay. */
  accessibilityAssessment?: Maybe<AccessibilityAssessmentInput>;
  transportMode?: Maybe<TransportModeType>;
  submode?: Maybe<SubmodeType>;
  versionComment?: Maybe<Scalars['String']>;
  validBetween?: Maybe<ValidBetweenInput>;
  children?: Maybe<Array<Maybe<StopPlaceInput>>>;
};

export type ParkingPropertiesInput = {
  parkingUserTypes?: Maybe<Array<Maybe<ParkingUserType>>>;
  maximumStay?: Maybe<Scalars['BigInteger']>;
  spaces?: Maybe<Array<Maybe<ParkingCapacityInput>>>;
};

export enum GeoJsonType {
  Point = 'Point',
  LineString = 'LineString',
  Polygon = 'Polygon',
  MultiPoint = 'MultiPoint',
  MultiLineString = 'MultiLineString',
  MultiPolygon = 'MultiPolygon',
  GeometryCollection = 'GeometryCollection'
}

export enum SubmodeType {
  LocalBus = 'localBus',
  RegionalBus = 'regionalBus',
  ExpressBus = 'expressBus',
  NightBus = 'nightBus',
  SightseeingBus = 'sightseeingBus',
  ShuttleBus = 'shuttleBus',
  SchoolBus = 'schoolBus',
  RailReplacementBus = 'railReplacementBus',
  AirportLinkBus = 'airportLinkBus',
  LocalTram = 'localTram',
  Local = 'local',
  RegionalRail = 'regionalRail',
  InterregionalRail = 'interregionalRail',
  LongDistance = 'longDistance',
  NightRail = 'nightRail',
  TouristRailway = 'touristRailway',
  Metro = 'metro',
  InternationalFlight = 'internationalFlight',
  DomesticFlight = 'domesticFlight',
  HelicopterService = 'helicopterService',
  InternationalCarFerry = 'internationalCarFerry',
  NationalCarFerry = 'nationalCarFerry',
  LocalCarFerry = 'localCarFerry',
  InternationalPassengerFerry = 'internationalPassengerFerry',
  LocalPassengerFerry = 'localPassengerFerry',
  HighSpeedVehicleService = 'highSpeedVehicleService',
  HighSpeedPassengerService = 'highSpeedPassengerService',
  SightseeingService = 'sightseeingService',
  Telecabin = 'telecabin',
  Funicular = 'funicular'
}

export enum TopographicPlaceType {
  Continent = 'continent',
  Interregion = 'interregion',
  Country = 'country',
  Principality = 'principality',
  State = 'state',
  Province = 'province',
  Region = 'region',
  County = 'county',
  Area = 'area',
  Conurbation = 'conurbation',
  City = 'city',
  Municipality = 'municipality',
  Quarter = 'quarter',
  Suburb = 'suburb',
  Town = 'town',
  UrbanCentre = 'urbanCentre',
  District = 'district',
  Parish = 'parish',
  Village = 'village',
  Hamlet = 'hamlet',
  PlaceOfInterest = 'placeOfInterest',
  Other = 'other',
  Unrecorded = 'unrecorded'
}

export type Parking = {
  id?: Maybe<Scalars['String']>;
  version?: Maybe<Scalars['String']>;
  name?: Maybe<EmbeddableMultilingualString>;
  validBetween?: Maybe<ValidBetween>;
  parentSiteRef?: Maybe<Scalars['String']>;
  totalCapacity?: Maybe<Scalars['BigInteger']>;
  parkingType?: Maybe<ParkingType>;
  parkingVehicleTypes?: Maybe<Array<Maybe<ParkingVehicleType>>>;
  parkingLayout?: Maybe<ParkingLayoutType>;
  principalCapacity?: Maybe<Scalars['BigInteger']>;
  overnightParkingPermitted?: Maybe<Scalars['Boolean']>;
  rechargingAvailable?: Maybe<Scalars['Boolean']>;
  secure?: Maybe<Scalars['Boolean']>;
  realTimeOccupancyAvailable?: Maybe<Scalars['Boolean']>;
  parkingReservation?: Maybe<ParkingReservationType>;
  bookingUrl?: Maybe<Scalars['String']>;
  freeParkingOutOfHours?: Maybe<Scalars['Boolean']>;
  parkingPaymentProcess?: Maybe<Array<Maybe<ParkingPaymentProcessType>>>;
  parkingProperties?: Maybe<Array<Maybe<ParkingProperties>>>;
  parkingAreas?: Maybe<Array<Maybe<ParkingArea>>>;
  geometry?: Maybe<GeoJson>;
};

export type GeneralSign = {
  id?: Maybe<Scalars['String']>;
  privateCode?: Maybe<PrivateCode>;
  content?: Maybe<EmbeddableMultilingualString>;
  signContentType?: Maybe<SignContentType>;
};

export type EmbeddableMultilingualString = {
  value?: Maybe<Scalars['String']>;
  lang?: Maybe<Scalars['String']>;
};

export type ShelterEquipment = {
  id?: Maybe<Scalars['String']>;
  seats?: Maybe<Scalars['BigInteger']>;
  stepFree?: Maybe<Scalars['Boolean']>;
  enclosed?: Maybe<Scalars['Boolean']>;
};

/** Create and edit stopplaces */
export type StopPlaceMutation = {
  /** Create new or update existing StopPlace */
  mutateStopPlace?: Maybe<Array<Maybe<StopPlace>>>;
  /** Update existing Parent StopPlace */
  mutateParentStopPlace?: Maybe<Array<Maybe<ParentStopPlace>>>;
  /** Mutate group of stop places */
  mutateGroupOfStopPlaces?: Maybe<GroupOfStopPlaces>;
  /** Create new or update existing PathLink */
  mutatePathlink?: Maybe<Array<Maybe<PathLink>>>;
  /** Create new or update existing Parking */
  mutateParking?: Maybe<Array<Maybe<Parking>>>;
  /** TariffZone will be terminated and no longer be active after the given date. */
  terminateTariffZone?: Maybe<TariffZone>;
  /** Remove tag from referenced entity */
  removeTag?: Maybe<Tag>;
  /** Create tag for referenced entity. */
  createTag?: Maybe<Tag>;
  /** Merges two StopPlaces by terminating 'from'-StopPlace, and copying quays/values into 'to'-StopPlace */
  mergeStopPlaces?: Maybe<StopPlaceInterface>;
  /** Merges two Quays on a StopPlace. */
  mergeQuays?: Maybe<StopPlaceInterface>;
  /** Moves one or more quays to a new or existing stop place. Returns the destination stop place. */
  moveQuaysToStop?: Maybe<StopPlaceInterface>;
  /** !!! Deletes all versions of StopPlace from database - use with caution !!! */
  deleteStopPlace?: Maybe<Scalars['Boolean']>;
  /** StopPlace will be terminated and no longer be active after the given date. */
  terminateStopPlace?: Maybe<StopPlaceInterface>;
  /** StopPlace will be reopened and immidiately active. */
  reopenStopPlace?: Maybe<StopPlaceInterface>;
  /** Removes quay from StopPlace */
  deleteQuay?: Maybe<StopPlaceInterface>;
  /** !!! Deletes all versions of Parking from database - use with caution !!! */
  deleteParking?: Maybe<Scalars['Boolean']>;
  /** Creates a new multimodal parent StopPlace */
  createMultiModalStopPlace?: Maybe<ParentStopPlace>;
  /** Adds a StopPlace to an existing ParentStopPlace */
  addToMultiModalStopPlace?: Maybe<ParentStopPlace>;
  /** Removes a StopPlace from an existing ParentStopPlace */
  removeFromMultiModalStopPlace?: Maybe<ParentStopPlace>;
  /** Hard delete group of stop places by ID */
  deleteGroupOfStopPlaces?: Maybe<Scalars['Boolean']>;
};


/** Create and edit stopplaces */
export type StopPlaceMutationMutateStopPlaceArgs = {
  StopPlace?: Maybe<StopPlaceInput>;
};


/** Create and edit stopplaces */
export type StopPlaceMutationMutateParentStopPlaceArgs = {
  ParentStopPlace?: Maybe<ParentStopPlaceInput>;
};


/** Create and edit stopplaces */
export type StopPlaceMutationMutateGroupOfStopPlacesArgs = {
  GroupOfStopPlaces?: Maybe<GroupOfStopPlacesInput>;
};


/** Create and edit stopplaces */
export type StopPlaceMutationMutatePathlinkArgs = {
  PathLink?: Maybe<Array<Maybe<PathLinkInput>>>;
};


/** Create and edit stopplaces */
export type StopPlaceMutationMutateParkingArgs = {
  Parking?: Maybe<Array<Maybe<ParkingInput>>>;
};


/** Create and edit stopplaces */
export type StopPlaceMutationTerminateTariffZoneArgs = {
  tariffZoneId: Scalars['String'];
  toDate: Scalars['DateTime'];
  versionComment?: Maybe<Scalars['String']>;
};


/** Create and edit stopplaces */
export type StopPlaceMutationRemoveTagArgs = {
  idReference: Scalars['String'];
  name: Scalars['String'];
  comment?: Maybe<Scalars['String']>;
};


/** Create and edit stopplaces */
export type StopPlaceMutationCreateTagArgs = {
  idReference: Scalars['String'];
  name: Scalars['String'];
  comment?: Maybe<Scalars['String']>;
};


/** Create and edit stopplaces */
export type StopPlaceMutationMergeStopPlacesArgs = {
  fromStopPlaceId: Scalars['String'];
  toStopPlaceId: Scalars['String'];
  fromVersionComment?: Maybe<Scalars['String']>;
  toVersionComment?: Maybe<Scalars['String']>;
  dryRun?: Maybe<Scalars['Boolean']>;
};


/** Create and edit stopplaces */
export type StopPlaceMutationMergeQuaysArgs = {
  stopPlaceId: Scalars['String'];
  fromQuayId: Scalars['String'];
  toQuayId: Scalars['String'];
  versionComment?: Maybe<Scalars['String']>;
  dryRun?: Maybe<Scalars['Boolean']>;
};


/** Create and edit stopplaces */
export type StopPlaceMutationMoveQuaysToStopArgs = {
  quayIds?: Maybe<Array<Scalars['String']>>;
  toStopPlaceId?: Maybe<Scalars['String']>;
  fromVersionComment?: Maybe<Scalars['String']>;
  toVersionComment?: Maybe<Scalars['String']>;
};


/** Create and edit stopplaces */
export type StopPlaceMutationDeleteStopPlaceArgs = {
  stopPlaceId: Scalars['String'];
};


/** Create and edit stopplaces */
export type StopPlaceMutationTerminateStopPlaceArgs = {
  stopPlaceId: Scalars['String'];
  toDate: Scalars['DateTime'];
  versionComment?: Maybe<Scalars['String']>;
  modificationEnumeration?: Maybe<ModificationEnumerationType>;
};


/** Create and edit stopplaces */
export type StopPlaceMutationReopenStopPlaceArgs = {
  stopPlaceId: Scalars['String'];
  versionComment?: Maybe<Scalars['String']>;
};


/** Create and edit stopplaces */
export type StopPlaceMutationDeleteQuayArgs = {
  stopPlaceId: Scalars['String'];
  quayId: Scalars['String'];
  versionComment?: Maybe<Scalars['String']>;
};


/** Create and edit stopplaces */
export type StopPlaceMutationDeleteParkingArgs = {
  parkingId: Scalars['String'];
};


/** Create and edit stopplaces */
export type StopPlaceMutationCreateMultiModalStopPlaceArgs = {
  input?: Maybe<CreateMultiModalStopPlaceInput>;
};


/** Create and edit stopplaces */
export type StopPlaceMutationAddToMultiModalStopPlaceArgs = {
  input?: Maybe<AddToMultiModalStopPlaceInput>;
};


/** Create and edit stopplaces */
export type StopPlaceMutationRemoveFromMultiModalStopPlaceArgs = {
  parentSiteRef: Scalars['String'];
  stopPlaceId?: Maybe<Array<Maybe<Scalars['String']>>>;
};


/** Create and edit stopplaces */
export type StopPlaceMutationDeleteGroupOfStopPlacesArgs = {
  id: Scalars['String'];
};

export type SanitaryEquipmentInput = {
  numberOfToilets?: Maybe<Scalars['BigInteger']>;
  gender?: Maybe<Gender>;
};

export type WaitingRoomEquipment = {
  id?: Maybe<Scalars['String']>;
  seats?: Maybe<Scalars['BigInteger']>;
  heated?: Maybe<Scalars['Boolean']>;
  stepFree?: Maybe<Scalars['Boolean']>;
};

/** A tag for an entity like StopPlace */
export type Tag = {
  /** Tag name */
  name?: Maybe<Scalars['String']>;
  /** A reference to a netex ID. For instance: NSR:StopPlace:1. Types supported: StopPlace */
  idReference?: Maybe<Scalars['String']>;
  /** When this tag was added to the referenced entity */
  created?: Maybe<Scalars['DateTime']>;
  /** Who created this tag for the referenced entity */
  createdBy?: Maybe<Scalars['String']>;
  /** A comment for this tag on this entity */
  comment?: Maybe<Scalars['String']>;
  /** When this tag was removed. If set, the tag is removed from entity it references in field 'idReference' */
  removed?: Maybe<Scalars['DateTime']>;
  /** Removed by username. Only set if tag has been removed */
  removedBy?: Maybe<Scalars['String']>;
};

export type AccessibilityAssessment = {
  id?: Maybe<Scalars['String']>;
  version?: Maybe<Scalars['String']>;
  limitations?: Maybe<AccessibilityLimitations>;
  mobilityImpairedAccess?: Maybe<LimitationStatusType>;
};

export type TariffZone = {
  id?: Maybe<Scalars['String']>;
  name?: Maybe<EmbeddableMultilingualString>;
  shortName?: Maybe<EmbeddableMultilingualString>;
  description?: Maybe<EmbeddableMultilingualString>;
  version?: Maybe<Scalars['String']>;
  validBetween?: Maybe<ValidBetween>;
  geometry?: Maybe<GeoJson>;
  /** @deprecated Moved to keyValues */
  importedId?: Maybe<Array<Maybe<Scalars['String']>>>;
  keyValues?: Maybe<Array<Maybe<KeyValues>>>;
  polygon?: Maybe<GeoJson>;
};

export type GroupOfStopPlacesInput = {
  /** Ignore ID when creating new */
  id?: Maybe<Scalars['String']>;
  name: EmbeddableMultilingualStringInput;
  shortName?: Maybe<EmbeddableMultilingualStringInput>;
  description?: Maybe<EmbeddableMultilingualStringInput>;
  alternativeNames?: Maybe<Array<Maybe<AlternativeNameInput>>>;
  versionComment?: Maybe<Scalars['String']>;
  /** References to group of stop places members. Stop place IDs. */
  members?: Maybe<Array<Maybe<VersionLessEntityRefInput>>>;
};

export enum ParkingPaymentProcessType {
  Free = 'free',
  PayAtBay = 'payAtBay',
  PayAndDisplay = 'payAndDisplay',
  PayAtExitBoothManualCollection = 'payAtExitBoothManualCollection',
  PayAtMachineOnFootPriorToExit = 'payAtMachineOnFootPriorToExit',
  PayByPrepaidToken = 'payByPrepaidToken',
  PayByMobileDevice = 'payByMobileDevice',
  Undefined = 'undefined',
  Other = 'other'
}

export type GroupOfStopPlaces = {
  id?: Maybe<Scalars['String']>;
  name?: Maybe<EmbeddableMultilingualString>;
  shortName?: Maybe<EmbeddableMultilingualString>;
  description?: Maybe<EmbeddableMultilingualString>;
  version?: Maybe<Scalars['String']>;
  versionComment?: Maybe<Scalars['String']>;
  members?: Maybe<Array<Maybe<StopPlaceInterface>>>;
};

export type TopographicPlace = {
  id?: Maybe<Scalars['String']>;
  topographicPlaceType?: Maybe<TopographicPlaceType>;
  name?: Maybe<EmbeddableMultilingualString>;
  version?: Maybe<Scalars['Int']>;
  parentTopographicPlace?: Maybe<TopographicPlace>;
  polygon?: Maybe<GeoJson>;
};

export enum VersionValidity {
  All = 'ALL',
  Current = 'CURRENT',
  CurrentFuture = 'CURRENT_FUTURE',
  MaxVersion = 'MAX_VERSION'
}

export type TransportModes = {
  transportMode?: Maybe<Scalars['String']>;
  submode?: Maybe<Array<Maybe<Scalars['String']>>>;
};

export type StopPlaceInterface = {
  placeEquipments?: Maybe<PlaceEquipments>;
  /** This field is set either on StopPlace (i.e. all Quays are equal), or on every Quay. */
  accessibilityAssessment?: Maybe<AccessibilityAssessment>;
  publicCode?: Maybe<Scalars['String']>;
  privateCode?: Maybe<PrivateCode>;
  modificationEnumeration?: Maybe<ModificationEnumerationType>;
  id?: Maybe<Scalars['String']>;
  name?: Maybe<EmbeddableMultilingualString>;
  shortName?: Maybe<EmbeddableMultilingualString>;
  description?: Maybe<EmbeddableMultilingualString>;
  version?: Maybe<Scalars['String']>;
  validBetween?: Maybe<ValidBetween>;
  geometry?: Maybe<GeoJson>;
  /** @deprecated Moved to keyValues */
  importedId?: Maybe<Array<Maybe<Scalars['String']>>>;
  keyValues?: Maybe<Array<Maybe<KeyValues>>>;
  polygon?: Maybe<GeoJson>;
  versionComment?: Maybe<Scalars['String']>;
  changedBy?: Maybe<Scalars['String']>;
  topographicPlace?: Maybe<TopographicPlace>;
  alternativeNames?: Maybe<Array<Maybe<AlternativeName>>>;
  tariffZones?: Maybe<Array<Maybe<TariffZone>>>;
  tags?: Maybe<Array<Maybe<Tag>>>;
  groups?: Maybe<Array<Maybe<GroupOfStopPlaces>>>;
};

export enum ParkingReservationType {
  ReservationRequired = 'reservationRequired',
  ReservationAllowed = 'reservationAllowed',
  NoReservations = 'noReservations',
  RegistrationRequired = 'registrationRequired',
  Other = 'other'
}

export type ParkingProperties = {
  parkingUserTypes?: Maybe<Array<Maybe<ParkingUserType>>>;
  maximumStay?: Maybe<Scalars['BigInteger']>;
  spaces?: Maybe<Array<Maybe<ParkingCapacity>>>;
};

export enum ParkingVehicleType {
  PedalCycle = 'pedalCycle',
  Moped = 'moped',
  Motorcycle = 'motorcycle',
  MotorcycleWithSidecar = 'motorcycleWithSidecar',
  MotorScooter = 'motorScooter',
  TwoWheeledVehicle = 'twoWheeledVehicle',
  ThreeWheeledVehicle = 'threeWheeledVehicle',
  Car = 'car',
  SmallCar = 'smallCar',
  PassengerCar = 'passengerCar',
  LargeCar = 'largeCar',
  FourWheelDrive = 'fourWheelDrive',
  Taxi = 'taxi',
  CamperCar = 'camperCar',
  CarWithTrailer = 'carWithTrailer',
  CarWithCaravan = 'carWithCaravan',
  Minibus = 'minibus',
  Bus = 'bus',
  Van = 'van',
  LargeVan = 'largeVan',
  HighSidedVehicle = 'highSidedVehicle',
  LightGoodsVehicle = 'lightGoodsVehicle',
  HeavyGoodsVehicle = 'heavyGoodsVehicle',
  Truck = 'truck',
  AgriculturalVehicle = 'agriculturalVehicle',
  Tanker = 'tanker',
  Tram = 'tram',
  ArticulatedVehicle = 'articulatedVehicle',
  VehicleWithTrailer = 'vehicleWithTrailer',
  LightGoodsVehicleWithTrailer = 'lightGoodsVehicleWithTrailer',
  HeavyGoodsVehicleWithTrailer = 'heavyGoodsVehicleWithTrailer',
  Undefined = 'undefined',
  Other = 'other',
  AllPassengerVehicles = 'allPassengerVehicles',
  All = 'all'
}

export type AccessibilityLimitationsInput = {
  id?: Maybe<Scalars['String']>;
  wheelchairAccess: LimitationStatusType;
  stepFreeAccess: LimitationStatusType;
  escalatorFreeAccess: LimitationStatusType;
  liftFreeAccess: LimitationStatusType;
  audibleSignalsAvailable: LimitationStatusType;
};

export type ParkingArea = {
  label?: Maybe<EmbeddableMultilingualString>;
  totalCapacity?: Maybe<Scalars['BigInteger']>;
  parkingProperties?: Maybe<ParkingProperties>;
};

export type ParkingCapacity = {
  parkingVehicleType?: Maybe<ParkingVehicleType>;
  parkingUserType?: Maybe<ParkingUserType>;
  parkingStayType?: Maybe<ParkingStayType>;
  numberOfSpaces?: Maybe<Scalars['BigInteger']>;
  numberOfSpacesWithRechargePoint?: Maybe<Scalars['BigInteger']>;
};

export type TopographicPlaceInput = {
  id?: Maybe<Scalars['String']>;
  topographicPlaceType?: Maybe<TopographicPlaceType>;
  name?: Maybe<EmbeddableMultilingualStringInput>;
};

export enum SignContentType {
  Entrance = 'entrance',
  Exit = 'exit',
  EmergencyExit = 'emergencyExit',
  TransportMode = 'transportMode',
  NoSmoking = 'noSmoking',
  Tickets = 'tickets',
  Assistance = 'assistance',
  SosPhone = 'sosPhone',
  TouchPoint = 'touchPoint',
  MeetingPoint = 'meetingPoint',
  TransportModePoint = 'TransportModePoint',
  Other = 'other'
}

export type PlaceEquipmentsInput = {
  waitingRoomEquipment?: Maybe<Array<Maybe<WaitingRoomEquipmentInput>>>;
  sanitaryEquipment?: Maybe<Array<Maybe<SanitaryEquipmentInput>>>;
  ticketingEquipment?: Maybe<Array<Maybe<TicketingEquipmentInput>>>;
  shelterEquipment?: Maybe<Array<Maybe<ShelterEquipmentInput>>>;
  cycleStorageEquipment?: Maybe<Array<Maybe<CycleStorageEquipmentInput>>>;
  generalSign?: Maybe<Array<Maybe<GeneralSignInput>>>;
};

export type ParkingInput = {
  id?: Maybe<Scalars['String']>;
  name?: Maybe<EmbeddableMultilingualStringInput>;
  parentSiteRef?: Maybe<Scalars['String']>;
  totalCapacity?: Maybe<Scalars['BigInteger']>;
  parkingType?: Maybe<ParkingType>;
  parkingVehicleTypes?: Maybe<Array<Maybe<ParkingVehicleType>>>;
  parkingLayout?: Maybe<ParkingLayoutType>;
  principalCapacity?: Maybe<Scalars['BigInteger']>;
  overnightParkingPermitted?: Maybe<Scalars['Boolean']>;
  rechargingAvailable?: Maybe<Scalars['Boolean']>;
  secure?: Maybe<Scalars['Boolean']>;
  realTimeOccupancyAvailable?: Maybe<Scalars['Boolean']>;
  parkingReservation?: Maybe<ParkingReservationType>;
  bookingUrl?: Maybe<Scalars['String']>;
  freeParkingOutOfHours?: Maybe<Scalars['Boolean']>;
  parkingPaymentProcess?: Maybe<Array<Maybe<ParkingPaymentProcessType>>>;
  parkingProperties?: Maybe<Array<Maybe<ParkingPropertiesInput>>>;
  parkingAreas?: Maybe<Array<Maybe<ParkingAreaInput>>>;
  geometry?: Maybe<GeoJsonInput>;
  validBetween?: Maybe<ValidBetweenInput>;
};

export type ParkingAreaInput = {
  label?: Maybe<EmbeddableMultilingualStringInput>;
  totalCapacity?: Maybe<Scalars['BigInteger']>;
  parkingProperties?: Maybe<ParkingPropertiesInput>;
};

export type PathLink = {
  id?: Maybe<Scalars['String']>;
  from?: Maybe<PathLinkEnd>;
  to?: Maybe<PathLinkEnd>;
  version?: Maybe<Scalars['String']>;
  geometry?: Maybe<GeoJson>;
  transferDuration?: Maybe<TransferDuration>;
};

export type PlaceEquipments = {
  id?: Maybe<Scalars['String']>;
  waitingRoomEquipment?: Maybe<Array<Maybe<WaitingRoomEquipment>>>;
  sanitaryEquipment?: Maybe<Array<Maybe<SanitaryEquipment>>>;
  ticketingEquipment?: Maybe<Array<Maybe<TicketingEquipment>>>;
  shelterEquipment?: Maybe<Array<Maybe<ShelterEquipment>>>;
  cycleStorageEquipment?: Maybe<Array<Maybe<CycleStorageEquipment>>>;
  generalSign?: Maybe<Array<Maybe<GeneralSign>>>;
};


export enum ModificationEnumerationType {
  New = 'new',
  Delete = 'delete',
  Revise = 'revise',
  Delta = 'delta'
}

export type AddressablePlace = {
  placeEquipments?: Maybe<PlaceEquipments>;
  /** This field is set either on StopPlace (i.e. all Quays are equal), or on every Quay. */
  accessibilityAssessment?: Maybe<AccessibilityAssessment>;
  publicCode?: Maybe<Scalars['String']>;
  privateCode?: Maybe<PrivateCode>;
  modificationEnumeration?: Maybe<ModificationEnumerationType>;
  id?: Maybe<Scalars['String']>;
  name?: Maybe<EmbeddableMultilingualString>;
  shortName?: Maybe<EmbeddableMultilingualString>;
  description?: Maybe<EmbeddableMultilingualString>;
  version?: Maybe<Scalars['String']>;
  validBetween?: Maybe<ValidBetween>;
  geometry?: Maybe<GeoJson>;
  /** @deprecated Moved to keyValues */
  importedId?: Maybe<Array<Maybe<Scalars['String']>>>;
  keyValues?: Maybe<Array<Maybe<KeyValues>>>;
  polygon?: Maybe<GeoJson>;
};

export type ParkingCapacityInput = {
  parkingUserType?: Maybe<ParkingUserType>;
  parkingVehicleType?: Maybe<ParkingVehicleType>;
  parkingStayType?: Maybe<ParkingStayType>;
  numberOfSpaces?: Maybe<Scalars['BigInteger']>;
  numberOfSpacesWithRechargePoint?: Maybe<Scalars['BigInteger']>;
};

export type KeyValues = {
  key?: Maybe<Scalars['String']>;
  values?: Maybe<Array<Maybe<Scalars['String']>>>;
};

export type StopPlace = StopPlaceInterface & {
  versionComment?: Maybe<Scalars['String']>;
  changedBy?: Maybe<Scalars['String']>;
  topographicPlace?: Maybe<TopographicPlace>;
  validBetween?: Maybe<ValidBetween>;
  alternativeNames?: Maybe<Array<Maybe<AlternativeName>>>;
  tariffZones?: Maybe<Array<Maybe<TariffZone>>>;
  tags?: Maybe<Array<Maybe<Tag>>>;
  groups?: Maybe<Array<Maybe<GroupOfStopPlaces>>>;
  placeEquipments?: Maybe<PlaceEquipments>;
  /** This field is set either on StopPlace (i.e. all Quays are equal), or on every Quay. */
  accessibilityAssessment?: Maybe<AccessibilityAssessment>;
  publicCode?: Maybe<Scalars['String']>;
  privateCode?: Maybe<PrivateCode>;
  modificationEnumeration?: Maybe<ModificationEnumerationType>;
  id?: Maybe<Scalars['String']>;
  name?: Maybe<EmbeddableMultilingualString>;
  shortName?: Maybe<EmbeddableMultilingualString>;
  description?: Maybe<EmbeddableMultilingualString>;
  version?: Maybe<Scalars['String']>;
  geometry?: Maybe<GeoJson>;
  /** @deprecated Moved to keyValues */
  importedId?: Maybe<Array<Maybe<Scalars['String']>>>;
  keyValues?: Maybe<Array<Maybe<KeyValues>>>;
  polygon?: Maybe<GeoJson>;
  transportMode?: Maybe<TransportModeType>;
  submode?: Maybe<SubmodeType>;
  stopPlaceType?: Maybe<StopPlaceType>;
  weighting?: Maybe<InterchangeWeightingType>;
  parentSiteRef?: Maybe<Scalars['String']>;
  /** Any references to another SITE of which this STOP PLACE is deemed to be a nearby but distinct. */
  adjacentSites?: Maybe<Array<Maybe<VersionLessEntityRef>>>;
  quays?: Maybe<Array<Maybe<Quay>>>;
};

/** Check if authorized for entity with role */
export type AuthorizationCheck = {
  /** The identificatior for entity */
  id?: Maybe<Scalars['String']>;
  /** The relevant roles for the given ID */
  roles?: Maybe<Array<Maybe<Scalars['String']>>>;
};

/** Geometry-object as specified in the GeoJSON-standard (http://geojson.org/geojson-spec.html). */
export type GeoJsonInput = {
  type: GeoJsonType;
  coordinates: Scalars['Coordinates'];
};

export type CreateMultiModalStopPlaceInput = {
  name: EmbeddableMultilingualStringInput;
  description?: Maybe<EmbeddableMultilingualStringInput>;
  versionComment?: Maybe<Scalars['String']>;
  geometry?: Maybe<GeoJsonInput>;
  validBetween?: Maybe<ValidBetweenInput>;
  stopPlaceIds: Array<Maybe<Scalars['String']>>;
};

export enum NameType {
  Alias = 'alias',
  Translation = 'translation',
  Copy = 'copy',
  Label = 'label',
  Other = 'other'
}

export type QuayInput = {
  /** Ignore when creating new */
  id?: Maybe<Scalars['String']>;
  name?: Maybe<EmbeddableMultilingualStringInput>;
  shortName?: Maybe<EmbeddableMultilingualStringInput>;
  publicCode?: Maybe<Scalars['String']>;
  privateCode?: Maybe<PrivateCodeInput>;
  description?: Maybe<EmbeddableMultilingualStringInput>;
  geometry?: Maybe<GeoJsonInput>;
  alternativeNames?: Maybe<Array<Maybe<AlternativeNameInput>>>;
  placeEquipments?: Maybe<PlaceEquipmentsInput>;
  keyValues?: Maybe<Array<Maybe<KeyValuesInput>>>;
  /** This field is set either on StopPlace (i.e. all Quays are equal), or on every Quay. */
  accessibilityAssessment?: Maybe<AccessibilityAssessmentInput>;
  compassBearing?: Maybe<Scalars['BigDecimal']>;
};

export enum CycleStorageType {
  Racks = 'racks',
  Bars = 'bars',
  Railings = 'railings',
  CycleScheme = 'cycleScheme',
  Other = 'other'
}

/** Transfer durations in seconds */
export type TransferDuration = {
  /** Default duration in seconds */
  defaultDuration?: Maybe<Scalars['Int']>;
  /** Frequent traveller duration in seconds */
  frequentTravellerDuration?: Maybe<Scalars['Int']>;
  /** Occasional traveller duration in seconds */
  occasionalTravellerDuration?: Maybe<Scalars['Int']>;
  /** Mobility restriced traveller duration in seconds */
  mobilityRestrictedTravellerDuration?: Maybe<Scalars['Int']>;
};

/** The version of the referenced entity. */
export type EntityRef = {
  ref?: Maybe<Scalars['String']>;
  version?: Maybe<Scalars['String']>;
  addressablePlace?: Maybe<AddressablePlace>;
};

export type StopPlaceInput = {
  /** Ignore when creating new */
  id?: Maybe<Scalars['String']>;
  name?: Maybe<EmbeddableMultilingualStringInput>;
  shortName?: Maybe<EmbeddableMultilingualStringInput>;
  publicCode?: Maybe<Scalars['String']>;
  privateCode?: Maybe<PrivateCodeInput>;
  description?: Maybe<EmbeddableMultilingualStringInput>;
  geometry?: Maybe<GeoJsonInput>;
  alternativeNames?: Maybe<Array<Maybe<AlternativeNameInput>>>;
  placeEquipments?: Maybe<PlaceEquipmentsInput>;
  keyValues?: Maybe<Array<Maybe<KeyValuesInput>>>;
  /** This field is set either on StopPlace (i.e. all Quays are equal), or on every Quay. */
  accessibilityAssessment?: Maybe<AccessibilityAssessmentInput>;
  transportMode?: Maybe<TransportModeType>;
  submode?: Maybe<SubmodeType>;
  stopPlaceType?: Maybe<StopPlaceType>;
  topographicPlace?: Maybe<TopographicPlaceInput>;
  weighting?: Maybe<InterchangeWeightingType>;
  parentSiteRef?: Maybe<Scalars['String']>;
  versionComment?: Maybe<Scalars['String']>;
  quays?: Maybe<Array<Maybe<QuayInput>>>;
  validBetween?: Maybe<ValidBetweenInput>;
  /** List of tariff zone references without version */
  tariffZones?: Maybe<Array<Maybe<VersionLessEntityRefInput>>>;
  /** Any references to another SITE of which this STOP PLACE is deemed to be a nearby but distinct. */
  adjacentSites?: Maybe<Array<Maybe<VersionLessEntityRefInput>>>;
};

export type AccessibilityLimitations = {
  id?: Maybe<Scalars['String']>;
  version?: Maybe<Scalars['String']>;
  wheelchairAccess?: Maybe<LimitationStatusType>;
  stepFreeAccess?: Maybe<LimitationStatusType>;
  escalatorFreeAccess?: Maybe<LimitationStatusType>;
  liftFreeAccess?: Maybe<LimitationStatusType>;
  audibleSignalsAvailable?: Maybe<LimitationStatusType>;
};

/** Geometry-object as specified in the GeoJSON-standard (http://geojson.org/geojson-spec.html). */
export type GeoJson = {
  type?: Maybe<GeoJsonType>;
  coordinates?: Maybe<Scalars['Coordinates']>;
};


export type PathLinkEnd = {
  id?: Maybe<Scalars['String']>;
  placeRef?: Maybe<EntityRef>;
};

export type GeneralSignInput = {
  privateCode?: Maybe<PrivateCodeInput>;
  content?: Maybe<EmbeddableMultilingualStringInput>;
  signContentType?: Maybe<SignContentType>;
};
