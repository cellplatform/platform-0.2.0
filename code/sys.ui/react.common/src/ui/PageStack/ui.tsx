import { Color, css, DEFAULTS, type t } from './common';
import { Page } from './ui.Page';

export const View: React.FC<t.PageStackProps> = (props) => {
  const { pages = [] } = props;

  /**
   * Render
   */
  const theme = Color.theme(props.theme);
  const styles = {
    base: css({
      position: 'relative',
      color: theme.fg,
    }),
  };

  const elPages = [...pages.reverse()].map((id, i) => {
    const index = pages.length - i;
    return <Page key={id} id={id} index={index} theme={theme} />;
  });

  return <div {...css(styles.base, props.style)}>{elPages}</div>;
};
