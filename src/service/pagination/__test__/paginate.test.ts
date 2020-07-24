import paging from '..';
import { Paginated } from '../../types';

describe('pagination', () => {
  it('limits result by passed in input', async () => {
    expect(
      paging([1, 2, 3], {
        pageOffset: 0,
        pageSize: 2
      }).data
    ).toHaveLength(2);
  });

  it('show second page', async () => {
    expect(
      paging([1, 2, 3], {
        pageOffset: 2,
        pageSize: 2
      }).data
    ).toEqual([3]);
  });

  it('show expected metadata', async () => {
    const data = [1, 2, 3, 4, 5];
    const pageSize = 3;

    const paged = paging(data, {
      pageOffset: 0,
      pageSize
    });

    expect(paged).toEqual<Paginated<number[]>>({
      data: [1, 2, 3],
      hasNext: true,
      nextPageOffset: 3,
      pageOffset: 0,
      pageSize,
      totalResults: 5
    });
  });

  it('calculates correct hasNext', async () => {
    const data = [1, 2, 3, 4, 5, 6];
    const pageSize = 3;

    let paged = paging(data, {
      pageOffset: 0,
      pageSize
    });

    expect(paged).toEqual<Paginated<number[]>>({
      data: [1, 2, 3],
      hasNext: true,
      nextPageOffset: 3,
      pageOffset: 0,
      pageSize,
      totalResults: 6
    });

    paged = paging(data, {
      pageOffset: paged.hasNext ? paged.nextPageOffset : 0,
      pageSize
    });

    expect(paged).toEqual<Paginated<number[]>>({
      data: [4, 5, 6],
      hasNext: false,
      pageOffset: 3,
      pageSize,
      totalResults: 6
    });
  });

  it('calculates correct with odd list length', async () => {
    const data = [1, 2, 3, 4];
    const pageSize = 3;

    let paged = paging(data, {
      pageOffset: 0,
      pageSize
    });

    expect(paged).toEqual<Paginated<number[]>>({
      data: [1, 2, 3],
      hasNext: true,
      nextPageOffset: 3,
      pageOffset: 0,
      pageSize,
      totalResults: 4
    });

    paged = paging(data, {
      pageOffset: paged.hasNext ? paged.nextPageOffset : 0,
      pageSize
    });

    expect(paged).toEqual<Paginated<number[]>>({
      data: [4],
      hasNext: false,
      pageOffset: 3,
      pageSize,
      totalResults: 4
    });
  });
});
