import {
  COLORS,
  Color,
  Concept,
  Dev,
  Is,
  TestFile,
  Time,
  Video,
  css,
  rx,
  type t,
} from '../../test.ui';
import { DevSelected } from '../ui.Index/-SPEC.Selected';
import { ImageYaml } from './-SPEC.ImageYaml';

type T = {
  status?: t.VideoStatus;
  index: t.IndexProps;
  diagram: t.VideoDiagramProps;
  debug: { playbarEnabled?: boolean };
};
const initial: T = {
  index: {},
  diagram: {},
  debug: {},
};

/**
 * Spec
 */
const name = 'VideoDiagram (Edit)';

export default Dev.describe(name, async (e) => {
  const { dispose, dispose$ } = rx.disposable();

  type LocalStore = Pick<t.IndexProps, 'selected'> & Pick<t.VideoDiagramProps, 'muted' | 'debug'>;
  const localstore = Dev.LocalStorage<LocalStore>('dev:sys.ui.concept.VideoDiagram.Edit');
  const local = localstore.object({
    selected: undefined,
    muted: false,
    debug: false,
  });

  /**
   * (CRDT) Filesystem
   */
  const { dir, fs, doc, file } = await TestFile.init({ dispose$ });

  e.it('ui:init', async (e) => {
    const ctx = Dev.ctx(e);
    const dev = Dev.tools<T>(e, initial);

    const state = await ctx.state<T>(initial);
    const Selected = DevSelected(doc, () => state.current.index.selected);

    await state.change((d) => {
      d.index.items = doc.current.slugs;
      d.index.selected = local.selected;
      d.index.focused = true;
      d.diagram.debug = local.debug;
      d.diagram.muted = local.muted;
      d.debug.playbarEnabled = true;
    });

    const onSelectionChanged = async () => {
      await state.change((d) => {
        const slug = Selected.slug.item;
        if (Is.slug(slug)) {
          d.diagram.split = slug.split;
          d.diagram.video = slug.video;
        }
      });
    };

    await onSelectionChanged();
    localstore.changed$.subscribe((e) => {
      if (e.kind === 'put' && e.key === 'selected') {
        Time.delay(0, onSelectionChanged);
      }
    });

    doc.$.subscribe((e) => {
      const slug = e.doc.slugs[Selected.index];
      if (Is.slug(slug)) {
        state.change((d) => {
          d.diagram.split = slug.split;
          d.diagram.video = slug.video;
        });
      }
    });

    ctx.debug.width(330);
    ctx.subject
      .size('fill')
      .display('grid')
      .render<T>((e) => {
        const styles = {
          base: css({ display: 'grid', gridTemplateColumns: 'auto 1fr' }),
          left: css({
            width: 265,
            display: 'grid',
            borderRight: `solid 1px ${Color.alpha(COLORS.DARK, 0.06)}`,
          }),
          right: css({
            display: 'grid',
            backgroundColor: COLORS.WHITE,
          }),
        };

        return (
          <div {...styles.base}>
            <div {...styles.left}>
              <Concept.Index
                {...e.state.index}
                padding={10}
                onSelect={(e) => state.change((d) => (local.selected = d.index.selected = e.index))}
              />
            </div>
            <div {...styles.right}>
              <Concept.VideoDiagram
                {...e.state.diagram}
                onVideoStatus={(e) => state.change((d) => (d.status = e.status))}
              />
            </div>
          </div>
        );
      });
  });

  e.it('ui:debug', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    const state = await dev.state();
    const Selected = DevSelected(doc, () => state.current.index.selected);

    dev.header
      .padding(15)
      .border(-0.1)
      .render<T>((e) => {
        return (
          <Video.PlayBar
            enabled={e.state.debug.playbarEnabled ?? true}
            size={'Small'}
            style={{}}
            status={e.state.status}
            useKeyboard={true}
            onSeek={(e) => state.change((d) => (d.diagram.timestamp = e.seconds))}
            onMute={(e) => state.change((d) => (local.muted = d.diagram.muted = e.muted))}
            onPlayAction={(e) => {
              state.change((d) => {
                d.diagram.playing = e.is.playing;
                if (e.replay) d.diagram.timestamp = 0;
              });
            }}
          />
        );
      });

    dev.section('Properties', (dev) => {
      dev.hr(0, 3);
      dev.row((e) => {
        return (
          <Concept.VideoDiagram.Props.Split
            props={e.state.diagram}
            onChange={(e) => {
              doc.change((d) => {
                const slug = d.slugs[Selected.index];
                if (Is.slug(slug)) slug.split = e.split;
              });
            }}
          />
        );
      });

      dev.hr(0, 5);

      //   dev.row((e) => {
      //     return (
      //       <Concept.VideoDiagram.Props.ImageScale
      //         props={e.state.diagram}
      //         onChange={(e) => {
      //           /**
      //            * TODO 🐷
      //            */
      //           console.log('change image scale', e);
      //         }}
      //       />
      //     );
      //   });
    });

    dev.section(/* Video Settings */ '', (dev) => {
      dev.textbox((txt) => {
        const value = () => Selected.slug.item?.video?.src?.id ?? '';
        txt
          .label((e) => 'video')
          .placeholder('video source id')
          .value((e) => value())
          .onChange((e) => {
            doc.change((d) => {
              const slug = d.slugs[Selected.index];
              if (Is.slug(slug)) {
                const video = slug.video ?? (slug.video = {});
                video.src = Video.src(e.to.value);
              }
            });
          });
      });

      dev.hr(0, 5);

      dev.textbox((txt) => {
        const value = () => String(Selected.slug.item?.video?.innerScale ?? 1);
        txt
          .label((e) => 'innerScale')
          .placeholder('1')
          .value((e) => value())
          .onChange((e) => {
            doc.change((d) => {
              const slug = d.slugs[Selected.index];
              if (Is.slug(slug)) {
                const video = slug.video ?? (slug.video = {});
                const innerScale = Number(e.to.value);
                if (!isNaN(innerScale)) video.innerScale = innerScale;
              }
            });
          });
      });

      dev.hr(0, 10);

      dev.row((e) => {
        const images = Selected.slug.item?.video?.images;
        return (
          <ImageYaml
            images={images}
            onFocus={(e) => state.change((d) => (d.debug.playbarEnabled = !e.focused))}
            onEnter={(e) => {
              doc.change((d) => {
                const slug = d.slugs[Selected.index];
                if (Is.slug(slug)) {
                  const video = slug.video ?? (slug.video = {});
                  video.images = e.images;
                }
              });
            }}
          />
        );
      });
    });

    dev.hr(0, 50);

    dev.section('Debug', (dev) => {
      dev.boolean((btn) => {
        const value = (state: T) => Boolean(state.diagram.debug);
        btn
          .label((e) => `debug`)
          .value((e) => value(e.state))
          .onClick((e) => e.change((d) => (local.debug = Dev.toggle(d.diagram, 'debug'))));
      });
    });
  });

  e.it('ui:footer', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    const state = await dev.state();

    dev.footer.border(-0.1).render<T>((e) => {
      const data = {
        'props:index': e.state.index,
        'props:diagram': e.state.diagram,
        doc: doc.current,
      };
      return <Dev.Object name={name} data={data} expand={1} />;
    });
  });
});
