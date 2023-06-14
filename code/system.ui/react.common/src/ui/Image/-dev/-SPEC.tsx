import { Dev, type t, Filesize } from '../../../test.ui';
import { Image } from '..';

type T = { props: t.ImageProps };
const initial: T = {
  props: {},
};

export default Dev.describe('Image', (e) => {
  e.it('ui:init', async (e) => {
    const ctx = Dev.ctx(e);
    const state = await ctx.state<T>(initial);
    ctx.subject
      .backgroundColor(1)
      .size('fill', 100)
      .display('grid')
      .render<T>((e) => {
        return (
          <Image
            {...e.state.props}
            onAdd={(e) => {
              console.info('⚡️ onAdd:', e);
              if (e.isSupported) state.change((d) => (d.props.src = e.file));
            }}
          />
        );
      });
  });

  e.it('ui:debug', async (e) => {
    const dev = Dev.tools<T>(e, initial);

    dev.section('Properties', (dev) => {
      const getDrop = (props: t.ImageProps) => props.drop || (props.drop = Image.DEFAULTS.drop);
      const getPaste = (props: t.ImageProps) => props.paste || (props.paste = Image.DEFAULTS.paste);

      dev.boolean((btn) =>
        btn
          .label((e) => `drop.enabled`)
          .value((e) => Boolean(e.state.props.drop?.enabled ?? Image.DEFAULTS.drop))
          .onClick((e) => e.change((d) => Dev.toggle(getDrop(d.props), 'enabled'))),
      );

      dev.boolean((btn) =>
        btn
          .label((e) => `paste.enabled`)
          .value((e) => Boolean(e.state.props.paste?.enabled ?? Image.DEFAULTS.paste))
          .onClick((e) => e.change((d) => Dev.toggle(getPaste(d.props), 'enabled'))),
      );
    });

    dev.hr(8, 20);

    dev.section('Debug', (dev) => {
      dev.button('reset', (e) => {
        e.state.change((d) => (d.props.src = undefined));
      });
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
