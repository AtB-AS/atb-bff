import {DestinationDisplay} from '../../../../graphql/journey/journeyplanner-types_v3';

export function mapToLegacyLineName(
  destinationDisplay: DestinationDisplay | undefined,
): string {
  const frontText = destinationDisplay?.frontText || '';
  const viaPlacesText = destinationDisplay?.via?.join('-') || '';
  return frontText + (viaPlacesText.length > 0 ? ' via ' + viaPlacesText : '');
}

function mapLegacyLineNameToDestinationDisplay(
  legacyLineName: string | undefined,
): DestinationDisplay | undefined {
  if (legacyLineName === undefined) {
    return undefined;
  }
  const [frontText, viaItemsString] = legacyLineName.split(' via ');
  if (viaItemsString === undefined) {
    return {frontText, via: undefined};
  }

  const via = viaItemsString.split(/\s*[/,-]\s*/); // split on "/" and "-" and trim
  return {frontText, via};
}

export function ensureViaFormat(dd?: DestinationDisplay) {
  if (dd?.frontText?.includes(' via ') && (dd?.via?.length || 0) < 1) {
    return mapLegacyLineNameToDestinationDisplay(dd?.frontText);
  } else {
    return dd;
  }
}
