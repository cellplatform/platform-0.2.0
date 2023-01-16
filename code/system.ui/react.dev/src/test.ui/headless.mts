import { t, slug, rx, Time } from '../common';
import { DevBus } from '../logic.Bus';

type Milliseconds = number;
type Results = { ok: boolean; elapsed: Milliseconds; specs: ModuleResults[] };
type ModuleResults = { ok: boolean; name: string; results?: t.TestSuiteRunResponse };
type Imports = { [key: string]: () => t.BundleImport };

/**
 * Run a set of tests headlessly.
 * Useful for running within a server-side test suite.
 */
export async function headless(input: Imports): Promise<Results> {
  const timer = Time.timer();
  const imports = Object.values(input);

  const specs: ModuleResults[] = [];
  const response: Results = {
    ok: true,
    elapsed: 0,
    get specs() {
      return specs;
    },
  };

  const wait = imports.map(async (fn) => {
    const name = fn.name;
    const instance = { bus: rx.bus(), id: `headless.${slug()}` };
    const controller = DevBus.Controller({ instance });
    const root = await fn();

    await controller.load.fire(root.default);
    const res = await controller.run.fire();
    controller.dispose();

    const results = res.info?.run.results;
    const ok = results?.ok ?? false;

    if (!ok) {
      results;
    }

    specs.push({ ok, name, results });
  });

  await Promise.all(wait);

  response.elapsed = timer.elapsed.msec;
  response.ok = specs.every((item) => item.ok);
  return response;
}
