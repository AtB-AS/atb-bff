import * as Types from '../../../../graphql/journey-types';

import gql from 'graphql-tag';

export type ByIdQueryVariables = Types.Exact<{
  ids: Array<Types.Maybe<Types.Scalars['String']>>;
  startTime: Types.Scalars['DateTime'];
  timeRange: Types.Scalars['Int'];
  limit: Types.Scalars['Int'];
}>;


export type ByIdQuery = { stopPlaces: Array<Types.Maybe<(
    { quays?: Types.Maybe<Array<Types.Maybe<(
      { estimatedCalls: Array<Types.Maybe<EstimatedCallFieldsFragment>> }
      & QuayFieldsFragment
    )>>> }
    & StopPlaceFieldsFragment
  )>> };

export type ByBBoxQueryVariables = Types.Exact<{
  minLat: Types.Scalars['Float'];
  minLng: Types.Scalars['Float'];
  maxLng: Types.Scalars['Float'];
  maxLat: Types.Scalars['Float'];
  timeRange: Types.Scalars['Int'];
  startTime: Types.Scalars['DateTime'];
  limit: Types.Scalars['Int'];
}>;


export type ByBBoxQuery = { stopPlacesByBbox: Array<Types.Maybe<(
    { quays?: Types.Maybe<Array<Types.Maybe<(
      { estimatedCalls: Array<Types.Maybe<EstimatedCallFieldsFragment>> }
      & QuayFieldsFragment
    )>>> }
    & StopPlaceFieldsFragment
  )>> };

export type EstimatedCallFieldsFragment = { actualArrivalTime?: Types.Maybe<any>, actualDepartureTime?: Types.Maybe<any>, aimedArrivalTime?: Types.Maybe<any>, aimedDepartureTime?: Types.Maybe<any>, cancellation?: Types.Maybe<boolean>, date?: Types.Maybe<any>, expectedDepartureTime?: Types.Maybe<any>, expectedArrivalTime?: Types.Maybe<any>, forAlighting?: Types.Maybe<boolean>, forBoarding?: Types.Maybe<boolean>, predictionInaccurate?: Types.Maybe<boolean>, realtime?: Types.Maybe<boolean>, requestStop?: Types.Maybe<boolean>, destinationDisplay?: Types.Maybe<{ frontText?: Types.Maybe<string> }>, notices: Array<Types.Maybe<NoticeFieldsFragment>>, quay?: Types.Maybe<QuayFieldsFragment>, serviceJourney?: Types.Maybe<ServiceJourneyFieldsFragment>, situations: Array<Types.Maybe<SituationFieldsFragment>> };

export type NoticeFieldsFragment = { text?: Types.Maybe<string> };

export type QuayFieldsFragment = { id: string, name: string, description?: Types.Maybe<string>, publicCode?: Types.Maybe<string>, latitude?: Types.Maybe<number>, longitude?: Types.Maybe<number>, situations: Array<Types.Maybe<SituationFieldsFragment>>, stopPlace?: Types.Maybe<StopPlaceFieldsFragment> };

export type SituationFieldsFragment = { situationNumber?: Types.Maybe<string>, reportType?: Types.Maybe<Types.ReportType>, summary: Array<{ language?: Types.Maybe<string>, value?: Types.Maybe<string> }>, description: Array<{ language?: Types.Maybe<string>, value?: Types.Maybe<string> }>, advice: Array<{ language?: Types.Maybe<string>, value?: Types.Maybe<string> }>, detail: Array<{ language?: Types.Maybe<string>, value?: Types.Maybe<string> }>, lines: Array<Types.Maybe<LineFieldsFragment>>, validityPeriod?: Types.Maybe<{ startTime?: Types.Maybe<any>, endTime?: Types.Maybe<any> }>, infoLinks?: Types.Maybe<Array<Types.Maybe<{ uri?: Types.Maybe<string>, label?: Types.Maybe<string> }>>> };

export type LineFieldsFragment = { description?: Types.Maybe<string>, flexibleLineType?: Types.Maybe<Types.FlexibleLineType>, id: string, name?: Types.Maybe<string>, publicCode?: Types.Maybe<string>, transportMode?: Types.Maybe<Types.TransportMode>, transportSubmode?: Types.Maybe<Types.TransportSubmode>, bookingArrangements?: Types.Maybe<BookingArrangementFieldsFragment>, notices: Array<Types.Maybe<NoticeFieldsFragment>> };

export type BookingArrangementFieldsFragment = { bookingMethods?: Types.Maybe<Array<Types.Maybe<Types.BookingMethod>>>, bookingNote?: Types.Maybe<string>, minimumBookingPeriod?: Types.Maybe<string>, bookingContact?: Types.Maybe<{ phone?: Types.Maybe<string>, url?: Types.Maybe<string> }> };

export type StopPlaceFieldsFragment = { id: string, description?: Types.Maybe<string>, name: string, latitude?: Types.Maybe<number>, longitude?: Types.Maybe<number>, wheelchairBoarding?: Types.Maybe<Types.WheelchairBoarding>, weighting?: Types.Maybe<Types.InterchangeWeighting>, transportMode?: Types.Maybe<Types.TransportMode>, transportSubmode?: Types.Maybe<Types.TransportSubmode>, tariffZones: Array<Types.Maybe<{ id?: Types.Maybe<string> }>> };

