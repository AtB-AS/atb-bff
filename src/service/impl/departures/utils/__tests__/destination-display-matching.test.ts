import {destinationDisplaysAreMatching} from '../favorites';

const ddSrcOrig = {
  frontText: 'Hallset via sentrum',
  via: [],
};

const ddSrcNew = {
  frontText: 'Hallset',
  via: ['sentrum'],
};

const ddFavoriteOrig = {
  frontText: 'Hallset via sentrum',
  via: [],
};

const ddFavoriteNew = {
  frontText: 'Hallset',
  via: ['sentrum'],
};

const ddFavoriteSubstringOther = {
  frontText: 'Hallset',
  via: [],
};

const ddDashedViaOrig = {
  frontText: 'Lund via Lade-sentrum-Kolstad',
  via: [],
};

const ddDashedViaNew = {
  frontText: 'Lund',
  via: ['Lade', 'sentrum', 'Kolstad'],
};

describe('match destinationDisplays with via as string array or in frontText', () => {
  it('matches original formats', () => {
    expect(destinationDisplaysAreMatching(ddSrcOrig, ddFavoriteOrig)).toBe(
      true,
    );
  });

  it('matches the original format from src with the new format from favorite', () => {
    expect(destinationDisplaysAreMatching(ddSrcNew, ddFavoriteOrig)).toBe(true);
  });

  it('matches the new format from src with the original format from favorite', () => {
    expect(destinationDisplaysAreMatching(ddSrcOrig, ddFavoriteNew)).toBe(true);
  });

  it('matches the new format from src with the new format from favorite', () => {
    expect(destinationDisplaysAreMatching(ddSrcNew, ddFavoriteNew)).toBe(true);
  });

  it('does not match another for a frontText substring', () => {
    expect(
      destinationDisplaysAreMatching(ddSrcNew, ddFavoriteSubstringOther),
    ).toBe(false);
  });

  it('matches the original format from src with the new format from favorite with a dash in the via text', () => {
    expect(
      destinationDisplaysAreMatching(ddDashedViaOrig, ddDashedViaNew),
    ).toBe(true);
  });
});
