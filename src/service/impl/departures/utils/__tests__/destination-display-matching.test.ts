import {destinationDisplaysAreMatching} from '../favorites';

describe('match destinationDisplays with via as string array or in frontText', () => {
  it('matches original formats', () => {
    expect(
      destinationDisplaysAreMatching(
        {frontText: 'Hallset via sentrum', via: []},
        {frontText: 'Hallset via sentrum', via: []},
      ),
    ).toBe(true);
  });

  it('matches the original format from src with the new format from favorite', () => {
    expect(
      destinationDisplaysAreMatching(
        {frontText: 'Hallset', via: ['sentrum']},
        {frontText: 'Hallset via sentrum', via: []},
      ),
    ).toBe(true);
  });

  it('matches the new format from src with the original format from favorite', () => {
    expect(
      destinationDisplaysAreMatching(
        {frontText: 'Hallset via sentrum', via: []},
        {frontText: 'Hallset', via: ['sentrum']},
      ),
    ).toBe(true);
  });

  it('matches the new format from src with the new format from favorite', () => {
    expect(
      destinationDisplaysAreMatching(
        {frontText: 'Hallset', via: ['sentrum']},
        {frontText: 'Hallset', via: ['sentrum']},
      ),
    ).toBe(true);
  });

  it('does not match another for a frontText substring', () => {
    expect(
      destinationDisplaysAreMatching(
        {frontText: 'Hallset', via: ['sentrum']},
        {frontText: 'Hallset', via: []},
      ),
    ).toBe(false);
  });

  it('matches the original format from src with the new format from favorite with a dash in the via text', () => {
    expect(
      destinationDisplaysAreMatching(
        {frontText: 'Lund via Lade-sentrum-Kolstad', via: []},
        {frontText: 'Lund', via: ['Lade', 'sentrum', 'Kolstad']},
      ),
    ).toBe(true);
  });
});
