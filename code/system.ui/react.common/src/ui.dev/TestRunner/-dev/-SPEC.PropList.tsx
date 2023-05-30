import { Dev, Json, Pkg, Time, t } from '../../../test.ui';

import type { TestRunnerPropListProps } from '../Runner.PropList';
import type { TestCtx } from './-types.mjs';

const PropList = Dev.TestRunner.PropList;
const DEFAULTS = PropList.DEFAULTS;

type P = TestRunnerPropListProps;
type T = {
  ctx: TestCtx;
  props: P;
  debug: { infoUrl?: boolean; ellipsis?: boolean; label?: string };
};
const initial: T = {
  ctx: { fail: false },
  props: {},
  debug: { infoUrl: true, ellipsis: false },
};

export default Dev.describe('TestRunner.PropList', (e) => {
  type LocalStore = Pick<P, 'card' | 'fields'> & T['debug'] & { selected: string[] };
  const localstore = Dev.LocalStorage<LocalStore>('dev:sys.common.TestRunner.PropList');
  const local = localstore.object({
    infoUrl: true,
    ellipsis: false,
    fields: DEFAULTS.fields,
    card: true,
    selected: [],
    label: '',
  });

  e.it('ui:init', async (e) => {
    const ctx = Dev.ctx(e);
    const state = await ctx.state<T>(initial);

    await state.change((d) => {
      d.debug.infoUrl = local.infoUrl;
      d.debug.ellipsis = local.ellipsis;
      d.debug.label = local.label;
      d.props.fields = local.fields;
      d.props.card = local.card;
    });

    const get: t.GetTestSuite = async () => {
      const m1 = await import('./-TEST.sample-1.mjs');
      const m2 = await import('./-TEST.sample-2.mjs');
      const root = await Dev.bundle([m1.default, m2.default]);
      const ctx = state.current.ctx;
      await Time.wait(800); // Sample delay.
      return { root, ctx };
    };

    const getSize = (): [number, null] => [state.current.props.card ? 330 : 250, null];

    const controller = await Dev.TestRunner.PropList.controller({
      pkg: Pkg,
      run: { get },
      specs: {
        all: [
          import('./-TEST.sample-1.mjs'),
          import('./-TEST.sample-2.mjs'),
          import('./-TEST.controller.mjs'),
        ],
        selected: local.selected,
        onChange(e) {
          console.info('⚡️ onChange:', e); // NB: Bubbled up AFTER controller.
        },
      },
    });

    const updateData = () => state.change((d) => (d.props.data = controller.current));
    updateData();
    controller.$.subscribe((e) => {
      updateData();
      if (e.op === 'selection') local.selected = e.data.specs?.selected ?? [];
    });

    ctx.host.tracelineColor(-0.05);
    ctx.subject
      .backgroundColor(0)
      .size(getSize())
      .display('grid')
      .render<T>((e) => {
        const { props, debug } = e.state;
        const data = Json.Patch.change(props.data ?? {}, (d) => {
          d.run!.infoUrl = debug.infoUrl ? '?dev=sys.ui.dev.TestRunner.PropList' : undefined;
          d.run!.label = debug.label || undefined;
          d.specs!.ellipsis = debug.ellipsis;
        }).to;
        return <Dev.TestRunner.PropList {...props} data={data} />;
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
            selected={e.state.props.fields}
            onClick={(ev) => {
              const fields = ev.next as t.TestRunnerField[];
              dev.change((d) => (d.props.fields = fields));
              local.fields = fields?.length === 0 ? undefined : fields;
            }}
          />
        );
      });
    });

    dev.hr(5, [10, 20]);

    dev.section('Options', (dev) => {
      dev.textbox((txt) =>
        txt
          .left(true)
          .margin([0, 0, 5, 0])
          .placeholder('run.label')
          .value((e) => e.state.debug.label)
          .onChange((e) => e.change((d) => (local.label = d.debug.label = e.to.value))),
      );

      dev.boolean((btn) =>
        btn
          .label((e) => `infoUrl ← (${e.state.debug.infoUrl ? 'showing' : 'hidden'})`)
          .value((e) => e.state.debug.infoUrl)
          .onClick((e) => e.change((d) => (local.infoUrl = Dev.toggle(d.debug, 'infoUrl')))),
      );

      dev.boolean((btn) =>
        btn
          .label((e) => `ellipsis`)
          .value((e) => Boolean(e.state.debug.ellipsis))
          .onClick((e) => e.change((d) => (local.ellipsis = Dev.toggle(d.debug, 'ellipsis')))),
      );

      dev.hr(-1, 5);

      dev.boolean((btn) =>
        btn
          .label((e) => `card`)
          .value((e) => e.state.props.card)
          .onClick((e) => e.change((d) => (local.card = Dev.toggle(d.props, 'card')))),
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
