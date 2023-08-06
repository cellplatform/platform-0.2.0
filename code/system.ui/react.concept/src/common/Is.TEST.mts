import { expect, Test } from '../test.ui';
import { Is } from '.';

export default Test.describe('Is (flags)', (e) => {
  e.it('is.namespace', (e) => {
    const test = (input: any, expected: boolean) => {
      const actual = Is.namespace(input);
      expect(actual).to.eql(expected);
    };
    test({ namespace: 'foo' }, true);
    [null, undefined, '', 123, false, [], {}, { foo: 123 }].forEach((value) => test(value, false));
  });

  e.it('is.slug', (e) => {
    const test = (input: any, expected: boolean) => {
      const actual = Is.slug(input);
      expect(actual).to.eql(expected);
    };
    test({ id: 'foo', kind: 'MySlugType' }, true);
    [null, undefined, '', 123, false, [], { namespace: 'foo' }].forEach((value) =>
      test(value, false),
    );
  });
});
