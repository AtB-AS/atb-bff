import {ReqRefDefaults, Request} from '@hapi/hapi';
import {PRODUCT_BASEURL, SALES_BASEURL} from '../../../config/env';
import {BookingTraveller} from '../../../types/trips';
import {TripPatternFragment} from '../fragments/journey-gql/trips.graphql-gen';
import {ErrorResponse} from '@atb-as/utils';
import {get, post} from '../../../utils/fetch-client';
import {Result} from '@badrap/result';
import {APIError} from '../../../utils/api-error';
import {
  BookingAvailabilityType,
  PreassignedFareProductSubsetType,
  ReservationProductSubsetType,
  TicketOffer,
  TicketOffers,
} from '../../types';

export type BookingInfo = {
  availability: BookingAvailabilityType;
  offer?: TicketOffer;
};

export const getBookingInfo = async (
  request: Request<ReqRefDefaults>,
  trip: TripPatternFragment,
  travellers: BookingTraveller[],
  products: string[],
  supplementProducts: string[],
): Promise<Result<BookingInfo, APIError>> => {
  try {
    const response = await fetchOffers(
      request,
      trip,
      travellers,
      products,
      supplementProducts,
    );
    const data = await response.json();
    if (!response.ok) {
      const errorResponse = ErrorResponse.safeParse(data).data;
      if (errorResponse?.kind === 'NO_AVAILABLE_OFFERS_DUE_TO_BEING_SOLD_OUT') {
        return Result.ok({
          availability: BookingAvailabilityType.SoldOut,
        });
      }
      if (
        errorResponse?.kind ===
        'NO_AVAILABLE_OFFERS_DUE_TO_PURCHASE_WINDOW_BEING_CLOSED'
      ) {
        return Result.ok({
          availability: BookingAvailabilityType.Closed,
        });
      }
      console.error(
        `Unexpected error fetching offers for trip: ${JSON.stringify(data)}`,
      );
      return Result.ok({
        availability: BookingAvailabilityType.Unknown,
      });
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
        return Result.ok({
          availability: BookingAvailabilityType.BookingNotSupported,
        });
      }
      const offer = offers.data[0];
      const totalTravellerCount = travellers.reduce(
        (sum, traveller) => sum + traveller.count,
        0,
      );
      return Result.ok({
        offer,
        availability: mapToAvailabilityStatus(offer, totalTravellerCount),
      });
    }
  } catch (error) {
    return Result.err(new APIError(error));
  }
  return Result.ok({
    availability: BookingAvailabilityType.Unknown,
  });
};

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

function authHeaders(request: Request<ReqRefDefaults>) {
  return {
    'Content-Type': 'application/json',
    'Atb-App-Version': request.headers['atb-app-version'],
    'Atb-Distribution-Channel': request.headers['atb-distribution-channel'],
    'X-Endpoint-API-UserInfo': request.headers['x-endpoint-api-userinfo'],
    Authorization: request.headers.authorization,
  };
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
    {headers: authHeaders(request)},
    SALES_BASEURL,
  );
}

async function fetchProducts(request: Request<ReqRefDefaults>) {
  return get<PreassignedFareProductSubsetType[]>(
    '/product/v1',
    request,
    {headers: authHeaders(request)},
    PRODUCT_BASEURL,
  );
}

async function fetchSupplementProducts(request: Request<ReqRefDefaults>) {
  return get<ReservationProductSubsetType[]>(
    '/product/v1/supplement',
    request,
    {headers: authHeaders(request)},
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
