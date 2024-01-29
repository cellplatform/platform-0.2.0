import { Func } from '.';
import { describe, expect, expectError, it } from '../test';

describe('Func', () => {
  it('no params: fn()', async () => {
    type R = { msg: string };

    const fn = Func.import<R>(async () => {
      const m = (await import('../test/sample/ModuleA')).default;
      const msg = `foo:${m.name}`;
      return async () => ({ msg });
    });

    const res = await fn();
    expect(res.msg).to.eql('foo:ModuleA');
  });

  it('params: fn({ ... })', async () => {
    type R = number;
    type P = { sum?: number[] };

    const fn = Func.import<R, P>(async (args) => {
      const m = await import('../test/sample/ModuleA');
      return async (e) => m.ModuleA.sum(...(e.sum ?? []));
    });

    const res = await fn({ sum: [1, 2, 3] });
    expect(res).to.eql(6);
  });

  it('runs the loader only once', async () => {
    let loaderCount = 0;
    let runCount = 0;
    const fn = Func.import<number>(async (e) => {
      loaderCount++;
      return async () => {
        runCount++;
        return 0;
      };
    });

    await fn();
    await fn();
    await fn();

    expect(loaderCount).to.eql(1);
    expect(runCount).to.eql(3);
  });

  it('throw: when loader does not return a function', async () => {
    const fn = Func.import(async (e) => null as any);
    await expectError(fn, 'Module loader did not return a function');
  });
});
