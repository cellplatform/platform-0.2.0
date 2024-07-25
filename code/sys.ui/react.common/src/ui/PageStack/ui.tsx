import { Color, css, DEFAULTS, type t } from './common';
import { Page } from './ui.Page';

export const View: React.FC<t.PageStackProps> = (props) => {
  const {
    total = DEFAULTS.props.total,
    current: current = DEFAULTS.props.current,
    transition = DEFAULTS.props.transition,
  } = props;

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

  const length = total + 2; // NB: +2 ← the edges that fall off into 0-opacity.
  const pages = Array.from({ length }).map((_, i) => i + current);
  const elPages = pages.map((id, i) => {
    const index = pages.length - i - 1;
    let opacity = index === 0 || index > total ? 0 : 1;
    if (id - 1 < total) opacity = 0;
    return (
      <Page
        //
        key={id}
        index={index}
        opacity={opacity}
        transition={transition}
        theme={theme}
      />
    );
  });

  return <div {...css(styles.base, props.style)}>{elPages}</div>;
};
