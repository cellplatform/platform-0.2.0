import { t, Dev } from '../../test.ui';
import { PropList } from '.';
import { sampleItems, BuilderSample } from './dev';
import type { MyFields } from './dev';

type SampleKind = 'Samples' | 'Builder';
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
    // theme: 'Dark',
  },
  debug: {
    source: 'Samples',
    // source: 'Builder',
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
    await ctx.state<T>(initial);
    ctx.component
      .display('grid')
      .backgroundColor(1)
      .size(250, null)
      .render<T>((e) => <PropList />);
  });

  e.it('debug panel', async (e) => {
    const dev = Dev.tools<T>(e, initial);

    dev.ctx.debug.footer
      .border(-0.1)
      .render<T>((e) => <Dev.ObjectView name={'state'} data={e.state} />);

    dev
      .title('Defaults')
      .boolean((btn) =>
        btn
          .label('clipboard')
          .value((e) => e.state.props.defaults?.clipboard)
          .onClick((e) => e.change((d) => Dev.toggle(Util.defaults(d.props), 'clipboard'))),
      )
      .boolean((btn) =>
        btn
          .label('monospace')
          .value((e) => e.state.props.defaults?.monospace)
          .onClick((e) => e.change((d) => Dev.toggle(Util.defaults(d.props), 'monospace'))),
      )
      .hr();

    dev.title('Title').hr();
  });
});

/**
 * [Helpers]
 */

const Util = {
  toItems(ctx: T) {
    const { source, fields } = ctx.debug;
    if (source === 'Samples') return sampleItems;
    if (source === 'Builder') return BuilderSample.toItems({ fields });
    return [];
  },

  defaults(props: t.PropListProps) {
    return props.defaults ?? (props.defaults = {});
  },
};
