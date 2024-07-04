import { Color, css, type t, useFocus } from './common';

export type SampleMainProps = {
  cmdbar?: t.CmdBarCtrl;
  size?: [number, number];
  theme?: t.CommonTheme;
  style?: t.CssValue;
};

export const SampleMain: React.FC<SampleMainProps> = (props) => {
  const { size = [150, 30] } = props;
  const focus = useFocus();
  const isFocused = focus.containsFocus;

  /**
   * Render
   */
  const theme = Color.theme(props.theme);
  const styles = {
    base: css({
      color: theme.fg,
      userSelect: 'none',
      display: 'grid',
      placeItems: 'center',
    }),
    body: css({
      position: 'relative',
      backgroundColor: 'rgba(255, 0, 0, 0.1)' /* RED */,
      width: size[0],
      height: size[1],

      display: 'grid',
      placeItems: 'center',
      opacity: isFocused ? 1 : 0.5,
    }),
    border: css({
      pointerEvents: 'none',
      Absolute: 10,
      border: `dashed 1px ${Color.alpha(theme.fg, isFocused ? 0.8 : 0.2)}`,
      borderRadius: 10,
    }),
    label: css({
      Absolute: [-15, null, null, 0],
      fontFamily: 'monospace',
      fontSize: 10,
    }),
  };

  ('⚡️💦🐷🌳🦄 🍌🧨🌼✨🧫 🐚👋🧠⚠️ 💥👁️ ↑↓←→');

  return (
    <div {...css(styles.base, props.style)}>
      <div {...styles.body} ref={focus.ref} tabIndex={0}>
        {'🐷'}
        <div {...styles.border} />
        <div {...styles.label}>{'main'}</div>
      </div>
    </div>
  );
};
