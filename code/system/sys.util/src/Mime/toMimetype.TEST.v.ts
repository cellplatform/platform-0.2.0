import { expect, describe, it } from '../test';
import { toMimetype } from './toMimetype';

describe('toMimetype (content-type)', () => {
  it('no match - defaultType', () => {
    const res = toMimetype('foo', 'text/plain');
    expect(res).to.eql('text/plain');
  });

  it('no match - <empty>', () => {
    const res = toMimetype('foo');
    expect(res).to.eql('');
  });

  it('matches', () => {
    const test = (input: string, expected: string) => {
      const res = toMimetype(input);
      expect(res).to.eql(expected);
    };

    test('  foo.js  ', 'application/javascript'); // NB: whitespace.
    test('foo.js', 'application/javascript');
    test('foo.json', 'application/json');
    test('foo.wasm', 'application/wasm');

    test('foo.yml', 'text/plain');
    test('foo.yaml', 'text/plain');
    test('foo.txt', 'text/plain');

    test('foo.css', 'text/css');

    test('foo.html', 'text/html');
    test('foo.htm', 'text/html');

    test('foo.jpg', 'image/jpeg');
    test('foo.jpeg', 'image/jpeg');
    test('foo.gif', 'image/gif');
    test('foo.svg', 'image/svg+xml');

    test('foo.webm', 'video/webm');

    test('foo.zip', 'application/zip');
    test('foo.pdf', 'application/pdf');

    test('foo.csv', 'text/csv');
    test('foo.tsv', 'text/csv');
  });
});
