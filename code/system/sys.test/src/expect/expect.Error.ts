import { expect } from './expect';

/**
 * Checks for an error within an async function.
 * Example:
 *    Return the result of this function to the test-runner (mocha).
 *
 *        it('should throw', () =>
 *            expectError(async () => {
 *
 *                 <...code that throws here...>
 *
 *          }, 'my error message'));
 *
 */
export async function expectError(fn: () => Promise<any>, message?: string) {
  try {
    await fn();
  } catch (error: any) {
    if (message) {
      return expect(error.message || '').to.contain(message);
    } else {
      return error;
    }
  }
  const msg = message
    ? `Should fail with error message '${message || ''}'`
    : 'Should fail with error';
  return expect(undefined).to.be.a('Error', msg);
}
