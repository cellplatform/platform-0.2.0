import { Test } from '../index.mjs';
import { t, describe, expect, it } from '../test';
import { TestModel } from '../TestSuite/TestModel.mjs';
import { Is } from './Is.mjs';

describe('Is (flags)', () => {
  it('Test.Is', () => {
    expect(Test.Is).to.equal(Is);
  });

  it('Is.suite', () => {
    const test = (input: any, expected: boolean) => {
      expect(Is.suite(input)).to.eql(expected);
    };

    [undefined, null, '', true, 123, [], {}].forEach((value) => test(value, false));
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

    [undefined, null, '', true, 123, [], {}].forEach((value) => test(value, false));
    test(Test.describe('foo'), false);

    test('Test.1234', true);
    test(TestModel({ parent, description }), true);
  });

  it('Is.testArgs', async () => {
    let _args: t.TestHandlerArgs | undefined;
    const suite = Test.describe('root', (e) => {
      e.it('test', (e) => (_args = e));
    });

    await suite.run();

    const test = (input: any, expected: boolean) => {
      expect(Is.testArgs(input)).to.eql(expected);
    };

    [undefined, null, '', true, 123, [], {}].forEach((value) => test(value, false));
    test(_args, true);
  });
});
