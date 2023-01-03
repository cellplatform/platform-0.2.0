import { Spec, css } from '../test.ui';
import { useSizeObserver } from 'sys.util.react';

export default Spec.describe('hook.useSizeObserver', (e) => {
  e.it('init', async (e) => {
    const ctx = Spec.ctx(e);
    ctx.component
      .size('fill', 150)
      .display('flex')
      .backgroundColor(1)
      .render(() => <Sample />);
  });
});

/**
 * Component
 */
const Sample = () => {
  const size = useSizeObserver();
  const styles = {
    base: css({ flex: 1, paddingTop: 20, paddingLeft: 40 }),
  };
  return (
    <div {...styles.base} ref={size.ref}>
      <pre>{JSON.stringify(size.rect, null, '..')}</pre>
    </div>
  );
};
