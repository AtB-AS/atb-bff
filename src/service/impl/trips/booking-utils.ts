import {ReqRefDefaults, Request} from '@hapi/hapi';
import {SALES_BASEURL} from '../../../config/env';
import {BookingTraveller} from '../../../types/trips';
import {TripPatternFragment} from '../fragments/journey-gql/trips.graphql-gen';
import {z} from 'zod';
import {ErrorResponse} from '@atb-as/utils';
import {post} from '../../../utils/fetch-client';

export const getBookingInfo = async (
  request: Request<ReqRefDefaults>,
  trip: TripPatternFragment,
  travellers: BookingTraveller[],
  products: string[],
  existingProduct?: string,
): Promise<{
  availability: BookingAvailabilityType;
  offer?: TicketOffer;
}> => {
  try {
    const response = await fetchOffers(request, trip, travellers, products, existingProduct);
    const data = await response.json();
    if (!response.ok) {
      let errorResponse = ErrorResponse.safeParse(data).data;
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
      const travellerCounts = reduceToTravellerCount(offers.data);
      if (travellerCounts.find((count) => count > 1)) {
        /*
         * For now we only support booking with a single offer for each traveller,
         * since the app is not ready for multiple offers yet.
         */
        return {
          availability: BookingAvailabilityType.BookingNotSupported,
        };
      }
      const offer = offers.data[0];
      const totalTravellerCount = travellers.reduce(
        (sum, traveller) => sum + traveller.count,
        0,
      );
      return {
        offer,
        availability: mapToAvailabilityStatus(offer, totalTravellerCount),
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

function mapToAvailabilityStatus(
  offer: TicketOffer | undefined,
  totalPassengerCount: number,
): BookingAvailabilityType {
  if (!offer) {
    // No offer means ticket sale is closed
    return BookingAvailabilityType.Closed;
  }
  if (offer.available === undefined || offer.available === null) {
    return BookingAvailabilityType.BookingNotSupported;
  }
  if (offer.available < totalPassengerCount) {
    return BookingAvailabilityType.SoldOut;
  }
  return BookingAvailabilityType.Available;
}

async function fetchOffers(
  request: Request<ReqRefDefaults>,
  trip: TripPatternFragment,
  travellers: BookingTraveller[],
  products: string[],
  existingProduct?: string,
) {
  const body = {
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
    existingProduct
  };
  return await post(
    `/sales/v1/search/trip-pattern`,
    body,
    request,
    {
      headers: {
        'Content-Type': 'application/json',
        'Atb-App-Version': request.headers['atb-app-version'],
        'Atb-Distribution-Channel': request.headers['atb-distribution-channel'],
        'X-Endpoint-API-UserInfo': request.headers['x-endpoint-api-userinfo'],
        Authorization: request.headers.authorization,
      },
    },
    SALES_BASEURL,
  );
}

function reduceToTravellerCount(offers: TicketOffer[]): number[] {
  const travellerCountMap = offers.reduce(
    (acc, offer) => {
      acc[offer.travellerId] = (acc[offer.travellerId] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );
  return Object.values(travellerCountMap);
}
