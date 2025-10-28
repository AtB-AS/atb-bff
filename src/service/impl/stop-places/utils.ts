import {Org} from '../../types';

export const onlyUniques = <T>(value: T, index: number, self: T[]) =>
  self.indexOf(value) === index;

export const onlyUniquesBasedOnField =
  <T>(field: keyof T) =>
  (element: T, index: number, array: T[]) =>
    array.findIndex((el) => el[field] === element[field]) === index;

export const isDefined = <T>(value: T): value is NonNullable<T> =>
  value !== undefined && value !== null;

export const orgToEnturOrgNoMap: Record<Org, string> = {
  [Org.atb]: '3',
  [Org.fram]: '71',
  [Org.nfk]: '18',
  [Org.troms]: '72',
};
