import { Http, HttpUrl } from '.';
import { describe, expect, it } from '../test';

describe('Http', () => {
  it('exports from API', () => {
    expect(Http.Url).to.equal(HttpUrl);
  });

  describe('create', () => {
    it('simple', () => {
      const res1 = Http.Url.create('http://localhost');
      const res2 = Http.Url.create('http://localhost');
      const res3 = Http.Url.create('https://domain.com/foo?abc=123');
      expect(res1).to.not.equal(res2); // NB: different instance.
      expect(res1.href).to.eql('http://localhost/');
      expect(res3.pathname).to.eql('/foo');
      expect(res3.search).to.eql('?abc=123');
    });

    it('with params', () => {
      const res1 = Http.Url.create('https://d.com', {});
      const res2 = Http.Url.create('https://d.com?', { foo: 123 });
      const res3 = Http.Url.create('https://d.com?bar=true', { foo: 123, bar: false });
      expect(res1.search).to.eql('');
      expect(res2.search).to.eql('?foo=123');
      expect(res3.search).to.eql('?bar=false&foo=123');
    });
  });

  describe('origin (host)', () => {
    it('strips path', () => {
      const host = Http.Url.origin('  https://d.com/foobar?s=123  ');
      expect(host.origin).to.eql('https://d.com');
    });

    it('path', () => {
      const host = Http.Url.origin(' https://d.com ');
      expect(host.path('').href).to.eql('https://d.com/');
      expect(host.path('  ').href).to.eql('https://d.com/');
      expect(host.path('foo/bar').href).to.eql('https://d.com/foo/bar');
      expect(host.path('/foo/bar').href).to.eql('https://d.com/foo/bar');
      expect(host.path('///foo/bar/').href).to.eql('https://d.com/foo/bar/');
      expect(host.path('foo?bar=123').href).to.eql('https://d.com/foo?bar=123');
    });

    it('path with {params}', () => {
      const host = Http.Url.origin('https://d.com');
      expect(host.path('', { foo: 123 }).href).to.eql('https://d.com/?foo=123');
      expect(host.path('foo?bar=123', { bar: 456, s: true }).href).to.eql(
        'https://d.com/foo?bar=456&s=true',
      );
    });
  });
});
