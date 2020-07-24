import { Paginated, PaginationInput } from '../types';

const identity = <T>(i: T): T => i;

export default function paginate<T extends any[] | []>(
  data: T,
  opts: PaginationInput,
  mapFn: (input: T) => T = identity
): Paginated<T> {
  const totalResults = data.length;
  const { pageOffset, pageSize } = opts;
  const nextPageOffset = pageOffset + pageSize;
  const hasNext = nextPageOffset < totalResults;

  const result: Paginated<T> = {
    data: mapFn(data.slice(pageOffset, nextPageOffset) as T),
    hasNext: false,
    totalResults,
    pageSize,
    pageOffset
  };

  if (!hasNext) {
    return result;
  }

  return {
    ...result,
    hasNext: true,
    nextPageOffset
  };
}
