import {ReqRefDefaults, Request} from '@hapi/hapi';
import {PRODUCT_BASEURL, SALES_BASEURL} from '../../../config/env';
import {BookingTraveller} from '../../../types/trips';
import {TripPatternFragment} from '../fragments/journey-gql/trips.graphql-gen';
import {z} from 'zod';
import {ErrorResponse} from '@atb-as/utils';
import {post, get} from '../../../utils/fetch-client';
import {isDefined} from '../stop-places/utils';

export const getBookingInfo = async (
  request: Request<ReqRefDefaults>,
  trip: TripPatternFragment,
  travellers: BookingTraveller[],
  products: string[],
  supplementProducts: string[],
): Promise<{
  availability: BookingAvailabilityType;
  offer?: TicketOffer;
}> => {
  try {
    let supplementProductsIds: string[] = supplementProducts;

    // This is a hack until the release of 1.79.1, where the app properly sends supplementProducts
    if (supplementProductsIds.length === 0 && products.length === 0) {
      const allProducts = await fetchProducts(request);
      const allSupplementProducts = await fetchSupplementProducts(request);
      const existingProductIds = travellers
        .map((t) => t.productIds)
        .flat()
        .filter(isDefined);
      supplementProductsIds = existingProductIds
        .flatMap((productId) =>
          lookupSupplementProducts(
            productId,
            allProducts,
            allSupplementProducts,
          ),
        )
        .map((sp) => sp.id);
    }

    const response = await fetchOffers(
      request,
      trip,
      travellers,
      products,
      supplementProductsIds,
    );
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
      console.error(
        `Unexpected error fetching offers for trip: ${JSON.stringify(data)}`,
      );
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
  fareProduct: z.string().nullish(),
  validFrom: z.string().nullish(),
  validTo: z.string().nullish(),
  flexDiscountLadder: z.any().nullish(),
  route: z.any(),
  shouldStartNow: z.boolean(),
  available: z.number().nullish(),
});
export type TicketOffer = z.infer<typeof TicketOffer>;

export const TicketOffers = z.array(TicketOffer);


// TODO: Clean up and move types, utils and API calls into a reasonable file structure
export const LimitationsSubset = z.object({
  supplementProductRefs: z.array(z.string()).nullish(),
});

export const PreassignedFareProductSubset = z.object({
  id: z.string(),
  limitations: LimitationsSubset,
  isBookingEnabled: z.boolean().nullish(),
  isSupplementProduct: z.boolean().nullish(),
});
type PreassignedFareProductSubsetType = z.infer<
  typeof PreassignedFareProductSubset
>;

export const ReservationProductSubset = z.object({
  id: z.string(),
  kind: z.literal('reservation'),
});
type ReservationProductSubsetType = z.infer<typeof ReservationProductSubset>;

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
  supplementProducts: string[],
) {
  const body = {
    travellers,
    travelDate: trip.expectedStartTime,
    products,
    supplementProducts,
    legs: trip.legs.map((leg) => ({
      fromStopPlaceId: leg.fromPlace.quay?.stopPlace?.id,
      toStopPlaceId: leg.toPlace.quay?.stopPlace?.id,
      serviceJourneyId: leg.serviceJourney?.id,
      mode: leg.mode,
      travelDate: leg.expectedStartTime.split('T')[0],
    })),
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

async function fetchProducts(request: Request<ReqRefDefaults>) {
  return get<PreassignedFareProductSubsetType[]>(
    '/product/v1',
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
    PRODUCT_BASEURL,
  );
}

async function fetchSupplementProducts(request: Request<ReqRefDefaults>) {
  return get<ReservationProductSubsetType[]>(
    '/product/v1/supplement',
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
    PRODUCT_BASEURL,
  );
}

function lookupSupplementProducts(
  productId: string,
  allProducts: PreassignedFareProductSubsetType[],
  allSupplementProducts: ReservationProductSubsetType[],
) {
  const product = allProducts.find((p) => p.id === productId);
  if (!product) return [];

  return allSupplementProducts.filter((sp) =>
    product.limitations.supplementProductRefs?.includes(sp.id),
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
