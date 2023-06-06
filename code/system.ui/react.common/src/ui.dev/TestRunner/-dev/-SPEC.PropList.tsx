import { type TestPropListProps } from '../Test.PropList';
import { Dev, Pkg, t, type TestCtx } from './-common.mjs';

const PropList = Dev.TestRunner.PropList;
const DEFAULTS = PropList.DEFAULTS;

type P = TestPropListProps;
type T = {
  ctx: TestCtx;
  props: P;
  debug: { infoUrl?: boolean; ellipsis?: boolean; label?: string };
};
const initial: T = {
  ctx: { fail: false, delay: 2000 },
  props: {},
  debug: { infoUrl: false, ellipsis: false },
};

export default Dev.describe('TestRunner.PropList', (e) => {
  type LocalStore = Pick<P, 'card' | 'fields' | 'enabled'> &
    T['debug'] & { selected: string[]; delay: number; fail: boolean };
  const localstore = Dev.LocalStorage<LocalStore>('dev:sys.common.TestRunner.PropList');
  const local = localstore.object({
    infoUrl: true,
    ellipsis: false,
    fields: DEFAULTS.fields,
    card: true,
    enabled: true,
    selected: [],
    label: '',
    delay: initial.ctx.delay,
    fail: initial.ctx.fail,
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
      d.props.enabled = local.enabled;

      d.ctx.delay = local.delay;
      d.ctx.fail = local.fail;
    });

    const infoUrl = '?dev=sys.ui.dev.TestRunner.PropList';
    const controller = await Dev.TestRunner.PropList.controller({
      /**
       * Initial state (passed into Controller).
       */
      pkg: Pkg,
      run: {
        ctx: () => state.current.ctx,
        async list() {
          // NB: function or array (optionally async).
          return [
            import('./-TEST.sample-1.mjs'),
            import('./-TEST.sample-2.mjs'),
            'Internal',
            import('./-TEST.controller.mjs'),
          ];
        },
        label: () => state.current.debug.label || undefined,
        infoUrl: () => (state.current.debug.infoUrl ? infoUrl : undefined),
        bundle: () => controller.selected.bundle(),
        onRunSingle: (e) => console.info('⚡️ onRunSingle:', e),
        onRunAll: (e) => console.info('⚡️ onRunAll:', e),
      },
      specs: {
        selected: local.selected,
        ellipsis: () => state.current.debug.ellipsis,
        onSelect(e) {
          console.info('⚡️ onChange:', e); // NB: Bubbled up AFTER controller reacts.
        },
      },
    });

    const updateData = () => state.change((d) => (d.props.data = controller.current));
    updateData();
    controller.$.subscribe((e) => {
      updateData();
      local.selected = e.data.specs?.selected ?? [];
    });

    const getSize = (): [number, null] => [state.current.props.card ? 330 : 330, null];
    ctx.host.tracelineColor(-0.05);
    ctx.debug.width(300);
    ctx.subject
      .backgroundColor(1)
      .size(getSize())
      .display('grid')
      .render<T>((e) => {
        const { props } = e.state;
        ctx.subject.backgroundColor(props.card ? 0 : 1);
        return <Dev.TestRunner.PropList {...props} style={{ margin: props.card ? 0 : 20 }} />;
      });
  });

  e.it('ui:debug', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    const state = await dev.state();

    dev.section('FieldSelector', (dev) => {
      dev.row((e) => {
        return (
          <Dev.TestRunner.PropList.FieldSelector
            style={{ Margin: [10, 30, 10, 25] }}
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
          .placeholder('title (run)')
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

      dev.boolean((btn) =>
        btn
          .label((e) => `card.flipped`)
          .value((e) => e.state.props.flipped)
          .onClick((e) => e.change((d) => Dev.toggle(d.props, 'flipped'))),
      );

      dev.boolean((btn) =>
        btn
          .label((e) => `enabled`)
          .value((e) => e.state.props.enabled)
          .onClick((e) => e.change((d) => (local.enabled = Dev.toggle(d.props, 'enabled')))),
      );
    });

    dev.hr(5, 20);

    dev.section('debug', (dev) => {
      dev.button('redraw', () => dev.redraw());

      dev.boolean((btn) =>
        btn
          .label((e) => `ctx.fail = ${e.state.ctx.fail}`)
          .value((e) => e.state.ctx.fail)
          .onClick((e) => e.change((d) => (local.fail = Dev.toggle(d.ctx, 'fail')))),
      );

      dev.boolean((btn) =>
        btn
          .label((e) => `ctx.delay = ${e.state.ctx.delay}ms`)
          .value((e) => e.state.ctx.delay === initial.ctx.delay)
          .onClick((e) => {
            e.change((d) => {
              const defaultDelay = initial.ctx.delay;
              const next = d.ctx.delay === defaultDelay ? 300 : defaultDelay;
              local.delay = d.ctx.delay = next;
            });
          }),
      );
    });
  });

  e.it('ui:footer', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    dev.footer.border(-0.1).render<T>((e) => {
      const data = {
        ...e.state,
        'props.data.specs': e.state.props.data?.specs,
        'props.data.specs.results': e.state.props.data?.specs?.results,
      };
      return <Dev.Object name={'TestRunner.PropList'} data={data} expand={1} />;
    });
  });
});
