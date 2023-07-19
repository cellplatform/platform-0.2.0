import { describe, expect, it } from '../test';
import { WrangleUrl } from '.';

describe('WrangleUrl', () => {
  it('asUrl', () => {
    const href = 'https://d.com/';
    const url = new URL(href);
    expect(WrangleUrl.asUrl(url)).to.equal(url);
    expect(WrangleUrl.asUrl(url).href).to.eql(url.href);
    expect(WrangleUrl.asUrl(url.href)).to.eql(url);
    expect(WrangleUrl.asUrl(href).href).to.eql(url.href);
    expect(WrangleUrl.asUrl(`   ${href}   `).href).to.eql(url.href);
  });

  it('asUrl: throw', () => {
    const test = (input: any) => {
      const fn = () => WrangleUrl.asUrl(input);
      expect(fn).to.throw(/Invalid URL/);
    };

    test('');
    test('.');
    test(undefined);
    test(null);
    test([123]);
  });

  it('matchAsPathOrQuery', () => {
    const test = (href: string, paths: string[], expected: boolean) => {
      const url = new URL(href);
      const res1 = WrangleUrl.matchAsPathOrQuery(url, ...paths);
      const res2 = WrangleUrl.matchAsPathOrQuery(href, ...paths);
      expect(res1).to.eql(expected, href);
      expect(res2).to.eql(expected, href);
    };

    test('https://d.org/', ['foo'], false);
    test('https://d.org/foobar', ['foo'], false);
    test('https://d.org/foobar/', ['foo'], false);
    test('https://d.org/foo', ['foo'], false); // NB: strict "/" path suffix.

    test('https://d.org/foo/', ['foo'], true);
    test('https://d.org/bar/', ['foo', 'bar'], true);
    test('https://d.org/foo/', ['/foo', 'foo/', '/foo/', '//foo//'], true);

    // NB: allows arbitrary route paths to be conveniently loaded on localhost DEV server.
    test('https://d.org/?foo', ['', '  ', 'f', 'fo', 'fooo'], false);
    test('https://d.org/?foobar', ['foo'], false);
    test('https://d.org/?foo', ['yo'], false);

    test('https://d.org/?foo', ['foo'], true);
    test('https://d.org/?bar', ['foo', 'bar'], true);
    test('https://d.org/?foo/', ['foo'], true);
    test('https://d.org/?foo/', ['foo/'], true);
    test('https://d.org/?foo/', ['///foo/', '/foo///'], true);
    test('https://d.org/?/foo', ['foo///'], true);

    test('https://d.org/?foo/bar', ['foo/bar'], true);
    test('https://d.org/?foo/bar/', ['foo/bar'], true);
  });
});
