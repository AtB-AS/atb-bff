import * as Types from '../../../../graphql/journey/journeyplanner-types_v3';

import { DocumentNode } from 'graphql';
import gql from 'graphql-tag';
import { StopPlaceFragmentDoc } from './stop-places.graphql-gen';
import { TariffZoneFragmentDoc } from './tariff-zones.graphql-gen';
import { SituationFragmentDoc } from './situations.graphql-gen';
export type QuayFragment = { id: string, name: string, publicCode?: string, stopPlace?: { id: string, name: string, latitude?: number, longitude?: number }, tariffZones: Array<{ id: string, name?: string }> };

export type QuayWithSituationsFragment = { id: string, name: string, publicCode?: string, situations: Array<{ id: string, situationNumber?: string, reportType?: Types.ReportType, summary: Array<{ language?: string, value: string }>, description: Array<{ language?: string, value: string }>, advice: Array<{ language?: string, value: string }>, infoLinks?: Array<{ uri: string, label?: string }>, validityPeriod?: { startTime?: any, endTime?: any } }>, stopPlace?: { id: string, name: string, latitude?: number, longitude?: number }, tariffZones: Array<{ id: string, name?: string }> };

export const QuayFragmentDoc = gql`
    fragment quay on Quay {
  id
  name
  publicCode
  stopPlace {
    ...stopPlace
  }
  tariffZones {
    ...tariffZone
  }
}
    ${StopPlaceFragmentDoc}
${TariffZoneFragmentDoc}`;
export const QuayWithSituationsFragmentDoc = gql`
    fragment quayWithSituations on Quay {
  ...quay
  situations {
    ...situation
  }
}
    ${QuayFragmentDoc}
${SituationFragmentDoc}`;
export type Requester<C = {}, E = unknown> = <R, V>(doc: DocumentNode, vars?: V, options?: C) => Promise<R>
export function getSdk<C, E>(requester: Requester<C, E>) {
  return {

  };
}
export type Sdk = ReturnType<typeof getSdk>;