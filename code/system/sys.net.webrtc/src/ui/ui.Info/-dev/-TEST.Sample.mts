import { Dev, t, Time } from './common';

export default Dev.describe('Setup new Canvas project', (e) => {
  e.it('foo', async (e) => {
    const ctx = Wrangle.ctx(e);
    await Time.wait(300);

    ctx.props.change((d) => {
      d.vimeoVisible = true;
      d.vimeoId = '727951677';

      d.imageFit = 'contain';
      d.imageVisible = true;
      d.imageUrl =
        'https://user-images.githubusercontent.com/185555/208217954-0427e91d-fcb3-4e9a-b5f1-1f86ed3500bf.png';
    });
  });
});

export const One = Dev.describe('Show runner specifications', (e) => {
  e.it('foo', async (e) => {
    const ctx = Wrangle.ctx(e);
    await Time.wait(300);
    ctx.props.change((d) => {});
  });
});

export const Two = Dev.describe('Show CRDT tests', (e) => {
  e.it('foo', async (e) => {
    const ctx = Wrangle.ctx(e);
    await Time.wait(300);
  });
});

/**
 * Helpers
 */
const Wrangle = {
  ctx: (e: any) => e.ctx as t.TDevRunnerCtx,
};
