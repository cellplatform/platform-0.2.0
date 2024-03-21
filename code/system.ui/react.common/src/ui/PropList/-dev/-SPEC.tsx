import { PropList } from '..';
import { COLORS, Color, Dev, Keyboard, Pkg, css, type t } from '../../../test.ui';
import { Wrangle } from '../u';
import { BuilderSample } from './-SPEC.Sample.Builder';
import { sampleItems } from './-SPEC.Samples';
import { SampleFields, type MyField } from './-common';

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
  props: { title: 'MyTitle', defaults: { clipboard: false }, theme: 'Light' },
  debug: { source: 'Samples', header: true, footer: true },
};

const name = PropList.displayName ?? 'Unknown';
export default Dev.describe(name, (e) => {
  type LocalStore = Pick<P, 'theme'> & {
    card: boolean;
    flipped: boolean;
    header: boolean;
    footer: boolean;
  };
  const localstore = Dev.LocalStorage<LocalStore>(`dev:${Pkg.name}.${name}`);
  const local = localstore.object({
    theme: undefined,
    card: false,
    flipped: false,
    header: false,
    footer: false,
  });

  e.it('init', async (e) => {
    const ctx = Dev.ctx(e);
    const state = await ctx.state<T>(initial);
    await Util.setSample(ctx, state.current.debug.source);

    state.change((d) => {
      d.props.theme = local.theme;
      d.props.card = local.card;
      d.props.flipped = local.flipped;
      d.debug.header = local.header;
      d.debug.footer = local.footer;
    });

    ctx.debug.width(330);
    ctx.subject
      .display('grid')
      .size([250, null])
      .render<T>((e) => {
        const { props, debug } = e.state;
        Dev.Theme.background(ctx, props.theme, 1);

        const isCard = Boolean(props.card);
        ctx.subject.size([isCard ? 250 + 25 * 2 : 250, null]);
        ctx.host.tracelineColor(isCard ? -0.03 : -0.05);

        const styles = {
          header: css({
            Padding: [8, 10],
            borderBottom: `solid 1px ${Color.alpha(COLORS.DARK, 0.1)}`,
          }),
          footer: css({
            Padding: [8, 10],
            borderTop: `solid 1px ${Color.alpha(COLORS.DARK, 0.1)}`,
          }),
        };

        const backside = <div>🐷 Sample Backside</div>;
        const elHeader = debug.header && <div {...styles.header}>Header</div>;
        const elFooter = debug.footer && <div {...styles.footer}>Footer</div>;

        return (
          <PropList
            {...props}
            header={elHeader}
            footer={elFooter}
            backside={backside}
            backsideHeader={elHeader}
            backsideFooter={elFooter}
          />
        );
      });
  });

  e.it('init:keyboard', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    const state = await dev.state();
    Keyboard.on({
      Enter(e) {
        e.handled();
        state.change((d) => {
          local.flipped = Dev.toggle(d.props, 'flipped');
          local.card = d.props.card = true;
        });
      },
    });
  });

  e.it('ui:debug', async (e) => {
    const dev = Dev.tools<T>(e, initial);

    dev.section('Properties', (dev) => {
      // dev.boolean((btn) =>
      //   btn
      //     .label((e) => `theme: "${e.state.props.theme}"`)
      //     .value((e) => e.state.props.theme === 'Light')
      //     .onClick((e) =>
      //       e.change((d) => {
      //         d.props.theme = e.current ? 'Dark' : 'Light';
      //         Dev.Theme.background(dev.ctx, d.props.theme);
      //       }),
      //     ),
      // );

      Dev.Theme.switch(
        dev,
        (d) => d.props.theme,
        (d, value) => (local.theme = d.props.theme = value),
      );

      dev.boolean((btn) =>
        btn
          .label('defaults.clipboard')
          .value((e) => e.state.props.defaults?.clipboard)
          .onClick((e) => e.change((d) => Dev.toggle(Util.defaults(d.props), 'clipboard'))),
      );

      dev.boolean((btn) =>
        btn
          .label('defaults.monospace')
          .value((e) => e.state.props.defaults?.monospace)
          .onClick((e) => e.change((d) => Dev.toggle(Util.defaults(d.props), 'monospace'))),
      );

      dev.hr(-1, 5);

      dev.boolean((btn) =>
        btn
          .label('card')
          .value((e) => Boolean(e.state.props.card))
          .onClick((e) => e.change((d) => (local.card = Dev.toggle(d.props, 'card')))),
      );

      dev.boolean((btn) =>
        btn
          .label((e) => `flipped (← Enter)`)
          .value((e) => Boolean(e.state.props.flipped))
          .onClick((e) => e.change((d) => (local.flipped = Dev.toggle(d.props, 'flipped')))),
      );

      dev.hr(-1, 5);

      dev.boolean((btn) =>
        btn
          .label((e) => `header`)
          .value((e) => Boolean(e.state.debug.header))
          .onClick((e) => e.change((d) => (local.header = Dev.toggle(d.debug, 'header')))),
      );

      dev.boolean((btn) =>
        btn
          .label((e) => `footer`)
          .value((e) => Boolean(e.state.debug.footer))
          .onClick((e) => e.change((d) => (local.footer = Dev.toggle(d.debug, 'footer')))),
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
            await dev.change((d) => (d.debug.fields = ev.next as MyField[]));
            Util.setSample(dev.ctx, 'Builder');
          },
        };
        return <PropList.FieldSelector {...props} style={{ Margin: [20, 0, 20, 30] }} />;
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
