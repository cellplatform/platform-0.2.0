import { Dev, Pkg, t } from '../../../test.ui';
import { PropList } from '../../../ui/PropList';
import suite1 from './-TEST.sample-1.mjs';
import suite2 from './-TEST.sample-2.mjs';

import type { ResultsProps, TestCtx } from './-types.mjs';

type T = {
  ctx: TestCtx;
  props: ResultsProps;
  debug: { infoUrl: boolean; fields?: t.TestRunnerField[]; card: boolean };
};
const initial: T = {
  ctx: { fail: false },
  props: { spinning: false, scroll: true },
  debug: {
    infoUrl: true,
    fields: Dev.TestRunner.PropList.DEFAULTS.fields,
    card: true,
  },
};

export default Dev.describe('TestRunner', (e) => {
  type LocalStore = T['debug'];
  const localstore = Dev.LocalStorage<LocalStore>('dev:sys.common.TestRunner');
  const local = localstore.object({
    infoUrl: initial.debug.infoUrl,
    fields: initial.debug.fields,
    card: initial.debug.card,
  });

  e.it('init', async (e) => {
    const ctx = Dev.ctx(e);
    const state = await ctx.state<T>(initial);

    await state.change((d) => {
      d.debug.infoUrl = local.infoUrl;
      d.debug.fields = local.fields;
      d.debug.card = local.card;
    });

    ctx.subject
      .display('grid')
      .backgroundColor(1)
      .size('fill')
      .render<T>((e) => {
        return <Dev.TestRunner.Results {...e.state.props} />;
      });
  });

  e.it('ui:debug', async (e) => {
    const dev = Dev.tools<T>(e, initial);

    dev.section('Runner', (dev) => {
      dev.button('clear', (e) => e.change((d) => (d.props.data = undefined)));

      dev.boolean((btn) =>
        btn
          .label((e) => `ctx.fail = ${e.state.ctx.fail}`)
          .value((e) => e.state.ctx.fail)
          .onClick((e) => e.change((d) => Dev.toggle(d.ctx, 'fail'))),
      );

      dev.hr(-1, 5);

      dev.button('run: sample', async (e) => {
        const ctx = e.state.current.ctx;
        const results = await suite1.run({ ctx });
        await e.change((d) => (d.props.data = results));
      });

      dev.button((btn) =>
        btn
          .label('run: long, overflowing')
          .right('← scollable')
          .onClick(async (e) => {
            const ctx = e.state.current.ctx;
            const results = await suite2.run({ ctx });
            await e.change((d) => (d.props.data = results));
          }),
      );
    });

    dev.hr(5, 20);

    dev.section('Properties', (dev) => {
      dev.boolean((btn) =>
        btn
          .label('spinning')
          .value((e) => e.state.props.spinning)
          .onClick((e) => e.change((d) => Dev.toggle(d.props, 'spinning'))),
      );

      dev.boolean((btn) =>
        btn
          .label('scroll')
          .value((e) => e.state.props.scroll)
          .onClick((e) => e.change((d) => Dev.toggle(d.props, 'scroll'))),
      );
    });

    dev.hr(5, 20);
  });

  e.it('ui:debug.PropList', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    const state = await dev.state();

    dev.section('TestRunner.PropList.Fields', (dev) => {
      dev.row((e) => {
        return (
          <PropList.FieldSelector
            style={{ Margin: [10, 40, 10, 30] }}
            all={Dev.TestRunner.PropList.FIELDS}
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

    dev.hr(5, 20);

    dev.section('TestRunner.PropList', (dev) => {
      dev.row((e) => {
        const { debug } = e.state;
        const data = { pkg: Pkg };
        return (
          <Dev.TestRunner.PropList
            fields={debug.fields}
            data={data}
            card={debug.card}
            margin={[20, 35, 0, 35]}
          />
        );
      });
    });

    dev.hr(-1, [30, 10]);

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

  e.it('ui:footer', (e) => {
    const dev = Dev.tools<T>(e, initial);
    dev.footer.render((e) => {
      return <Dev.TestRunner.Compact />;
    });
  });
});
