import * as Types from '../../../../graphql/journeyplanner-types_v3';

import { DocumentNode } from 'graphql';
import gql from 'graphql-tag';
import { NoticeFragmentDoc } from './notices.graphql-gen';
import { EstimatedCallWithQuayFragmentDoc } from './estimated-calls.graphql-gen';
export type ServiceJourneyWithEstCallsFragment = { id: string, transportMode?: Types.TransportMode, transportSubmode?: Types.TransportSubmode, publicCode?: string, line: { publicCode?: string }, notices: Array<{ text?: string }>, estimatedCalls?: Array<{ actualArrivalTime?: any, actualDepartureTime?: any, aimedArrivalTime: any, aimedDepartureTime: any, cancellation: boolean, date?: any, expectedDepartureTime: any, expectedArrivalTime: any, forAlighting: boolean, forBoarding: boolean, realtime: boolean, destinationDisplay?: { frontText?: string }, quay?: { id: string, name: string, publicCode?: string, situations: Array<{ id: string, situationNumber?: string, reportType?: Types.ReportType, summary: Array<{ language?: string, value: string }>, description: Array<{ language?: string, value: string }> }>, stopPlace?: { id: string, name: string, latitude?: number, longitude?: number }, tariffZones: Array<{ id: string, name?: string }> }, notices: Array<{ text?: string }>, situations: Array<{ id: string, situationNumber?: string, reportType?: Types.ReportType, summary: Array<{ language?: string, value: string }>, description: Array<{ language?: string, value: string }> }> }> };

export const ServiceJourneyWithEstCallsFragmentDoc = gql`
    fragment serviceJourneyWithEstCalls on ServiceJourney {
  id
  transportMode
  transportSubmode
  publicCode
  line {
    publicCode
  }
  notices {
    ...notice
  }
  estimatedCalls(date: $date) {
    ...estimatedCallWithQuay
  }
}
    ${NoticeFragmentDoc}
${EstimatedCallWithQuayFragmentDoc}`;
export type Requester<C = {}, E = unknown> = <R, V>(doc: DocumentNode, vars?: V, options?: C) => Promise<R>
export function getSdk<C, E>(requester: Requester<C, E>) {
  return {

  };
}
export type Sdk = ReturnType<typeof getSdk>;