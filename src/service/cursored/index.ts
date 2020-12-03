import { stringify } from 'querystring';

type NextCursorData = {
  nextCursor?: string;
  hasNextPage: boolean;
};

export type CursoredData<T> = {
  data: T;
  metadata:
    | { hasNextPage: false }
    | {
        hasNextPage: true;
        nextCursor: string;
        nextUrlParams: string;
      };
};

export type CursorInput = {
  cursor?: string;
  pageSize?: number;
};

export type CursoredQuery<T> = CursorInput & T;

export function generateCursorData<T>(
  data: T,
  nextCursorData?: NextCursorData,
  query?: CursoredQuery<unknown>
): CursoredData<T> {
  const metadata: CursoredData<T>['metadata'] = !nextCursorData?.hasNextPage
    ? {
        hasNextPage: false
      }
    : {
        hasNextPage: true,
        nextCursor: nextCursorData.nextCursor!,
        nextUrlParams: stringify({
          ...query,
          cursor: nextCursorData.nextCursor!
        })
      };

  return {
    data,
    metadata
  };
}
