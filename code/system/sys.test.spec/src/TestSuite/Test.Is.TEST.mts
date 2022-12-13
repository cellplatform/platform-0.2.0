import { Test } from '.';
import { describe, expect, it } from '../test';
import { Is } from './Test.Is.mjs';
import { TestModel } from './TestModel.mjs';

describe('Is (flags)', () => {
  it('Test.Is', () => {
    expect(Test.Is).to.equal(Is);
  });

  it('Is.suite', () => {
    const test = (input: any, expected: boolean) => {
      expect(Is.suite(input)).to.eql(expected);
    };

    test(undefined, false);
    test(null, false);
    test('', false);
    test(true, false);
    test(123, false);
    test([123], false);
    test({}, false);
    test(TestModel({ parent: Test.describe('foo'), description: 'name' }), false);

    test('TestSuite.1234', true);
    test(Test.describe('foo'), true);
  });

  it('Is.test', () => {
    const description = 'foo';
    const parent = Test.describe('root');

    const test = (input: any, expected: boolean) => {
      expect(Is.test(input)).to.eql(expected);
    };

    test(undefined, false);
    test(null, false);
    test('', false);
    test(true, false);
    test(123, false);
    test([123], false);
    test({}, false);
    test(Test.describe('foo'), false);

    test('Test.1234', true);
    test(TestModel({ parent, description }), true);
  });
});
