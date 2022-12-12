import groupBy from 'lodash.groupby';
import sortBy from 'lodash.sortby';
import {
  TransportMode,
  TransportSubmode
} from '../../../../graphql/journeyplanner-types_v3';
import { FavoriteDeparture } from '../../../types';
import { GroupsByIdQuery } from '../journey-gql/jp3/departure-group.graphql-gen';
import { SituationFragment } from '../../fragments/jp3/situations.graphql-gen';
import {NoticeFragment} from "../../fragments/jp3/notices.graphql-gen";

type Notice = { text?: string };

type DepartureLineInfo = {
  lineName: string;
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
  situations: SituationFragment[];
  serviceJourneyId?: string;
  serviceDate: string;
  notices: NoticeFragment[];
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
  situations: SituationFragment[];
};

type QuayGroup = {
  quay: QuayInfo;
  group: DepartureGroup[];
};

export type StopPlaceGroup = {
  stopPlace: StopPlaceInfo;
  quays: QuayGroup[];
};

function toKey(lineId?: string, frontText?: String) {
  return [lineId ?? '', frontText ?? ''].join('-&-');
}

export default function mapQueryToGroups(
  stopPlaces?: GroupsByIdQuery['stopPlaces'],
  favorites?: FavoriteDeparture[]
): StopPlaceGroup[] {
  if (!stopPlaces) {
    return [];
  }

  const isFavorite = (item: DepartureLineInfo, stopId: string) =>
    !favorites ||
    favorites.some(
      f =>
        (!f.lineName || item.lineName === f.lineName) &&
        item.lineId === f.lineId &&
        stopId === f.stopId &&
        (!f.quayId || item.quayId === f.quayId)
    );

  return stopPlaces.filter(Boolean).map(function (stopPlace) {
    const { quays, ...stopPlaceInfo } = stopPlace;
    const quayGroups =
      quays?.map(function (quay) {
        const { times, estimatedCalls, ...quayInfo } = quay;
        const groups = groupBy(times, item =>
          toKey(
            item.serviceJourney?.line.id,
            item.destinationDisplay?.frontText
          )
        );
        const lineInfoGroups = groupBy(estimatedCalls, item =>
          toKey(
            item.serviceJourney?.line.id,
            item.destinationDisplay?.frontText
          )
        );

        let lines: QuayGroup['group'] = [];

        for (let [lineGroup, times] of Object.entries(groups)) {
          const lineInfoEntry = lineInfoGroups[lineGroup]?.[0];
          if (!lineInfoEntry) {
            continue;
          }

          const lineInfo: DepartureLineInfo = {
            lineName: lineInfoEntry.destinationDisplay?.frontText ?? '',
            lineNumber: lineInfoEntry.serviceJourney?.line.publicCode ?? '',
            transportMode: lineInfoEntry.serviceJourney?.line.transportMode,
            transportSubmode:
              lineInfoEntry.serviceJourney?.line.transportSubmode,
            quayId: quay.id,
            notices: (lineInfoEntry.notices as Notice[]) ?? [],
            lineId: lineInfoEntry.serviceJourney?.line.id ?? ''
          };

          if (!isFavorite(lineInfo, stopPlaceInfo.id)) {
            continue;
          }

          const departures = times.map<DepartureTime>(function (time) {
            const notices = [
              ...(time.notices || []),
              ...(lineInfoEntry.serviceJourney?.notices || []),
              ...(lineInfoEntry.serviceJourney?.journeyPattern?.notices || []),
              ...(lineInfoEntry.serviceJourney?.line.notices || [])
            ];
            return {
              time: time.expectedDepartureTime,
              aimedTime: time.aimedDepartureTime,
              predictionInaccurate: time.predictionInaccurate,
              realtime: time.realtime,
              situations: time.situations,
              serviceJourneyId: time.serviceJourney?.id,
              serviceDate: time.date,
              notices
            };
          });

          lines.push({
            lineInfo,
            departures
          });
        }

        return {
          quay: quayInfo,
          group: lines
        };
      }) ?? [];

    return {
      stopPlace: stopPlaceInfo,
      quays: sortBy(quayGroups, [
        group => sortByNumberIfPossible(group.quay.publicCode),
        group => group.quay.id
      ])
    };
  });
}

function sortByNumberIfPossible(val?: string) {
  if (!val) return val;
  const parsed = parseInt(val, 10);
  if (Number.isNaN(parsed)) {
    return val;
  }
  return parsed;
}
