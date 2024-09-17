import { describe, expect, it } from '../common/mod.ts';
import { Http } from './mod.ts';

describe('Http.Url', () => {
  describe('create', () => {
    it('factory methods', () => {
      const base = 'https://foo.com/v1';
      const a = Http.Url.create(base);
      const b = Http.url(base);
      expect(a.base).to.eql(base);
      expect(b.base).to.eql(base);
      expect(a.toString()).to.eql(base);
    });

    it('trailing forward-slash', () => {
      const url = Http.url('https://foo.com');
      expect(url.base).to.eql('https://foo.com/');
    });

    it('localhost (http)', () => {
      const url = Http.url('http://localhost:8080');
      expect(url.base).to.eql('http://localhost:8080/');
    });

    it('throw: invalid URL', () => {
      const NON = ['foo', 123, false, null, undefined, Symbol('foo'), BigInt(0)];
      NON.forEach((input: any) => {
        const fn = () => Http.url(input);
        expect(fn).to.throw(/Invalid base URL/);
      });
    });
  });

  it('Url.join', () => {
    const url = Http.url('https://foo.com/v1');
    expect(url.join('foo')).to.eql('https://foo.com/v1/foo');
    expect(url.join('/foo')).to.eql('https://foo.com/v1/foo');
    expect(url.join('///foo')).to.eql('https://foo.com/v1/foo');
    expect(url.join('foo/bar/')).to.eql('https://foo.com/v1/foo/bar/');
    expect(url.join('foo/bar?s=123')).to.eql('https://foo.com/v1/foo/bar?s=123');
  });
});
