import { PropList } from '..';
import { Dev, Pkg, css, type t } from '../../../test.ui';
import { Wrangle } from '../u';
import { BuilderSample } from './-SPEC.ui.Builder';
import { sampleItems } from './-SPEC.ui.sample';
import { SampleFields, type MyField, DEFAULTS } from './common';

type SampleKind = 'Empty' | 'One Item' | 'Two Items' | 'Samples' | 'Builder';
type P = t.PropListProps;
type T = {
  props: P;
  debug: {
    source: SampleKind;
    fields?: MyField[];
    header: boolean;
    footer: boolean;
  };
};

const initial: T = {
  props: { title: 'MyTitle', defaults: {}, theme: 'Light' },
  debug: { source: 'Samples', header: true, footer: true },
};

const name = DEFAULTS.displayName;

export default Dev.describe(name, (e) => {
  type LocalStore = Pick<P, 'theme' | 'loading' | 'enabled'>;
  const localstore = Dev.LocalStorage<LocalStore>(`dev:${name}`);
  const local = localstore.object({
    theme: undefined,
    loading: false,
  });

  e.it('init', async (e) => {
    const ctx = Dev.ctx(e);
    const state = await ctx.state<T>(initial);
    await Util.setSample(ctx, state.current.debug.source);

    state.change((d) => {
      d.props.theme = local.theme;
      d.props.loading = local.loading;
      d.props.enabled = local.enabled ?? true;
    });

    ctx.debug.width(330);
    ctx.subject
      .display('grid')
      .size([250, null])
      .render<T>((e) => {
        const { props } = e.state;
        Dev.Theme.background(ctx, props.theme, 1);
        return <PropList {...props} />;
      });
  });

  e.it('ui:debug', async (e) => {
    const dev = Dev.tools<T>(e, initial);

    dev.section('Properties', (dev) => {
      Dev.Theme.switch(dev, ['props', 'theme'], (next) => (local.theme = next));

      dev.boolean((btn) => {
        const value = (state: T) => !!state.props.enabled;
        btn
          .label((e) => `enabled`)
          .value((e) => value(e.state))
          .onClick((e) => e.change((d) => (local.enabled = Dev.toggle(d.props, 'enabled'))));
      });

      dev.boolean((btn) => {
        const value = (state: T) => !!state.props.loading;
        btn
          .label((e) => `loading`)
          .value((e) => value(e.state))
          .onClick((e) => e.change((d) => (local.loading = Dev.toggle(d.props, 'loading'))));
      });

      dev.hr(-1, 5);

      dev.boolean((btn) =>
        btn
          .label('defaults.monospace')
          .value((e) => e.state.props.defaults?.monospace)
          .onClick((e) => e.change((d) => Dev.toggle(Util.defaults(d.props), 'monospace'))),
      );

      dev.hr(5, 20);
    });

    dev.section('Title', (dev) => {
      const Title = {
        read(state: T) {
          return Wrangle.title(state.props.title);
        },
        obj(state: T): t.PropListTitle {
          const current = state.props.title;
          if (typeof current === 'object' && current !== null) return current as t.PropListTitle;
          return (state.props.title = {});
        },
      };

      const lorem = Dev.Lorem.words(50);
      const titleButton = (label: string, value: t.PropListTitle['value']) => {
        dev.button(`set: ${label}`, (e) => {
          e.change((d) => (Title.obj(d).value = value));
        });
      };

      titleButton('none (undefined)', undefined);
      dev.hr(-1, 5);
      titleButton('"MyTitle"', 'MyTitle');
      titleButton('long (50 words)', lorem);
      const elTitle = <div {...css({ fontSize: 32 })}>{'🐷'}</div>;
      titleButton('<Element>', elTitle);
      titleButton('[<Element>, <Element>]', [elTitle, elTitle]);
      dev.hr(-1, 5);
      titleButton('[ "Left", "Right" ]', ['Left', 'Right']);
      titleButton('[ (long), "Right" ]', [lorem, 'Right']);
      titleButton('[ "Left", (long) ]', ['Left', lorem]);
      titleButton('[ (long), (long) ]', [lorem, lorem]);

      dev.hr(1, 5);

      dev.boolean((btn) =>
        btn
          .label((e) => `ellipsis: ${Boolean(Title.read(e.state).ellipsis)}`)
          .value((e) => Title.read(e.state).ellipsis)
          .onClick((e) => e.change((d) => Dev.toggle(Title.obj(d), 'ellipsis'))),
      );

      dev.boolean((btn) =>
        btn
          .label((e) => `margin: ${Title.read(e.state).margin || '(default)'}`)
          .value((e) => Boolean(Title.read(e.state).margin))
          .onClick((e) => {
            e.change((d) => {
              const title = Title.obj(d);
              title.margin = title.margin ? undefined : [30, 50];
            });
          }),
      );
    });

    dev.hr(5, 20);

    dev.section('Items', (dev) => {
      const button = (kind: SampleKind) => {
        dev.button(kind, (e) => Util.setSample(e.ctx, kind));
      };
      button('Empty');
      dev.hr(-1, 5);
      button('Samples');
      button('One Item');
      button('Two Items');
      dev.hr(-1, 5);
      button('Builder');
    });

    dev.section((dev) => {
      dev.row((e) => {
        const debug = e.state.debug;
        const props: t.PropListFieldSelectorProps<MyField> = {
          title: 'Field Selector',
          all: SampleFields.all,
          selected: debug.fields,
          async onClick(ev) {
            await dev.change((d) => (d.debug.fields = ev.next(SampleFields.defaults)));
            Util.setSample(dev.ctx, 'Builder');
          },
        };
        return (
          <PropList.FieldSelector
            //
            {...props}
            style={{ Margin: [20, 0, 20, 30] }}
          />
        );
      });
    });
  });

  e.it('ui:footer', async (e) => {
    const dev = Dev.tools<T>(e, initial);

    dev.footer.border(-0.1).render<T>((e) => {
      const data = e.state;
      return <Dev.Object name={name} data={data} expand={1} fontSize={11} />;
    });
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
    if (source === 'One Item') return [{ label: 'hello', value: 'py.123' }];
    if (source === 'Two Items')
      return [
        { label: 'one', value: '123' },
        { label: 'two', value: '456' },
      ];
    if (source === 'Builder') return BuilderSample.toItems({ fields });
    return [];
  },

  defaults(props: t.PropListProps) {
    return props.defaults ?? (props.defaults = {});
  },
} as const;
