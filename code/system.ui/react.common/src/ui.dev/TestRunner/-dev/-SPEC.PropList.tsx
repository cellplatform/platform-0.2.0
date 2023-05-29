import { Dev, t, Pkg, Time } from '../../../test.ui';

import type { TestRunnerPropListProps } from '../Runner.PropList';
import type { TestCtx } from './-types.mjs';

const PropList = Dev.TestRunner.PropList;
const DEFAULTS = PropList.DEFAULTS;

type T = {
  ctx: TestCtx;
  props: TestRunnerPropListProps;
  debug: {
    card: boolean;
    infoUrl: boolean;
    fields?: t.TestRunnerField[];
  };
};
const initial: T = {
  ctx: { fail: false },
  props: {},
  debug: {
    card: true,
    infoUrl: true,
    fields: DEFAULTS.fields,
  },
};

export default Dev.describe('TestRunner.PropList', (e) => {
  type LocalStore = T['debug'];
  const localstore = Dev.LocalStorage<LocalStore>('dev:sys.common.TestRunner.PropList');
  const local = localstore.object({
    infoUrl: initial.debug.infoUrl,
    fields: initial.debug.fields,
    card: initial.debug.card,
  });

  e.it('ui:init', async (e) => {
    const ctx = Dev.ctx(e);
    const state = await ctx.state<T>(initial);

    await state.change((d) => {
      d.debug.infoUrl = local.infoUrl;
      d.debug.fields = local.fields;
      d.debug.card = local.card;
    });

    const get: t.GetTestSuite = async () => {
      const m1 = await import('./-TEST.sample-1.mjs');
      const m2 = await import('./-TEST.sample-2.mjs');

      const root = await Dev.bundle([m1.default, m2.default]);
      const ctx = state.current.ctx;
      await Time.wait(800); // Sample delay.
      return { root, ctx };
    };

    const getSize = (): [number, null] => [state.current.debug.card ? 330 : 250, null];

    ctx.subject
      .backgroundColor(0)
      .size(getSize())
      .display('grid')

      .render<T>((e) => {
        const { debug } = e.state;
        const infoUrl = debug.infoUrl ? '?dev=sys.ui.dev.TestRunner.Results' : undefined;
        const data: t.TestRunnerPropListData = {
          pkg: Pkg,
          run: { infoUrl, get },
          specs: [import('./-TEST.sample-1.mjs'), import('./-TEST.sample-2.mjs')],
        };

        return <Dev.TestRunner.PropList fields={debug.fields} data={data} card={debug.card} />;
      });
  });

  e.it('ui:debug', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    const state = await dev.state();

    dev.section('FieldSelector', (dev) => {
      dev.row((e) => {
        return (
          <Dev.TestRunner.PropList.FieldSelector
            style={{ Margin: [10, 40, 10, 30] }}
            selected={e.state.debug.fields}
            onClick={(ev) => {
              const fields = ev.next as t.TestRunnerField[];
              dev.change((d) => (d.debug.fields = fields));
              local.fields = fields?.length === 0 ? undefined : fields;
            }}
          />
        );
      });
    });

    dev.hr(5, [10, 20]);

    dev.section('Options', (dev) => {
      dev.boolean((btn) =>
        btn
          .label((e) => `infoUrl ← (${e.state.debug.infoUrl ? 'showing' : 'hidden'})`)
          .value((e) => e.state.debug.infoUrl)
          .onClick((e) => e.change((d) => (local.infoUrl = Dev.toggle(d.debug, 'infoUrl')))),
      );

      dev.boolean((btn) =>
        btn
          .label((e) => `card`)
          .value((e) => e.state.debug.card)
          .onClick((e) => e.change((d) => (local.card = Dev.toggle(d.debug, 'card')))),
      );
    });
  });

  e.it('ui:footer', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    dev.footer.border(-0.1).render<T>((e) => {
      const data = e.state;
      return <Dev.Object name={'TestRunner.PropList'} data={data} expand={1} />;
    });
  });
});
