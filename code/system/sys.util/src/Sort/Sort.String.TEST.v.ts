import { expect, describe, it } from '../test';
import { naturalCompare } from './Sort.String.naturalCompare';
import { Sort } from '.';

/**
 *
 *  REF:
 *    https://github.com/nwoltman/string-natural-compare
 *
 */
describe('ManifestFiles: naturalCompare', () => {
  it('exposed from [Sort] index', () => {
    expect(Sort.String.naturalCompare).to.equal(naturalCompare);
  });

  it('simple, case-sensitive sorting', () => {
    const files = ['z1.doc', 'z10.doc', 'z17.doc', 'z2.doc', 'z23.doc', 'z3.doc'];
    files.sort(naturalCompare);
    expect(files).to.eql(['z1.doc', 'z2.doc', 'z3.doc', 'z10.doc', 'z17.doc', 'z23.doc']);
  });

  it('case-insensitive sorting', () => {
    const chars = ['B', 'C', 'a', 'd'];
    const compare = (a: string, b: string) => naturalCompare(a, b, { caseInsensitive: true });
    chars.sort(compare);
    expect(chars).to.eql(['a', 'B', 'C', 'd']);
  });

  it('compare strings containing large numbers', () => {
    const res = naturalCompare(
      '1165874568735487968325787328996865',
      '265812277985321589735871687040841',
    );
    expect(res).to.eql(1);
  });

  it('sorting an array of objects', () => {
    const rooms = [
      { street: '350 5th Ave', room: 'A-21046-b' },
      { street: '350 5th Ave', room: 'A-1021' },
    ];

    // Sort by street (case-insensitive), then by room (case-sensitive)
    rooms.sort(
      (a, b) =>
        naturalCompare(a.street, b.street, { caseInsensitive: true }) ||
        naturalCompare(a.room, b.room),
    );

    expect(rooms[0].room).to.eql('A-1021');
    expect(rooms[1].room).to.eql('A-21046-b');
  });

  it('using a custom alphabet (Russian alphabet)', () => {
    const russianOpts = {
      alphabet: 'АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯабвгдеёжзийклмнопрстуфхцчшщъыьэюя',
    };
    const list = ['Ё', 'А', 'б', 'Б'];
    list.sort((a, b) => naturalCompare(a, b, russianOpts));
    expect(list).to.eql(['А', 'Б', 'Ё', 'б']);
  });
});
