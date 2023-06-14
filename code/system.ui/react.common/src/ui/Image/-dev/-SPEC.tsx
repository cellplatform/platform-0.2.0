import { Dev, type t, Filesize } from '../../../test.ui';
import { Image } from '..';

type T = {
  props: t.ImageProps;
  file?: t.DroppedFile;
};
const initial: T = { props: {} };

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
            src={e.state.file}
            onDrop={(e) => {
              console.info('⚡️ dropped ', e);
              state.change((d) => (d.file = e.file));
            }}
          />
        );
      });
  });

  e.it('ui:debug', async (e) => {
    const dev = Dev.tools<T>(e, initial);
  });

  e.it('ui:footer', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    dev.footer.border(-0.1).render<T>((e) => {
      const bytes = e.state.file?.data.byteLength ?? -1;

      const data = {
        ...e.state,
        file: e.state.file ? stripBinary(e.state.file) : undefined,
        filesize: bytes > -1 ? Filesize(bytes) : '-',
      };

      return <Dev.Object name={'Image'} data={data} expand={1} />;
    });
  });
});

/**
 * Helpers
 */
const stripBinary = (file?: t.DroppedFile) => {
  // NB: The Uint8Array is replaced with a string for display purposes. If left as the
  //     binary object, the UI will hanging, attempting to write it as integers to the DOM.
  return file ? { ...file, data: `<Uint8Array>[${file.data.byteLength}]` } : undefined;
};
