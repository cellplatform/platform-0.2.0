import { type t } from '../common';
import { Is as base } from 'sys.util';

export const Is = {
  promise: base.promise,

  suite(input: any | t.TestSuiteModel): boolean {
    if (typeof input === 'string' && input.startsWith('TestSuite.')) return true;
    if (typeof input !== 'object' || input === null) return false;
    if (typeof input.id !== 'string') return false;
    return (
      input.kind === 'TestSuite' &&
      typeof input.describe === 'function' &&
      typeof input.it === 'function' &&
      typeof input.run === 'function'
    );
  },

  test(input: any | t.TestModel): boolean {
    if (typeof input === 'string' && input.startsWith('Test.')) return true;
    if (typeof input !== 'object' || input === null) return false;
    if (typeof input.id !== 'string') return false;
    return input.kind === 'Test' && typeof input.run === 'function';
  },

  testArgs(input: any | t.TestHandlerArgs): boolean {
    if (input === null || typeof input !== 'object') return false;
    return Is.test(input.id);
  },
};
