import { Spec, css } from '../../test.ui';
import { Center } from '.';

export default Spec.describe('Spinner', (e) => {
  e.it('init', async (e) => {
    const ctx = Spec.ctx(e);

    const styles = {
      base: css({
        flex: 1,
        overflow: 'hidden',
        backgroundColor: 'rgba(255, 0, 0, 0.1)' /* RED */,
      }),
      child: css({ fontSize: 120 }),
    };

    const el = (
      <Center style={styles.base}>
        <div {...styles.child}>🐷</div>
      </Center>
    );

    ctx.size('fill').display('flex').render(el);
  });
});
