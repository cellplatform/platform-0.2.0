import { expect, describe, it } from '../test';
import { Mime } from '.';

describe('Mime', () => {
  it('toType', () => {
    const test = (input: string, expected: string) => {
      const res = Mime.toType(input);
      expect(res).to.eql(expected);
    };

    test('foo.yml', 'text/plain');
    test('foo.yaml', 'text/plain');
    test('foo.txt', 'text/plain');

    test('foo.css', 'text/css');
    test('foo.jpg', 'image/jpeg');
    test('foo.jpeg', 'image/jpeg');
    test('foo.gif', 'image/gif');
    test('foo.svg', 'image/svg+xml');
    test('foo.webm', 'video/webm');

    test('  foo.js  ', 'application/javascript'); // NB: whitespace.
    test('foo.js', 'application/javascript');
    test('foo.json', 'application/json');
  });

  it('isBinary | isText | isJson', () => {
    const test = (input: string, isBinary: boolean, isText: boolean, isJson: boolean) => {
      expect(Mime.isBinary(input)).to.eql(isBinary);
      expect(Mime.isText(input)).to.eql(isText);
      expect(Mime.isJson(input)).to.eql(isJson);
    };

    // Binary
    test('image/jpeg', true, false, false);
    test('image/png', true, false, false);
    test('image/png; charset=utf-8', true, false, false);
    test('video/webm', true, false, false);
    test('application/octet-stream', true, false, false);
    test('application/pdf', true, false, false);
    test('application/javascript', true, false, false);

    // Text
    test('text/plain; charset=utf-8', false, true, false);
    test('text/css;', false, true, false);
    test('text/html', false, true, false);
    test('text/javascript', false, true, false);

    // Json
    test('application/json', false, false, true);
    test('application/json;', false, false, true);
    test('application/json; charset=utf-8', false, false, true);
    test('application/vnd.foo.picture+json', false, false, true);
    test('application/vnd.foo.picture+json; charset=utf-8', false, false, true);
  });
});
