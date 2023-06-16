import { Image } from '..';
import { Dev, Filesize, type t } from '../../../test.ui';
import { type DevDataController } from './-DEV.data';

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

export default Dev.describe('Image', (e) => {
  type LocalStore = T['debug'];
  const localstore = Dev.LocalStorage<LocalStore>('dev:sys.ui.common.Image');
  const local = localstore.object({
    bg: true,
    dataEnabled: false,
    dropEnabled: true,
    pasteEnabled: true,
    pastePrimary: false,
  });

  const getDrop = (props: t.ImageProps) => props.drop || (props.drop = DEFAULTS.drop);
  const getPaste = (props: t.ImageProps) => props.paste || (props.paste = DEFAULTS.paste);

  let crdt: DevDataController | undefined;
  const initCrdt = async () => {
    const { DevDataController } = await import('./-DEV.data');
    crdt = await DevDataController();
    return crdt;
  };

  e.it('ui:init', async (e) => {
    const ctx = Dev.ctx(e);
    const state = await ctx.state<T>(initial);

    await state.change((d) => {
      d.debug.bg = local.bg;
      d.debug.dataEnabled = local.dataEnabled;
      d.props.sizing = DEFAULTS.sizing;
      getDrop(d.props).enabled = local.dropEnabled;
      getPaste(d.props).enabled = local.pasteEnabled;
      getPaste(d.props).primary = local.pastePrimary;
    });

    if (state.current.debug.dataEnabled) {
      const crdt = await initCrdt();
      const { mimetype, data } = crdt.file.doc.current;
      console.log('data', mimetype, data);
      if (data && mimetype) {
        const file: t.ImageBinary = { mimetype, data };
        await state.change((d) => (d.props.src = file));
      }
    }

    ctx.debug.width(350);
    ctx.host.tracelineColor(-0.05);
    ctx.subject
      .size('fill', 100)
      .display('grid')

      .render<T>(async (e) => {
        ctx.subject.backgroundColor(e.state.debug.bg ? 1 : 0);
        if (e.state.debug.dataEnabled) await initCrdt();

        return (
          <Image
            {...e.state.props}
            onDropOrPaste={(e) => {
              console.info('⚡️ onDropOrPaste:', e);
              if (e.isSupported) {
                state.change((d) => (d.props.src = e.file));

                // Save to file.
                if (crdt) {
                  crdt.file.doc.change((d) => {
                    d.data = e.file?.data;
                    d.mimetype = e.file?.mimetype;
                  });
                }
              }
            }}
          />
        );
      });
  });

  e.it('ui:debug', async (e) => {
    const dev = Dev.tools<T>(e, initial);

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
        dev.button((btn) =>
          btn
            .label(`${strategy}`)
            .right((e) => (e.state.props.sizing === strategy ? '←' : ''))
            .onClick((e) => {
              e.change((d) => (d.props.sizing = strategy));
            }),
        );
      };

      size('cover');
      size('contain');
    });

    dev.hr(2, 20);

    dev.section('CRDT', (dev) => {
      dev.boolean((btn) =>
        btn
          .label((e) => `data ${e.state.debug.dataEnabled ? 'enabled' : 'disabled'}`)
          .value((e) => Boolean(e.state.debug.dataEnabled))
          .onClick(async (e) => {
            e.change((d) => (local.dataEnabled = Dev.toggle(d.debug, 'dataEnabled')));
            if (local.dataEnabled) {
              await initCrdt();
              dev.redraw();
            }
          }),
      );

      dev.hr(-1, 5);

      dev.button((btn) =>
        btn
          .label('delete file')
          .enabled((e) => Boolean(e.state.debug.dataEnabled))
          .onClick((e) => crdt?.file.delete()),
      );

      dev.row((e) => (e.state.debug.dataEnabled ? crdt?.render() : null));
    });

    dev.hr(5, 20);

    dev.section(['', 'Debug'], (dev) => {
      dev.boolean((btn) =>
        btn
          .label((e) => `background`)
          .value((e) => Boolean(e.state.debug.bg))
          .onClick((e) => e.change((d) => (local.bg = Dev.toggle(d.debug, 'bg')))),
      );

      dev.hr(-1, 5);

      dev.button('reset', (e) => {
        e.state.change((d) => (d.props.src = undefined));
      });

      dev.button('redraw', (e) => dev.redraw());
    });
  });

  e.it('ui:footer', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    dev.footer.border(-0.1).render<T>((e) => {
      const src = e.state.props.src;
      const bytes = typeof src === 'object' ? src.data.byteLength : -1;
      const file = typeof src === 'object' ? stripBinary(src) : undefined;
      const mimetype = typeof src === 'object' ? src.mimetype : undefined;

      const props = {
        ...e.state.props,
        src: typeof src === 'string' ? src : stripBinary(src),
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
const stripBinary = (file?: t.ImageBinary) => {
  // NB: The Uint8Array is replaced with a string for display purposes. If left as the
  //     binary object, the UI will hanging, attempting to write it as integers to the DOM.
  return file ? { ...file, data: `<Uint8Array>[${file.data.byteLength}]` } : undefined;
};
