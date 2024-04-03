import { Http, HttpHeaders } from '.';
import { describe, expect, it, type t } from '../test';

describe('Http.Headers', () => {
  it('exposed from root API', () => {
    expect(Http.Headers).to.equal(HttpHeaders);
  });

  it('HttpHeaders.value', () => {
    const test = (key: string, headers: t.HttpHeaders | Headers | undefined, expected: any) => {
      const res = HttpHeaders.value(headers, key);
      expect(res).to.eql(expected);
    };

    test('foo', undefined, '');
    test('foo', {}, '');

    test('content-type', { 'content-type': 'text/plain' }, 'text/plain');
    test('content-type', { 'Content-Type': 'text/plain' }, 'text/plain');
    test('  content-type  ', { 'Content-Type': 'text/plain' }, 'text/plain');
    test('content-type', { '  Content-Type  ': 'text/plain' }, 'text/plain');

    const headers = HttpHeaders.toRaw({ foo: 'hello' });
    test('foo', headers, 'hello');
    test('Foo', headers, 'hello');
  });

  it('HttpHeaders.toRaw', () => {
    const res1 = HttpHeaders.toRaw();
    const res2 = HttpHeaders.toRaw({});
    const res3 = HttpHeaders.toRaw({ foo: 'hello' });

    expect(res1 instanceof Headers).to.eql(true);

    expect(HttpHeaders.fromRaw(res1)).to.eql({});
    expect(HttpHeaders.fromRaw(res2)).to.eql({});
    expect(HttpHeaders.fromRaw(res3)).to.eql({ foo: 'hello' });
  });

  it('HttpHeaders.toRaw: default content-type', () => {
    const res0 = HttpHeaders.toRaw({});
    const res1 = HttpHeaders.toRaw({}, false);
    const res2 = HttpHeaders.toRaw({}, true);
    const res3 = HttpHeaders.toRaw({}, 'application/json');
    const res4 = HttpHeaders.toRaw({}, 'text/plain');

    const value = HttpHeaders.value;
    expect(value(res0, 'content-type')).to.eql('');
    expect(value(res1, 'content-type')).to.eql('');
    expect(value(res2, 'content-type')).to.eql('application/json');
    expect(value(res3, 'content-type')).to.eql('application/json');
    expect(value(res4, 'content-type')).to.eql('text/plain');
  });

  it('HttpHeaders.fromRaw', () => {
    const input = { foo: '123', bar: 'cheese' };
    const headers = HttpHeaders.toRaw(input);
    expect(Http.Headers.fromRaw(headers)).to.eql(input);
  });
});
