import { expect, Test } from '../test.ui';
import { Is } from '.';

export default Test.describe('Is (flags)', (e) => {
  e.it('isNamespace', (e) => {
    const test = (input: any, expected: boolean) => {
      const actual = Is.isNamespace(input);
      expect(actual).to.eql(expected);
    };
    test({ namespace: 'foo' }, true);
    [null, undefined, '', 123, false, [], {}, { foo: 123 }].forEach((value) => test(value, false));
  });

  e.it('isSlug', (e) => {
    const test = (input: any, expected: boolean) => {
      const actual = Is.isSlug(input);
      expect(actual).to.eql(expected);
    };
    test({ id: 'foo', kind: 'MySlugType' }, true);
    [null, undefined, '', 123, false, [], { namespace: 'foo' }].forEach((value) =>
      test(value, false),
    );
  });
});
