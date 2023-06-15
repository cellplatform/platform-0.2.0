import { Dev, type t, Filesize } from '../../../test.ui';
import { Image } from '..';

type T = {
  props: t.ImageProps;
  debug: {
    bg?: boolean;
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
    dropEnabled: true,
    pasteEnabled: true,
    pastePrimary: false,
  });

  const getDrop = (props: t.ImageProps) => props.drop || (props.drop = Image.DEFAULTS.drop);
  const getPaste = (props: t.ImageProps) => props.paste || (props.paste = Image.DEFAULTS.paste);

  e.it('ui:init', async (e) => {
    const ctx = Dev.ctx(e);
    const state = await ctx.state<T>(initial);

    await state.change((d) => {
      d.debug.bg = local.bg;
      getDrop(d.props).enabled = local.dropEnabled;
      getPaste(d.props).enabled = local.pasteEnabled;
      getPaste(d.props).primary = local.pastePrimary;
    });

    ctx.subject
      .size('fill', 100)
      .display('grid')
      .render<T>((e) => {
        ctx.subject.backgroundColor(e.state.debug.bg ? 1 : 0);

        return (
          <Image
            {...e.state.props}
            onDropOrPaste={(e) => {
              console.info('⚡️ onDropOrPaste:', e);
              if (e.isSupported) state.change((d) => (d.props.src = e.file));
            }}
          />
        );
      });
  });

  e.it('ui:debug', async (e) => {
    const dev = Dev.tools<T>(e, initial);

    dev.section('Properties', (dev) => {
      dev.boolean((btn) =>
        btn
          .label((e) => `drop.enabled`)
          .value((e) => Boolean(e.state.props.drop?.enabled ?? Image.DEFAULTS.drop.enabled))
          .onClick((e) =>
            e.change((d) => (local.dropEnabled = Dev.toggle(getDrop(d.props), 'enabled'))),
          ),
      );

      dev.hr(-1, 5);

      dev.boolean((btn) =>
        btn
          .label((e) => `paste.enabled`)
          .value((e) => Boolean(e.state.props.paste?.enabled ?? Image.DEFAULTS.paste.enabled))
          .onClick((e) =>
            e.change((d) => (local.pasteEnabled = Dev.toggle(getPaste(d.props), 'enabled'))),
          ),
      );

      dev.boolean((btn) =>
        btn
          .label((e) => `paste.primary`)
          .value((e) => Boolean(e.state.props.paste?.primary ?? Image.DEFAULTS.paste.primary))
          .onClick((e) =>
            e.change((d) => (local.pastePrimary = Dev.toggle(getPaste(d.props), 'primary'))),
          ),
      );
    });

    dev.hr(8, 20);

    dev.section('Debug', (dev) => {
      dev.button('reset', (e) => {
        e.state.change((d) => (d.props.src = undefined));
      });

      dev.hr(-1, 5);

      dev.boolean((btn) =>
        btn
          .label((e) => `background`)
          .value((e) => Boolean(e.state.debug.bg))
          .onClick((e) => e.change((d) => (local.bg = Dev.toggle(d.debug, 'bg')))),
      );
    });
  });

  e.it('ui:footer', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    dev.footer.border(-0.1).render<T>((e) => {
      const src = e.state.props.src;
      const bytes = typeof src === 'object' ? src.data.byteLength : -1;
      const file = typeof src === 'object' ? stripBinary(src) : undefined;

      const props = {
        ...e.state.props,
        src: typeof src === 'string' ? src : stripBinary(src),
      };

      const data = {
        props,
        file,
        filesize: bytes > -1 ? Filesize(bytes) : undefined,
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
