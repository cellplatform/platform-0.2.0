import { Spec } from '../../test.ui';
import { css, t } from '../common';
import { RenderCount } from '.';

export default Spec.describe('RenderCount', (e) => {
  e.it('init', async (e) => {
    const ctx = Spec.ctx(e);
    ctx.component
      .display('grid')
      .size(250, 30)
      .render(() => (
        <Sample>
          <RenderCount />
        </Sample>
      ));
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
