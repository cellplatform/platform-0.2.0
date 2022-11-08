import { Test, Time } from '../common';

export default Test.describe('MyComponent', (e) => {
  console.log('describe', e);

  e.it('init', async (e) => {
    console.group('🌳 within spec');
    console.log('e', e);
    console.log('e.ctx', e.ctx);
    console.groupEnd();

    const ctx: any = e.ctx;
    const el = <div>My element from test 🌳</div>;
    ctx.render(el);
  });
});
