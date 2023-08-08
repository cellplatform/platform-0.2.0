import { Dev, File, Filesize, Icons, SAMPLE, Slider, css, type t } from '../../../test.ui';

import { Image } from '..';
import { Util } from '../Util.mjs';
import { DevDataController } from './-DEV.File';

const DEFAULTS = Image.DEFAULTS;

type T = {
  props: t.ImageProps;
  debug: {
    bg?: boolean;
    dataEnabled?: boolean;
    dropEnabled?: boolean;
    pasteEnabled?: boolean;
    pastePrimary?: boolean;
  };
};
const initial: T = {
  props: {},
  debug: {},
};

export default Dev.describe('Image', async (e) => {
  type LocalStore = T['debug'] & Pick<t.ImageProps, 'debug'>;
  const localstore = Dev.LocalStorage<LocalStore>('dev:sys.ui.common.Image');
  const local = localstore.object({
    debug: false,
    bg: true,
    dataEnabled: false,
    dropEnabled: true,
    pasteEnabled: true,
    pastePrimary: false,
  });

  const getDrop = (props: t.ImageProps) => props.drop || (props.drop = DEFAULTS.drop);
  const getPaste = (props: t.ImageProps) => props.paste || (props.paste = DEFAULTS.paste);
  const crdt = await DevDataController();

  e.it('ui:init', async (e) => {
    const ctx = Dev.ctx(e);
    const state = await ctx.state<T>(initial);

    await state.change((d) => {
      getDrop(d.props).enabled = local.dropEnabled;
      getPaste(d.props).enabled = local.pasteEnabled;
      getPaste(d.props).primary = local.pastePrimary;
      d.props.sizing = DEFAULTS.sizing;
      d.props.debug = local.debug;

      d.debug.bg = local.bg;
      d.debug.dataEnabled = local.dataEnabled;
    });

    if (state.current.debug.dataEnabled) {
      await state.change((d) => (d.props.src = crdt.current.image));
    }

    ctx.debug.width(350);
    ctx.host.tracelineColor(-0.05);
    ctx.subject
      .size('fill', 100)
      .display('grid')
      .render<T>(async (e) => {
        ctx.subject.backgroundColor(e.state.debug.bg ? 1 : 0);
        return (
          <Image
            {...e.state.props}
            onDropOrPaste={(e) => {
              console.info('⚡️ onDropOrPaste:', e);
              if (e.isSupported) {
                state.change((d) => (d.props.src = e.file));
                if (crdt && e.file) crdt.update(e.file);
              }
            }}
          />
        );
      });
  });

  e.it('ui:debug', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    const state = await dev.state();

    dev.section(['Input', 'Properties'], (dev) => {
      dev.boolean((btn) =>
        btn
          .label((e) => `drop.enabled`)
          .value((e) => Boolean(e.state.props.drop?.enabled ?? DEFAULTS.drop.enabled))
          .onClick((e) =>
            e.change((d) => (local.dropEnabled = Dev.toggle(getDrop(d.props), 'enabled'))),
          ),
      );

      dev.hr(-1, 5);

      dev.boolean((btn) =>
        btn
          .label((e) => `paste.enabled`)
          .value((e) => Boolean(e.state.props.paste?.enabled ?? DEFAULTS.paste.enabled))
          .onClick((e) =>
            e.change((d) => (local.pasteEnabled = Dev.toggle(getPaste(d.props), 'enabled'))),
          ),
      );

      dev.boolean((btn) =>
        btn
          .label((e) => `paste.primary`)
          .value((e) => Boolean(e.state.props.paste?.primary ?? DEFAULTS.paste.primary))
          .onClick((e) =>
            e.change((d) => (local.pastePrimary = Dev.toggle(getPaste(d.props), 'primary'))),
          ),
      );

      dev.hr(-1, 5);

      dev.button((btn) =>
        btn
          .label((e) => '→ (disable as input)')
          .right('')
          .onClick((e) => {
            e.state.change((d) => {
              getPaste(d.props).enabled = false;
              getDrop(d.props).enabled = false;
            });
          }),
      );
    });

    dev.hr(2, 20);

    dev.section('Sizing', (dev) => {
      const size = (strategy: t.ImageSizeStrategy) => {
        const icon = (isSelected: boolean) => {
          const Icon = strategy === 'cover' ? Icons.Cover : Icons.Contain;
          const opacity = isSelected ? 1 : 0.3;
          return <Icon size={18} opacity={opacity} />;
        };
        const right = (state: T) => {
          const isSelected = state.props.sizing === strategy;
          return <div>{icon(isSelected)}</div>;
        };
        dev.button((btn) =>
          btn
            .label(`${strategy}`)
            .right((e) => right(e.state))
            .onClick((e) => {
              e.change((d) => (d.props.sizing = strategy));
            }),
        );
      };

      size('cover');
      size('contain');

      dev.hr(-1, 5);

      dev.TODO();

      const offsetSlider = (axis: t.Axis) => {
        dev.row((e) => {
          const styles = {
            base: css({ marginBottom: 10 }),
            title: css({ fontSize: 14, marginBottom: 5 }),
            slider: css({}),
          };
          const percent = e.state.props.offset?.[axis] ?? 0;
          return (
            <div {...styles.base}>
              <div {...styles.title}>{`axis: ${axis}`}</div>
              <Slider
                track={{ height: 16 }}
                thumb={{ size: 16 }}
                percent={percent}
                onChange={(e) => {
                  state.change((d) => {
                    /**
                     * TODO 🐷
                     * - Translate percentage into pixel offset.
                     * - Break this out into sub-component: <Image.OffsetEditor>
                     */

                    const offset = d.props.offset ?? (d.props.offset = { x: 0, y: 0 });
                    offset[axis] = e.percent;
                  });
                }}
              />
            </div>
          );
        });
      };

      offsetSlider('x');
      offsetSlider('y');
    });

    dev.hr(5, 20);

    dev.section('Source', (dev) => {
      const srcUrl = (title: string, src?: string) => {
        dev.button((btn) => {
          btn
            .label(title)
            .right((e) => (e.state.props.src === src ? '←' : ''))
            .onClick((e) => e.change((d) => (d.props.src = src)));
        });
      };

      srcUrl('(undefined)', undefined);
      srcUrl('url: "Group Scale Diagram"', SAMPLE.groupScale.src);
    });

    dev.hr(5, 20);

    dev.section(['File', 'Data / State'], (dev) => {
      dev.boolean((btn) =>
        btn
          .label((e) => `data ${e.state.debug.dataEnabled ? 'enabled' : 'disabled'}`)
          .value((e) => Boolean(e.state.debug.dataEnabled))
          .onClick((e) => {
            return e.change((d) => {
              local.dataEnabled = Dev.toggle(d.debug, 'dataEnabled');
              if (local.dataEnabled) d.props.src = crdt.current.image;
            });
          }),
      );

      dev.hr(-1, 5);

      dev.button((btn) =>
        btn.label('download').onClick((e) => {
          const image = crdt.current.image;
          if (image) {
            const filename = 'image.png';
            const mimetype = image.mimetype;
            File.download(filename, image.data, { mimetype });
          }
        }),
      );

      dev.button((btn) =>
        btn
          .label('delete file ↓')
          .enabled((e) => Boolean(e.state.debug.dataEnabled))
          .onClick(async (e) => {
            await crdt?.file.delete();
            await e.change((d) => (d.props.src = undefined));
          }),
      );

      dev.row((e) => (e.state.debug.dataEnabled ? crdt?.render() : null));
    });

    dev.hr(5, 20);

    dev.section('Debug', (dev) => {
      dev.boolean((btn) =>
        btn
          .label((e) => `debug`)
          .value((e) => Boolean(e.state.props.debug))
          .onClick((e) => e.change((d) => (local.debug = Dev.toggle(d.props, 'debug')))),
      );
      dev.boolean((btn) =>
        btn
          .label((e) => `background`)
          .value((e) => Boolean(e.state.debug.bg))
          .onClick((e) => e.change((d) => (local.bg = Dev.toggle(d.debug, 'bg')))),
      );
      dev.hr(-1, 5);
      dev.button('redraw', (e) => dev.redraw());
      dev.button('reset', (e) => e.change((d) => (d.props.src = null)));
    });
  });

  e.it('ui:footer', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    dev.footer.border(-0.1).render<T>((e) => {
      const srcValue = e.state.props.src;
      const srcBinary = Util.srcAsBinary(srcValue);
      const mimetype = srcBinary?.mimetype ?? undefined;
      const bytes = srcBinary?.data.byteLength ?? -1;
      const file = stripBinary(srcBinary);

      const src = typeof srcValue === 'string' ? srcValue : Util.srcAsBinary(srcValue);
      const props = {
        ...e.state.props,
        src: typeof src === 'string' ? src : typeof src,
      };

      const data = {
        props,
        file,
        filesize: bytes > -1 ? Filesize(bytes) : undefined,
        mimetype,
      };

      return <Dev.Object name={'Image'} data={data} expand={1} />;
    });
  });
});

/**
 * Helpers
 */
const stripBinary = (file?: t.ImageBinary | null) => {
  // NB: The Uint8Array is replaced with a string for display purposes. If left as the
  //     binary object, the UI will hanging, attempting to write it as integers to the DOM.
  return !file ? undefined : { ...file, data: `<Uint8Array>[${file.data.byteLength}]` };
};
