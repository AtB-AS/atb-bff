import * as Types from '../../../../graphql/journey/journeyplanner-types_v3';

import { StopPlaceFragment } from './stop-places.graphql-gen';
import { TariffZoneFragment } from './tariff-zones.graphql-gen';
import { SituationFragment } from './situations.graphql-gen';
import { DocumentNode } from 'graphql';
import gql from 'graphql-tag';
import { StopPlaceFragmentDoc } from './stop-places.graphql-gen';
import { TariffZoneFragmentDoc } from './tariff-zones.graphql-gen';
import { SituationFragmentDoc } from './situations.graphql-gen';
export type QuayFragment = { id: string, name: string, publicCode?: string, description?: string, stopPlace?: StopPlaceFragment, tariffZones: Array<TariffZoneFragment> };

export type QuayWithSituationsFragment = (
  { situations: Array<SituationFragment> }
  & QuayFragment
);

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
  description
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
export type Requester<C = {}> = <R, V>(doc: DocumentNode, vars?: V, options?: C) => Promise<R> | AsyncIterable<R>
export function getSdk<C>(requester: Requester<C>) {
  return {

  };
}
export type Sdk = ReturnType<typeof getSdk>;