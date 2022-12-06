import * as Types from '../../../../graphql/journeyplanner-types_v3';

import { DocumentNode } from 'graphql';
import gql from 'graphql-tag';
import { SituationFragmentDoc } from './situations.graphql-gen';
import { StopPlaceFragmentDoc } from './stop-places.graphql-gen';
import { TariffZoneFragmentDoc } from './tariff-zones.graphql-gen';
export type QuayFragment = { id: string, name: string, publicCode?: string, situations: Array<{ id: string, situationNumber?: string, reportType?: Types.ReportType, summary: Array<{ language?: string, value: string }>, description: Array<{ language?: string, value: string }> }>, stopPlace?: { id: string, name: string, latitude?: number, longitude?: number }, tariffZones: Array<{ id: string, name?: string }> };

export const QuayFragmentDoc = gql`
    fragment quay on Quay {
  id
  name
  publicCode
  situations {
    ...situation
  }
  stopPlace {
    ...stopPlace
  }
  tariffZones {
    ...tariffZone
  }
}
    ${SituationFragmentDoc}
${StopPlaceFragmentDoc}
${TariffZoneFragmentDoc}`;
export type Requester<C = {}, E = unknown> = <R, V>(doc: DocumentNode, vars?: V, options?: C) => Promise<R>
export function getSdk<C, E>(requester: Requester<C, E>) {
  return {

  };
}
export type Sdk = ReturnType<typeof getSdk>;