import { Dev, Time, type t } from './common';

export const Project = Dev.describe('sys.data.project', (e) => {
  e.it('init', async (e) => {
    const ctx = Wrangle.ctx(e);
    await Time.wait(300);
  });
});

export const Crdt = Dev.describe('sys.data.crdt', (e) => {
  e.it('init', async (e) => {
    const ctx = Wrangle.ctx(e);
    ctx.props.change((d) => (d.showRight = false));

    const { Specs } = await import('sys.data.crdt/specs');
    const m = await Specs['sys.crdt.tests']();

    const el = <Dev.Harness spec={m.default} background={1} />;
    ctx.overlay(el);
  });
});

export const Sketch = Dev.describe('temp: concept player sketch', (e) => {
  e.it('init', async (e) => {
    const ctx = Wrangle.ctx(e);
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

export const Reset = Dev.describe('reset', (e) => {
  e.it('reset', async (e) => {
    const ctx = Wrangle.ctx(e);
    ctx.props.change((d) => {
      d.vimeoVisible = false;
      d.imageVisible = false;
    });
    await ctx.overlay(null);
  });
});

/**
 * Helpers
 */
const Wrangle = {
  ctx: (e: any) => e.ctx as t.TDevRunnerCtx,
};
