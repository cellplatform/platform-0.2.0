import { Button } from '.';
import { Spec } from '../../test.ui';

export default Spec.describe('Button', (e) => {
  e.it('init', async (e) => {
    const ctx = Spec.ctx(e);
    ctx.component
      .display('grid')
      .size(250, undefined)
      .render(() => {
        const right = <div>123</div>;
        return <Button ctx={ctx} label={'My Button'} right={right} />;
      });
  });
});
