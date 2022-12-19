import { Spec } from '../../../test.ui';
import { Icons } from './sample';

export default Spec.describe('Icon', (e) => {
  e.it('init', (e) => {
    const ctx = Spec.ctx(e);
    ctx.component.render(() => {
      return <Icons.Face size={150} />;
    });
  });
});
