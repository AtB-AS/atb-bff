/*
 *  This is the return type from the reachable endpoint from the distances API
 *  The keys are stop place IDs and the values are distances. The distance is
 *  an abstract distance (not necessarily geographical distance), used to calculate
 *  prices at Entur.
 */
export type DistancesResult = Record<string, number>;
