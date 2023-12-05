import { expectError } from './index';
import { describe, it } from '../test';

describe('expectError', () => {
  const throwError = (message: string) => {
    throw new Error(message);
  };

  it('succeeds (default message)', async () => {
    await expectError(async () => throwError('Foo'));
  });

  it('succeeds (custom message)', async () => {
    await expectError(async () => throwError('Bar'), 'Bar');
  });

  it('fails when error not thrown', async () => {
    await expectError(async () => {
      await expectError(async () => null);
    });
  });
});
