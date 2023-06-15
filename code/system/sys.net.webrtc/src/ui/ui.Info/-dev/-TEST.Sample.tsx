import { Crdt, Dev, type t } from './common';

export const CreateRepo = Dev.describe('sys.crdt.repo ("project")', (e) => {
  e.it('init', async (e) => {
    const ctx = Wrangle.ctx(e);

    const repo = Crdt.repo();
    console.log('🐷 CRDT repo:', repo);

    ctx.props.change((d) => (d.overlay = 'sys.data.crdt'));
  });
});

export const LoadImage = Dev.describe('sys.ui.image', (e) => {
  e.it('init', async (e) => {
    const ctx = Wrangle.ctx(e);

    ctx.props.change((d) => (d.overlay = 'sys.ui.image'));

    // const repo = Crdt.repo();
    // console.log('repo', repo);
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
      d.overlay = null;
      d.vimeoVisible = false;
      d.imageVisible = false;
    });
  });
});

/**
 * Helpers
 */
const Wrangle = {
  ctx: (e: any) => e.ctx as t.TDevRunnerCtx,
};
