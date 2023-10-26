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

  it('matches original formats with undefined via', () => {
    expect(
      destinationDisplaysAreMatching(
        {frontText: 'Hallset via sentrum', via: undefined},
        {frontText: 'Hallset via sentrum', via: undefined},
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

  it('matches the original format from src with the new format with undefined via from favorite', () => {
    expect(
      destinationDisplaysAreMatching(
        {frontText: 'Hallset', via: ['sentrum']},
        {frontText: 'Hallset via sentrum', via: undefined},
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

  it('matches the new format from src with undefined via with the original format from favorite', () => {
    expect(
      destinationDisplaysAreMatching(
        {frontText: 'Hallset via sentrum', via: undefined},
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

  it('matches the original format from src with a dash in the via text with the new format from favorite', () => {
    expect(
      destinationDisplaysAreMatching(
        {frontText: 'Lund via Lade-sentrum-Kolstad', via: []},
        {frontText: 'Lund', via: ['Lade', 'sentrum', 'Kolstad']},
      ),
    ).toBe(true);
  });

  it('matches the original format from src with a dash and dot and space in the via text with the new format from favorite', () => {
    expect(
      destinationDisplaysAreMatching(
        {frontText: 'Havstad via Lerkendal-St. Olavs H.', via: []},
        {frontText: 'Havstad', via: ['Lerkendal', 'St. Olavs H.']},
      ),
    ).toBe(true);
  });

  it('does not match the original format from src with a dash and dot and space in the via text with only frontText matching', () => {
    expect(
      destinationDisplaysAreMatching(
        {frontText: 'Havstad via Lerkendal-St. Olavs H.', via: []},
        {frontText: 'Havstad', via: []},
      ),
    ).toBe(false);
  });

  it('matches the original format from src with a slash and dot in the frontText with the new format from favorite', () => {
    expect(
      destinationDisplaysAreMatching(
        {frontText: 'Fortuna/Sæterb. via Strindheim', via: []},
        {frontText: 'Fortuna/Sæterb.', via: ['Strindheim']},
      ),
    ).toBe(true);
  });

  it('matches the original format from src with a dash and spaces in the via text with the new format from favorite', () => {
    expect(
      destinationDisplaysAreMatching(
        {frontText: 'Trolla via sentrum - Ila', via: []},
        {frontText: 'Trolla', via: ['sentrum', 'Ila']},
      ),
    ).toBe(true);
  });

  it('matches the original format from src with a slash in the via text with the new format from favorite', () => {
    expect(
      destinationDisplaysAreMatching(
        {frontText: 'Tempe via Brundalen/Jakobsli', via: []},
        {frontText: 'Tempe', via: ['Brundalen', 'Jakobsli']},
      ),
    ).toBe(true);
  });

  it('matches the original format from src with a slash and spaces in the via text with the new format from favorite', () => {
    expect(
      destinationDisplaysAreMatching(
        {frontText: 'Spongdal via Klett / Skjetlein', via: []},
        {frontText: 'Spongdal', via: ['Klett', 'Skjetlein']},
      ),
    ).toBe(true);
  });
});
