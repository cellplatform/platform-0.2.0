import { Color, css, type t } from '../../test.ui';
import { Textbox } from './ui.Textbox';

/**
 * <Layout>
 */
export type LayoutProps = {
  left?: t.Lens;
  right?: t.Lens;
  path?: t.ObjectPath;
  theme?: t.CommonTheme;
  style?: t.CssValue;
};
export const Layout: React.FC<LayoutProps> = (props) => {
  const { left, right, theme, path } = props;

  /**
   * Render
   */
  const color = Color.theme(theme).fg;
  const styles = {
    base: css({ color, display: 'grid', rowGap: '30px', userSelect: 'none' }),
    textbox: css({ width: 260 }),
  };

  return (
    <div {...css(styles.base, props.style)}>
      <div {...styles.textbox}>
        <Textbox debug={'🐷'} theme={theme} doc={left} path={path} focus={true} />
      </div>
      <div></div>
      <div {...styles.textbox}>
        <Textbox debug={'🌼'} theme={theme} doc={right} path={path} />
      </div>
    </div>
  );
};
