import { expect, t, describe, it } from '../test/index.mjs';
import { Util } from './Util.mjs';

describe('Util', () => {
  it('headerValue', () => {
    const test = (key: string, headers: t.HttpHeaders | undefined, expected: any) => {
      const res = Util.headerValue(key, headers);
      expect(res).to.eql(expected);
    };

    test('foo', undefined, '');
    test('foo', {}, '');

    test('content-type', { 'content-type': 'text/plain' }, 'text/plain');
    test('content-type', { 'Content-Type': 'text/plain' }, 'text/plain');
    test('  content-type  ', { 'Content-Type': 'text/plain' }, 'text/plain');
    test('content-type', { '  Content-Type  ': 'text/plain' }, 'text/plain');
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
});
