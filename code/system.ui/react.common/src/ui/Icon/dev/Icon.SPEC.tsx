import { Spec } from '../../../test.ui';
import { Icons } from './sample';

export default Spec.describe('Icon', (e) => {
  e.it('init', (e) => {
    const ctx = Spec.ctx(e);
    const el = <Icons.Face size={150} />;
    ctx.render(el);
  });
});
