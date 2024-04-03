import { describe, expect, it, type t } from '../test';
import { Util } from './u';

describe('Util', () => {
  it('headerValue', () => {
    const test = (key: string, headers: t.HttpHeaders | Headers | undefined, expected: any) => {
      const res = Util.headerValue(key, headers);
      expect(res).to.eql(expected);
    };

    test('foo', undefined, '');
    test('foo', {}, '');

    test('content-type', { 'content-type': 'text/plain' }, 'text/plain');
    test('content-type', { 'Content-Type': 'text/plain' }, 'text/plain');
    test('  content-type  ', { 'Content-Type': 'text/plain' }, 'text/plain');
    test('content-type', { '  Content-Type  ': 'text/plain' }, 'text/plain');

    const headers = Util.toRawHeaders({ foo: 'hello' });
    test('foo', headers, 'hello');
    test('Foo', headers, 'hello');
  });

  it('isFormData', () => {
    const test = (headers: t.HttpHeaders | undefined, expected: boolean) => {
      const res = Util.isFormData(headers);
      expect(res).to.eql(expected);
    };
    test(undefined, false);
    test({}, false);
    test({ foo: 'hello' }, false);
    test({ 'content-type': 'multipart/form-data' }, true);
    test({ ' Content-Type ': '  multipart/form-data  ' }, true);
  });

  it('toRawHeaders', () => {
    const res1 = Util.toRawHeaders();
    const res2 = Util.toRawHeaders({});
    const res3 = Util.toRawHeaders({ foo: 'hello' });

    expect(Util.fromRawHeaders(res1)).to.eql({});
    expect(Util.fromRawHeaders(res2)).to.eql({});
    expect(Util.fromRawHeaders(res3)).to.eql({ foo: 'hello' });
  });

  it('toRawHeaders: default content-type', () => {
    const res1 = Util.toRawHeaders({}, false);
    const res2 = Util.toRawHeaders({}, true);
    const res3 = Util.toRawHeaders({}, 'application/json');
    const res4 = Util.toRawHeaders({}, 'text/plain');

    const headerValue = Util.headerValue;
    expect(headerValue('content-type', res1)).to.eql('');
    expect(headerValue('content-type', res2)).to.eql('application/json');
    expect(headerValue('content-type', res3)).to.eql('application/json');
    expect(headerValue('content-type', res4)).to.eql('text/plain');
  });
});
