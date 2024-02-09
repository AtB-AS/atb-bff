import * as Types from '../../../../graphql/journey/journeyplanner-types_v3';

import { DocumentNode } from 'graphql';
import gql from 'graphql-tag';
export type BookingArrangementFragment = { bookingMethods?: Array<Types.BookingMethod>, latestBookingTime?: any, bookingNote?: string, bookWhen?: Types.PurchaseWhen, minimumBookingPeriod?: string, bookingContact?: { contactPerson?: string, email?: string, url?: string, phone?: string, furtherDetails?: string } };

export const BookingArrangementFragmentDoc = gql`
    fragment bookingArrangement on BookingArrangement {
  bookingMethods
  latestBookingTime
  bookingNote
  bookWhen
  latestBookingTime
  minimumBookingPeriod
  bookingContact {
    contactPerson
    email
    url
    phone
    furtherDetails
  }
}
    `;
export type Requester<C = {}> = <R, V>(doc: DocumentNode, vars?: V, options?: C) => Promise<R> | AsyncIterable<R>
export function getSdk<C>(requester: Requester<C>) {
  return {

  };
}
export type Sdk = ReturnType<typeof getSdk>;