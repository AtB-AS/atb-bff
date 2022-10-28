import groupBy from 'lodash.groupby';
import sortBy from 'lodash.sortby';
import {
  ReportType,
  TransportMode,
  TransportSubmode
} from '../../../../graphql/journey-types';
import { FavoriteDeparture } from '../../../types';
import { GroupsByIdQuery } from '../journey-gql/jp2/departure-group.graphql-gen';

type Notice = { text?: string };
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
  infoLinks?: Array<{ uri?: string; label?: string }>;
};

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
  situations: Situation[];
  serviceJourneyId?: string;
  serviceDate: string;
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
            return {
              time: time.expectedDepartureTime,
              aimedTime: time.aimedDepartureTime,
              predictionInaccurate: time.predictionInaccurate,
              realtime: time.realtime,
              situations: time.situations,
              serviceJourneyId: time.serviceJourney?.id,
              serviceDate: time.date
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
