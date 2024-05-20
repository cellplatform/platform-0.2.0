import { Dev } from '../../test.ui';
import { Font, FontCard, FontCardProps } from '.';

type T = { props: FontCardProps };
const initial: T = {
  props: {
    size: 220,
    font: { family: 'Merriweather' },
    char: FontCard.DEFAULTS.char,
  },
};

export default Dev.describe('Font', (e) => {
  e.it('init', async (e) => {
    const ctx = Dev.ctx(e);
    await ctx.state<T>(initial);
    ctx.subject
      .backgroundColor(1)
      .display('grid')
      .render<T>((e) => {
        return <FontCard />;
      });
  });

  e.it('ui:debug', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    dev.footer
      .border(-0.1)
      .render<T>((e) => <Dev.Object name={'spec'} data={e.state} expand={1} />);

    // dev.button('tmp', (e) => e.change((d) => d.count++));
    dev.TODO('WIP (Work In Progress)');
  });
});
