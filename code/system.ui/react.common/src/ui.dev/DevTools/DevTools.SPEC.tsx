import { Spec } from '../../test.ui';
import { Button } from '../DevTools.Button';

export default Spec.describe('ui.dev.DevTools', (e) => {
  e.it('init', async (e) => {
    const ctx = Spec.ctx(e);
    ctx.component
      .display('grid')
      .size(250, undefined)
      .render(() => <Button ctx={ctx} label={'MyButton'} />);
  });
});
