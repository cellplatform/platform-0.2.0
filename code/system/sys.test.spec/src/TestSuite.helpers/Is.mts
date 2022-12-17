import { Is as core } from 'sys.util';

export const Is = {
  promise: core.promise,

  suite(input: any): boolean {
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

  test(input: any): boolean {
    if (typeof input === 'string' && input.startsWith('Test.')) return true;
    if (typeof input !== 'object' || input === null) return false;
    if (typeof input.id !== 'string') return false;
    return input.kind === 'Test' && typeof input.run === 'function';
  },

  testArgs(input: any): boolean {
    if (input === null || typeof input !== 'object') return false;
    return Is.test(input.id);
  },
};
