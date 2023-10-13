import {DestinationDisplay} from '../../../../graphql/journey/journeyplanner-types_v3';

export function mapToLegacyLineName(
  destinationDisplay: DestinationDisplay | undefined,
): string {
  const frontText = destinationDisplay?.frontText || '';
  const viaPlacesText = destinationDisplay?.via?.join(' / ') || '';
  return frontText + (viaPlacesText.length > 0 ? ' via ' + viaPlacesText : '');
}
