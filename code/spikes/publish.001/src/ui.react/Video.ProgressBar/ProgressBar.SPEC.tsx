import { Spec, expect } from '../../test.ui';
import { ProgressBar } from './ProgressBar';

export default Spec.describe('Video.ProbressBar', (e) => {
  e.it('init', async (e) => {
    const ctx = Spec.ctx(e);
    const el = <ProgressBar />;
    ctx.backgroundColor(1).size('fill-x').render(el);
  });
});
