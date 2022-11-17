import { Spec } from '../test.ui';
import { useSizeObserver } from 'sys.util.react';

export default Spec.describe('hook.useSizeObserver', (e) => {
  e.it('init', async (e) => {
    const ctx = Spec.ctx(e);
    ctx
      .size('fill', 150)
      .display('flex')
      .backgroundColor(1)
      .render(<Sample />);
  });
});

export const Sample = () => {
  const size = useSizeObserver();
  return (
    <div style={{ flex: 1, paddingTop: 20, paddingLeft: 40 }} ref={size.ref}>
      <pre>{JSON.stringify(size.rect, null, '..')}</pre>
    </div>
  );
};
