import { Spec } from '../../test.ui';
import { ProgressBar } from './ui.ProgressBar';

export default Spec.describe('Video.ProbressBar', (e) => {
  e.it('init', async (e) => {
    const ctx = Spec.ctx(e);
    ctx.subject
      .backgroundColor(1)
      .size('fill-x')
      .render(() => <ProgressBar />);
  });
});
