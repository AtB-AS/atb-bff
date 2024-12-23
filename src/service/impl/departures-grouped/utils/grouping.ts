import groupBy from 'lodash.groupby';
import sortBy from 'lodash.sortby';
import {
  DestinationDisplay,
  ReportType,
  TransportMode,
  TransportSubmode,
} from '../../../../graphql/journey/journeyplanner-types_v3';
import {FavoriteDeparture} from '../../../types';
import {GroupsByIdQuery} from '../journey-gql/departure-group.graphql-gen';
import {destinationDisplaysAreMatching} from '../../departures/utils/favorites';
import {mapToLegacyLineName} from '../../departures/utils/converters';
import {BookingArrangementFragment} from '../../fragments/journey-gql/booking-arrangements.graphql-gen';
import {NoticeFragment} from '../../fragments/journey-gql/notices.graphql-gen';

type Notice = {text?: string};
type Situation = {
  situationNumber?: string;
  reportType?: ReportType;
  summary: Array<{
    language?: string;
    value?: string;
  }>;
  description: Array<{
    language?: string;
    value?: string;
  }>;
  advice: Array<{
    language?: string;
    value?: string;
  }>;
  validityPeriod?: {
    startTime?: any;
    endTime?: any;
  };
  infoLinks?: Array<{uri?: string; label?: string}>;
};

type DepartureLineInfo = {
  /** @deprecated Use destinationDisplay instead */
  lineName: string;
  destinationDisplay: DestinationDisplay;
  lineNumber: string;
  transportMode?: TransportMode;
  transportSubmode?: TransportSubmode;
  quayId: string;
  notices: Notice[];
  lineId: string;
};

type DepartureTime = {
  time: string;
  aimedTime: string;
  realtime?: boolean;
  predictionInaccurate?: boolean;
  situations: Situation[];
  serviceJourneyId?: string;
  serviceDate: string;
  cancellation: boolean;
  bookingArrangements?: BookingArrangementFragment;
  notices?: NoticeFragment[];
};

type DepartureGroup = {
  lineInfo?: DepartureLineInfo;
  departures: DepartureTime[];
};

type StopPlaceInfo = {
  id: string;
  description?: string | undefined;
  name: string;
  latitude?: number | undefined;
  longitude?: number | undefined;
};

type QuayInfo = {
  id: string;
  name: string;
  description?: string | undefined;
  publicCode?: string | undefined;
  latitude?: number | undefined;
  longitude?: number | undefined;
  situations: Situation[];
};

type QuayGroup = {
  quay: QuayInfo;
  group: DepartureGroup[];
};

export type StopPlaceGroup = {
  stopPlace: StopPlaceInfo;
  quays: QuayGroup[];
};

function toKey(lineId?: string, destinationDisplay?: DestinationDisplay) {
  return [
    lineId ?? '',
    destinationDisplay?.frontText ?? '',
    destinationDisplay?.via?.join('-'),
  ].join('-&-');
}

export default function mapQueryToGroups(
  quays: GroupsByIdQuery['quays'],
  favorites: FavoriteDeparture[],
): StopPlaceGroup[] {
  const isFavorite = (item: DepartureLineInfo) =>
    favorites.some(
      (f) =>
        (!f.destinationDisplay ||
          destinationDisplaysAreMatching(
            f.destinationDisplay,
            item.destinationDisplay,
          )) &&
        (!f.lineName || item.lineName === f.lineName) && // kept for backward compatibility
        item.lineId === f.lineId &&
        item.quayId === f.quayId,
    );

  const stopPlaceAndQuays = groupByStopPlace(quays);

  return stopPlaceAndQuays.map(function ({stopPlace, quays}) {
    const quayGroups =
      quays?.map(function (quay) {
        const {times, estimatedCalls, ...quayInfo} = quay;
        const groups = groupBy(times, (item) =>
          toKey(item.serviceJourney?.line.id, item.destinationDisplay),
        );
        const lineInfoGroups = groupBy(estimatedCalls, (item) =>
          toKey(item.serviceJourney?.line.id, item.destinationDisplay),
        );

        let lines: QuayGroup['group'] = [];

        for (let [lineGroup, times] of Object.entries(groups)) {
          const lineInfoEntry = lineInfoGroups[lineGroup]?.[0];
          if (!lineInfoEntry) {
            continue;
          }

          // lineName is included here to support older clients and used for migration purposes by app version >= 1.44
          const lineInfo: DepartureLineInfo = {
            lineName: mapToLegacyLineName(lineInfoEntry.destinationDisplay),
            destinationDisplay: lineInfoEntry.destinationDisplay ?? {},
            lineNumber: lineInfoEntry.serviceJourney?.line.publicCode ?? '',
            transportMode: lineInfoEntry.serviceJourney?.line.transportMode,
            transportSubmode:
              lineInfoEntry.serviceJourney?.line.transportSubmode,
            quayId: quay.id,
            notices: (lineInfoEntry.notices as Notice[]) ?? [],
            lineId: lineInfoEntry.serviceJourney?.line.id ?? '',
          };

          if (!isFavorite(lineInfo)) {
            continue;
          }

          const departures = times.map<DepartureTime>(function (time) {
            return {
              time: time.expectedDepartureTime,
              aimedTime: time.aimedDepartureTime,
              predictionInaccurate: time.predictionInaccurate,
              realtime: time.realtime,
              situations: time.situations,
              serviceJourneyId: time.serviceJourney?.id,
              serviceDate: time.date,
              cancellation: time.cancellation,
              notices: time.notices,
              bookingArrangements: time.bookingArrangements,
            };
          });

          lines.push({
            lineInfo,
            departures,
          });
        }

        return {
          quay: quayInfo,
          group: lines,
        };
      }) ?? [];

    return {
      stopPlace,
      quays: sortBy(quayGroups, [
        (group) => sortByNumberIfPossible(group.quay.publicCode),
        (group) => group.quay.id,
      ]),
    };
  });
}

const groupByStopPlace = (quays: GroupsByIdQuery['quays']) =>
  quays.reduce<
    {
      stopPlace: Required<GroupsByIdQuery['quays'][number]>['stopPlace'];
      quays: GroupsByIdQuery['quays'];
    }[]
  >((grouped, quay) => {
    if (!quay.stopPlace) return grouped;

    const index = grouped.findIndex(
      (g) => g.stopPlace.id === quay.stopPlace?.id,
    );
    if (index >= 0) {
      grouped[index].quays.push(quay);
    } else {
      grouped.push({stopPlace: quay.stopPlace, quays: [quay]});
    }
    return grouped;
  }, []);

function sortByNumberIfPossible(val?: string) {
  if (!val) return val;
  const parsed = parseInt(val, 10);
  if (Number.isNaN(parsed)) {
    return val;
  }
  return parsed;
}