export type ServiceJourneyFieldsFragment = { id: string, directionType?: Types.Maybe<Types.DirectionType>, publicCode?: Types.Maybe<string>, privateCode?: Types.Maybe<string>, transportSubmode?: Types.Maybe<Types.TransportSubmode>, journeyPattern?: Types.Maybe<{ line: LineFieldsFragment, notices: Array<Types.Maybe<NoticeFieldsFragment>> }>, notices: Array<Types.Maybe<NoticeFieldsFragment>> };

export const NoticeFieldsFragmentDoc = gql`
    fragment noticeFields on Notice {
  text
}
    `;
export const BookingArrangementFieldsFragmentDoc = gql`
    fragment bookingArrangementFields on BookingArrangement {
  bookingMethods
  bookingNote
  minimumBookingPeriod
  bookingContact {
    phone
    url
  }
}
    `;
export const LineFieldsFragmentDoc = gql`
    fragment lineFields on Line {
  bookingArrangements {
    ...bookingArrangementFields
  }
  description
  flexibleLineType
  id
  name
  notices {
    ...noticeFields
  }
  publicCode
  transportMode
  transportSubmode
}
    ${BookingArrangementFieldsFragmentDoc}
${NoticeFieldsFragmentDoc}`;
export const SituationFieldsFragmentDoc = gql`
    fragment situationFields on PtSituationElement {
  situationNumber
  summary {
    language
    value
  }
  description {
    language
    value
  }
  advice {
    language
    value
  }
  detail {
    language
    value
  }
  lines {
    ...lineFields
  }
  validityPeriod {
    startTime
    endTime
  }
  reportType
  infoLinks {
    uri
    label
  }
}
    ${LineFieldsFragmentDoc}`;
export const StopPlaceFieldsFragmentDoc = gql`
    fragment stopPlaceFields on StopPlace {
  id
  description
  name
  latitude
  longitude
  wheelchairBoarding
  weighting
  transportMode
  transportSubmode
  tariffZones {
    id
  }
}
    `;
export const QuayFieldsFragmentDoc = gql`
    fragment quayFields on Quay {
  id
  name
  description
  publicCode
  latitude
  longitude
  situations {
    ...situationFields
  }
  stopPlace {
    ...stopPlaceFields
  }
}
    ${SituationFieldsFragmentDoc}
${StopPlaceFieldsFragmentDoc}`;
export const ServiceJourneyFieldsFragmentDoc = gql`
    fragment serviceJourneyFields on ServiceJourney {
  id
  directionType
  journeyPattern {
    line {
      ...lineFields
    }
    notices {
      ...noticeFields
    }
  }
  notices {
    ...noticeFields
  }
  publicCode
  privateCode
  transportSubmode
}
    ${LineFieldsFragmentDoc}
${NoticeFieldsFragmentDoc}`;
export const EstimatedCallFieldsFragmentDoc = gql`
    fragment estimatedCallFields on EstimatedCall {
  actualArrivalTime
  actualDepartureTime
  aimedArrivalTime
  aimedDepartureTime
  cancellation
  date
  destinationDisplay {
    frontText
  }
  expectedDepartureTime
  expectedArrivalTime
  forAlighting
  forBoarding
  notices {
    ...noticeFields
  }
  predictionInaccurate
  quay {
    ...quayFields
  }
  realtime
  requestStop
  serviceJourney {
    ...serviceJourneyFields
  }
  situations {
    ...situationFields
  }
}
    ${NoticeFieldsFragmentDoc}
${QuayFieldsFragmentDoc}
${ServiceJourneyFieldsFragmentDoc}
${SituationFieldsFragmentDoc}`;
export const ByIdDocument = gql`
    query ById($ids: [String]!, $startTime: DateTime!, $timeRange: Int!, $limit: Int!) {
  stopPlaces(ids: $ids) {
    ...stopPlaceFields
    quays(filterByInUse: true) {
      ...quayFields
      estimatedCalls(startTime: $startTime, timeRange: $timeRange, numberOfDepartures: $limit, omitNonBoarding: false, includeCancelledTrips: false) {
        ...estimatedCallFields
      }
    }
  }
}
    ${StopPlaceFieldsFragmentDoc}
${QuayFieldsFragmentDoc}
${EstimatedCallFieldsFragmentDoc}`;
export const ByBBoxDocument = gql`
    query ByBBox($minLat: Float!, $minLng: Float!, $maxLng: Float!, $maxLat: Float!, $timeRange: Int!, $startTime: DateTime!, $limit: Int!) {
  stopPlacesByBbox(minimumLatitude: $minLat, minimumLongitude: $minLng, maximumLatitude: $maxLat, maximumLongitude: $maxLng) {
    ...stopPlaceFields
    quays(filterByInUse: true) {
      ...quayFields
      estimatedCalls(startTime: $startTime, timeRange: $timeRange, numberOfDepartures: $limit, omitNonBoarding: false, includeCancelledTrips: false) {
        ...estimatedCallFields
      }
    }
  }
}
    ${StopPlaceFieldsFragmentDoc}
${QuayFieldsFragmentDoc}
${EstimatedCallFieldsFragmentDoc}`;