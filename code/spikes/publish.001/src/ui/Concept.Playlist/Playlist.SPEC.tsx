import { Playlist, PlaylistProps } from '.';
import { Dev, t } from '../../test.ui';

const ITEMS: t.PlaylistItem[] = [
  { text: 'Credibly neutral protocols as public goods.', secs: 32 },
  { text: 'Why did "web2" (centralization) happen?', secs: 45 },
  { text: 'The blockchain trilemma.', secs: 345 },
  { text: 'Blockchain trade-offs.', secs: 125 },
  { text: 'Self-sovereign identity.', secs: 624 },
  { text: 'Individual control.', secs: 342 },
];

type T = { props: PlaylistProps };
const initial: T = {
  props: {
    title: 'Deep dive into decentralization',
    items: [],
    preview: {
      title: 'programme',
      image:
        'https://user-images.githubusercontent.com/185555/213319665-8128314b-5d8e-4a19-b7f5-2469f09d6690.png',
    },
  },
};

export default Dev.describe('Video.Playlist', (e) => {
  e.it('init', async (e) => {
    const ctx = Dev.ctx(e);
    await ctx.state<T>(initial);

    ctx.host.tracelineColor(-0.05).backgroundColor(1);

    ctx.subject
      .display('grid')
      .size([690, null])
      .render<T>((e) => {
        return <Playlist {...e.state.props} onClick={(e) => console.info(`⚡️ onClick`, e)} />;
      });
  });

  e.it('ui:debug', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    dev.footer
      .border(-0.1)
      .render<T>((e) => <Dev.Object name={'info'} data={e.state} expand={1} />);

    dev
      .section('Host', (dev) => {
        dev.boolean((btn) =>
          btn
            .label('white background')
            .value((e) => Boolean(e.dev.host.backgroundColor === 1))
            .onClick((e) => {
              const isWhite = e.dev.host.backgroundColor === 1;
              e.ctx.host
                .backgroundColor(isWhite ? -0.03 : 1)
                .tracelineColor(isWhite ? -0.05 : -0.02);
            }),
        );

        dev.hr();

        const width = (value: number) => {
          dev.button(`width: ${value}px`, (e) => e.ctx.subject.size([value, null]));
        };
        width(690);
        width(600);
        width(500);
        width(450);
      })
      .hr();

    dev.section('Configurations', (e) => {
      dev.button('reset: <empty>', (e) => {
        e.change(({ props }) => {
          props.title = undefined;
          props.preview = undefined;
          props.items = undefined;
        });
      });

      dev.button('reset: `{initial}`', (e) => {
        e.change((d) => {
          /**
           * TODO 🐷
           * return value as "REPLACE" object update in `sys.dev`
           */

          type K = keyof PlaylistProps;
          const keys = Object.keys(initial.props) as K[];
          keys.forEach((key) => ((d.props as any)[key] = initial.props[key]));
        });
      });

      dev.hr();

      dev.section('Titles', (dev) => {
        dev.boolean((btn) =>
          btn
            .label(`preview.title: "${initial.props.preview?.title}"`)
            .value((e) => Boolean(e.state.props.preview?.title))
            .onClick((e) => {
              e.change((d) => {
                const preview = d.props.preview ?? (d.props.preview = {});
                const next = preview.title ? undefined : initial.props.preview?.title;
                preview.title = next;
                e.label(`preview.title: ${next ? `"${next}"` : '<undefined>'}`);
              });
            }),
        );

        dev.hr();

        dev
          .button('title: `undefined`', (e) => {
            e.change((d) => (d.props.title = undefined));
          })
          .button('title: short ("Hello world")', (e) => {
            e.change((d) => (d.props.title = 'Hello world.'));
          })
          .button('title: short ("👋")', (e) => {
            e.change((d) => (d.props.title = 'Hello 👋'));
          })
          .button('title: long', (e) => {
            e.change((d) => (d.props.title = dev.lorem(20, '.')));
          });

        dev.boolean((btn) =>
          btn
            .label(`subtitle`)
            .value((e) => Boolean(e.state.props.subtitle))
            .onClick((e) => {
              e.change((d) => {
                const current = d.props.subtitle;
                const next = current ? undefined : Dev.Lorem.words(18, '.');
                d.props.subtitle = next;
              });
            }),
        );

        dev.hr();
      });

      dev.section('Items', () => {
        dev.section((dev) => {
          const set = (items: T['props']['items']) => {
            const total = items?.length ?? 0;
            const label = `set: items (${total > 1 ? '..' : ''}${total})`;
            dev.button(label, (e) => e.change((d) => (d.props.items = items)));
          };
          set([]);
          set([ITEMS[0]]);
          set(ITEMS);
        });

        dev
          .hr()
          .button('remove: first', (e) =>
            e.change((d) => (d.props.items = (d.props.items || []).slice(1))),
          )
          .button('remove: last', (e) =>
            e.change((d) => {
              const items = d.props.items || [];
              d.props.items = items.slice(0, items.length - 1);
            }),
          )
          .button('(clear)', (e) => e.change((d) => (d.props.items = undefined)));
      });

      dev.hr();
    });
  });
});
