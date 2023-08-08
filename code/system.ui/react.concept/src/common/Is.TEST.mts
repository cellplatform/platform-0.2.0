import { Is } from '.';
import { expect, Test } from '../test.ui';

export default Test.describe('Is (flags)', (e) => {
  e.it('is.namespace', (e) => {
    const test = (input: any, expected: boolean) => {
      const actual = Is.namespace(input);
      expect(actual).to.eql(expected);
    };
    test({ kind: 'slug:namespace', namespace: 'foo' }, true);
    [null, undefined, '', 123, false, [], {}, { foo: 123 }].forEach((value) => test(value, false));
  });

  e.it('is.slug', (e) => {
    const test = (input: any, expected: boolean) => {
      const actual = Is.slug(input);
      expect(actual).to.eql(expected);
    };
    test({ id: 'foo', kind: 'slug:VideoDiagram' }, true);
    [null, undefined, '', 123, false, []].forEach((value) => test(value, false));
    [{ kind: 'slug:namespace', namespace: 'foo' }].forEach((value) => test(value, false));
  });
});
