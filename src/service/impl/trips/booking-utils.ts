import {ReqRefDefaults, Request} from '@hapi/hapi';
import {API_BASE_URL} from '../../../config/env';
import {BookingTraveller} from '../../../types/trips';
import {TripPatternFragment} from '../fragments/journey-gql/trips.graphql-gen';
import {z} from 'zod';
import {getErrorResponse} from '../../../utils/api-error';
import {post} from '../../../utils/fetch-client';

export const getBookingInfo = async (
  trip: TripPatternFragment,
  travellers: BookingTraveller[],
  products: string[],
  headers: Request<ReqRefDefaults>,
): Promise<{
  availability: BookingAvailabilityType;
  offer?: TicketOffer;
}> => {
  try {
    const response = await fetchOffers(trip, travellers, products, headers);
    const data = await response.json();
    if (!response.ok) {
      let errorResponse = getErrorResponse(data);
      if (errorResponse?.kind === 'NO_AVAILABLE_OFFERS_DUE_TO_BEING_SOLD_OUT') {
        return {
          availability: BookingAvailabilityType.SoldOut,
        };
      }
      if (
        errorResponse?.kind ===
        'NO_AVAILABLE_OFFERS_DUE_TO_PURCHASE_WINDOW_BEING_CLOSED'
      ) {
        return {
          availability: BookingAvailabilityType.Closed,
        };
      }
      console.error(`Unexpected error fetching offers for trip: ${data}`);
      return {
        availability: BookingAvailabilityType.Unknown,
      };
    }
    const offers = TicketOffers.safeParse(data.offers);
    if (!offers.success) {
      console.error(`Invalid offers data: ${offers.error}`);
    }
    if (offers.success) {
      const offer = getSingleOffer(offers.data);
      return {
        offer,
        availability: mapToAvailabilityStatus(offer),
      };
    }
  } catch (error) {
    console.error(error);
  }
  return {
    availability: BookingAvailabilityType.Unknown,
  };
};

export enum BookingAvailabilityType {
  /** The product supports booking and has available seats */
  Available = 'available',
  /** The product does not support booking */
  BookingNotSupported = 'booking_not_supported',
  /** No more seats are available for booking */
  SoldOut = 'sold_out',
  /** The product supports booking, but ticket sale isn't currently open */
  Closed = 'closed',
  /** Fallback state for unhandled errors */
  Unknown = 'unknown',
}

export const SearchOfferPrice = z.object({
  originalAmount: z.string(),
  originalAmountFloat: z.number().nullish(),
  amount: z.string(),
  amountFloat: z.number().nullish(),
  currency: z.string(),
  vatGroup: z.string().nullish(),
});
export type SearchOfferPrice = z.infer<typeof SearchOfferPrice>;
export const TicketOffer = z.object({
  offerId: z.string(),
  travellerId: z.string(),
  price: SearchOfferPrice,
  fareProduct: z.string(),
  validFrom: z.string().nullish(),
  validTo: z.string().nullish(),
  flexDiscountLadder: z.any().nullish(),
  route: z.any(),
  shouldStartNow: z.boolean(),
  available: z.number().nullish(),
});
export type TicketOffer = z.infer<typeof TicketOffer>;

export const TicketOffers = z.array(TicketOffer);
export type TicketOffers = z.infer<typeof TicketOffers>;

function mapToAvailabilityStatus(
  offer: TicketOffer | undefined,
): BookingAvailabilityType {
  if (!offer) {
    // No offer means ticket sale is closed
    return BookingAvailabilityType.Closed;
  }
  if (offer.available === undefined || offer.available === null) {
    return BookingAvailabilityType.BookingNotSupported;
  }
  if (offer.available === 0) {
    return BookingAvailabilityType.SoldOut;
  }
  return BookingAvailabilityType.Available;
}

function getSingleOffer(offers: TicketOffers): TicketOffer | undefined {
  return offers.sort((a, b) => {
    if (a.price.amountFloat && b.price.amountFloat) {
      return a.price.amountFloat - b.price.amountFloat;
    }
    return 0;
  })[0];
}

async function fetchOffers(
  trip: TripPatternFragment,
  travellers: BookingTraveller[],
  products: string[],
  headers: Request<ReqRefDefaults>,
) {
  return await post(
    `/sales/v1/search/trip-pattern`,
    {
      travellers,
      travelDate: trip.expectedStartTime,
      products,
      legs: trip.legs.map((leg) => ({
        fromStopPlaceId: leg.fromPlace.quay?.stopPlace?.id,
        toStopPlaceId: leg.toPlace.quay?.stopPlace?.id,
        serviceJourneyId: leg.serviceJourney?.id,
        mode: leg.mode,
        travelDate: leg.expectedStartTime.split('T')[0],
      })),
    },
    headers,
    {
      headers: {
        'Content-Type': 'application/json',
        'Atb-App-Version': headers.headers['atb-app-version'],
        'Atb-Distribution-Channel': headers.headers['atb-distribution-channel'],
        Authorization: headers.headers.authorization,
      },
    },
    API_BASE_URL,
  );
}
