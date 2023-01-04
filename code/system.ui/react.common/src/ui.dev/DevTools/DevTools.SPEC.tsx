import { DevTools } from '.';
import { Spec, RenderCount } from '../../test.ui';
import { css, t } from '../common';

const initial = { count: 0 };
type T = typeof initial;

export default Spec.describe('DevTools', (e) => {
  e.it('init', async (e) => {
    const ctx = Spec.ctx(e);
    ctx.component
      .display('grid')
      .size(350, undefined)
      .backgroundColor(1)
      .render<T>((e) => <Sample state={e.state} />);
  });

  e.it('buttons', async (e) => {
    const dev = DevTools.curry(e);

    dev.button((e) =>
      e.label('My Button').onClick(async (e) => {
        const state = await e.ctx.state({ count: 0 });
        await state.change((draft) => draft.count++);
      }),
    );
  });
});

/**
 * Sample
 */
export type SampleProps = { state: T };
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
