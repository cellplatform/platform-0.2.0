import { Dev } from '../../../test.ui';
import { Icons } from './Icons.sample.mjs';

export default Dev.describe('Icon', (e) => {
  e.it('init', (e) => {
    const ctx = Dev.ctx(e);
    ctx.component.render(() => {
      return <Icons.Face size={150} />;
    });
  });
});
