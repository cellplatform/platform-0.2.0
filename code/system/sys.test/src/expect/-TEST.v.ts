import { expect, expectError, expectRoughlySame } from '.';
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

describe('expectRoughlySame', () => {
  it('is within tolerance', () => {
    expectRoughlySame(1, 1.25, 0.3);
  });

  it('is outside tolerance', () => {
    const fn = () => expectRoughlySame(1, 1.25, 0.2, 'my error');
    expect(fn).to.throw(/my error/);
  });
});
