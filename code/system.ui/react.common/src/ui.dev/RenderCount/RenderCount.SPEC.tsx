import { Dev } from '../../test.ui';
import { css, t } from '../common';
import { RenderCount } from '.';

type S = { count: number };
const initial: S = { count: 0 };

export default Dev.describe('RenderCount', (e) => {
  e.it('init', async (e) => {
    const ctx = Dev.ctx(e);
    ctx.component
      .display('grid')
      .size(250, 30)
      .render<S>(() => (
        <Sample>
          <RenderCount />
        </Sample>
      ));
  });

  e.it('debug panel', async (e) => {
    const dev = Dev.tools<S>(e, initial);
    dev.button('redraw', (e) => e.change((d) => d.count++));
  });
});

/**
 * Sample Container
 */
export type SampleProps = {
  children?: JSX.Element;
  style?: t.CssValue;
};

export const Sample: React.FC<SampleProps> = (props) => {
  const styles = {
    base: css({
      paddingLeft: 5,
      position: 'relative',
      backgroundColor: 'rgba(255, 0, 0, 0.1)' /* RED */,
      display: 'grid',
      alignContent: 'center',
    }),
  };
  return (
    <div {...css(styles.base, props.style)}>
      <div>{`🐷`}</div>
      {props.children}
    </div>
  );
};
