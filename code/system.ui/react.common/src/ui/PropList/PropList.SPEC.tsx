import { PropList } from '.';
import { Dev, t } from '../../test.ui';
import { BuilderSample, sampleItems } from './dev';

import type { MyFields } from './dev';

type SampleKind = 'Samples' | 'Builder' | 'Empty';
type T = {
  props: t.PropListProps;
  debug: {
    source: SampleKind;
    fields?: MyFields[];
    fieldSelector: {
      title: boolean;
      resettable: boolean;
      showIndexes: boolean;
    };
  };
};

const initial: T = {
  props: {
    title: 'MyTitle',
    titleEllipsis: true,
    defaults: { clipboard: false },
    theme: 'Light',
  },
  debug: {
    source: 'Samples',
    fieldSelector: {
      title: true,
      resettable: PropList.FieldSelector.DEFAULT.resettable,
      showIndexes: PropList.FieldSelector.DEFAULT.showIndexes,
    },
  },
};

export default Dev.describe('PropList', (e) => {
  e.it('init', async (e) => {
    const ctx = Dev.ctx(e);
    const state = await ctx.state<T>(initial);
    await Util.setSample(ctx, state.current.debug.source);

    ctx.component
      .display('grid')
      .size(250, null)
      .render<T>((e) => <PropList {...e.state.props} />);
  });

  e.it('debug panel', async (e) => {
    const dev = Dev.tools<T>(e, initial);

    dev.footer
      .border(-0.1)
      .render<T>((e) => <Dev.Object name={'info'} data={e.state} expand={1} />);

    dev.section('Properties', (dev) => {
      dev
        .boolean((btn) =>
          btn
            .label('defaults.clipboard')
            .value((e) => e.state.props.defaults?.clipboard)
            .onClick((e) => e.change((d) => Dev.toggle(Util.defaults(d.props), 'clipboard'))),
        )
        .boolean((btn) =>
          btn
            .label('defaults.monospace')
            .value((e) => e.state.props.defaults?.monospace)
            .onClick((e) => e.change((d) => Dev.toggle(Util.defaults(d.props), 'monospace'))),
        )
        .boolean((btn) =>
          btn
            .label((e) => `theme: "${e.state.props.theme}"`)
            .value((e) => e.state.props.theme === 'Light')
            .onClick((e) =>
              e.change((d) => {
                d.props.theme = e.current ? 'Dark' : 'Light';
                dev.theme(d.props.theme);
              }),
            ),
        )
        .hr();
    });

    dev.section('Title', (dev) => {
      dev.TODO().hr();
    });

    dev.section('Debug', (dev) => {
      const items = (kind: SampleKind) => {
        dev.button(`items: ${kind}`, (e) => Util.setSample(e.ctx, kind));
      };
      items('Empty');
      items('Samples');
      items('Builder');
      dev.hr();
    });

    dev.section('FieldSelector');
  });
});

/**
 * [Helpers]
 */

const Util = {
  async setSample(ctx: t.DevCtx, source: SampleKind) {
    const state = await ctx.state<T>(initial);
    state.change((d) => {
      d.debug.source = source;
      d.props.items = Util.toItems(d);
    });
  },

  toItems(state: T) {
    const { source, fields } = state.debug;
    if (source === 'Empty') return [];
    if (source === 'Samples') return sampleItems;
    if (source === 'Builder') return BuilderSample.toItems({ fields });
    return [];
  },

  defaults(props: t.PropListProps) {
    return props.defaults ?? (props.defaults = {});
  },
};
