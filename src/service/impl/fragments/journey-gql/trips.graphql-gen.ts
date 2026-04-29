import * as Types from '../../../../graphql/journey/journeyplanner-types_v3';

import { LegFragment } from './legs.graphql-gen';
import { DocumentNode } from 'graphql';
import gql from 'graphql-tag';
import { LegFragmentDoc } from './legs.graphql-gen';
export type TripFragment = { nextPageCursor?: string, previousPageCursor?: string, metadata?: { nextDateTime?: any, prevDateTime?: any, searchWindowUsed: number }, tripPatterns: Array<TripPatternFragment> };

export type TripPatternFragment = { expectedStartTime: any, expectedEndTime: any, duration?: any, walkDistance?: number, legs: Array<LegFragment> };

export const TripPatternFragmentDoc = gql`
    fragment tripPattern on TripPattern {
  expectedStartTime
  expectedEndTime
  duration
  walkDistance
  legs {
    ...leg
  }
}
    ${LegFragmentDoc}`;
export const TripFragmentDoc = gql`
    fragment trip on Trip {
  nextPageCursor
  previousPageCursor
  metadata {
    nextDateTime
    prevDateTime
    searchWindowUsed
  }
  tripPatterns {
    ...tripPattern
  }
}
    ${TripPatternFragmentDoc}`;
export type Requester<C = {}> = <R, V>(doc: DocumentNode, vars?: V, options?: C) => Promise<R> | AsyncIterable<R>
export function getSdk<C>(requester: Requester<C>) {
  return {

  };
}
export type Sdk = ReturnType<typeof getSdk>;