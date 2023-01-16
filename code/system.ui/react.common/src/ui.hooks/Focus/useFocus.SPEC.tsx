import { Color, t, css, Dev } from '../../test.ui';
import { useFocus } from '.';

export default Dev.describe('useFocus', (e) => {
  e.it('init', async (e) => {
    const ctx = Dev.ctx(e);
    ctx.subject
      .display('grid')
      .backgroundColor(1)
      .size(400, null)
      .render((e) => <Sample />);
  });

  e.it('debug panel', async (e) => {
    const dev = Dev.tools(e);
    dev.row(() => {
      const style: t.CssValue = {
        border: `dashed 1px ${Color.format(-0.2)}`,
        borderRadius: 5,
        marginBottom: 20,
      };
      return <Sample style={style} />;
    });

    dev.TODO('not clear that `withinFocus` is operating correctly');
  });
});

/**
 * Sample
 */
type SampleProps = { style?: t.CssValue };
const Sample = (props: SampleProps) => {
  const focus = useFocus<HTMLDivElement>();
  const { containsFocus, withinFocus } = focus;
  const data = { containsFocus, withinFocus };

  const styles = {
    base: css({ padding: 20, paddingTop: 17, boxSizing: 'border-box' }),
    obj: css({ marginTop: 10 }),
  };
  return (
    <div {...css(styles.base, props.style)} ref={focus.ref} tabIndex={0}>
      <div>{`🐷 useFocus ${focus.withinFocus ? '- Focused' : ''}`}</div>
      <Dev.Object data={data} style={styles.obj} />
    </div>
  );
};
