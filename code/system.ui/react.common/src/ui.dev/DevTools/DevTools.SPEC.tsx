import { DevTools } from '.';
import { RenderCount, Spec } from '../../test.ui';
import { css } from '../common';

const initial = { count: 0 };
type S = typeof initial;

export default Spec.describe('DevTools', (e) => {
  e.it('init', async (e) => {
    const ctx = Spec.ctx(e);
    ctx.component
      .display('grid')
      .size(350, undefined)
      .backgroundColor(1)
      .render<S>((e) => <Sample state={e.state} />);
  });

  e.it('debug panel', async (e) => {
    const dev = DevTools.init<S>(e, initial);
    dev.button((btn) =>
      btn.label('My Button').onClick(async (e) => {
        await e.state.change((draft) => draft.count++);
        e.label(`count-${e.state.current.count}`);
      }),
    );
  });
});

/**
 * Sample
 */
export type SampleProps = { state: S };
export const Sample: React.FC<SampleProps> = (props) => {
  const json = JSON.stringify(props.state, null, '  ');
  const styles = {
    base: css({ Padding: [5, 12], fontSize: 14 }),
  };
  return (
    <div {...styles.base}>
      <pre>state: {json}</pre>
      <RenderCount />
    </div>
  );
};
