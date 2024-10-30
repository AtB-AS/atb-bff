/**
 * Compares two app version strings in major.minor.patch format. Will return 1
 * if first argument is greater, 0 if they are equal and -1 if the second
 * argument is greater. If some of the strings are empty, NaN will be returned.
 */
export function compareVersion(versionA: string, versionB: string) {
  if (!versionA || !versionB) return NaN;

  const maxLength = Math.max(versionA.length, versionB.length);

  const splitAndNormalize = (version: string) => {
    const parts = version.split('.').map(Number);
    // Normalize to 3 parts by adding zeros if necessary
    while (parts.length < maxLength) {
      parts.push(0);
    }
    return parts;
  };

  const vA = splitAndNormalize(versionA);
  const vB = splitAndNormalize(versionB);

  // Compare each component
  for (let i = 0; i < maxLength; i++) {
    if (vA[i] > vB[i]) return 1; // versionA is greater
    if (vA[i] < vB[i]) return -1; // versionB is greater
  }

  return 0; // versions are equal
}
