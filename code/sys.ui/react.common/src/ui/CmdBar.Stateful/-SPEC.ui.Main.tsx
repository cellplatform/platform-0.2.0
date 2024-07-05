import { useEffect } from 'react';
import { Color, css, type t, useFocus } from './common';

export type SampleMainProps = {
  cmdbar?: t.CmdBarCtrl;
  size: [number, number];
  theme?: t.CommonTheme;
  style?: t.CssValue;
};

export const SampleMain: React.FC<SampleMainProps> = (props) => {
  const { cmdbar, size } = props;
  const focus = useFocus();
  const isFocused = focus.containsFocus;

  useEffect(() => {
    const events = cmdbar?.cmd.events();
    events?.on('Key:Action', (e) => {
      const name = e.params.name;
      if (name === 'FocusMain') focus.focus();
    });
    return events?.dispose;
  }, []);

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
      outline: 'none',
      display: 'grid',
    }),
    content: css({
      opacity: isFocused ? 1 : 0.5,
      display: 'grid',
      placeItems: 'center',
    }),
    border: css({
      pointerEvents: 'none',
      Absolute: 8,
      borderRadius: 10,
      border: `dashed 1px ${theme.fg}`,
      opacity: isFocused ? 0.8 : 0.2,
      transition: 'opacity 100ms ease',
    }),
    label: css({
      Absolute: [-15, 5, null, null],
      fontFamily: 'monospace',
      fontSize: 10,
      opacity: 0.3,
    }),
    piggy: css({
      fontSize: isFocused ? 24 : 16,
      transition: 'font-size 100ms ease',
    }),
  };

  return (
    <div {...css(styles.base, props.style)}>
      <div {...styles.body} ref={focus.ref} tabIndex={0}>
        <div {...styles.label}>{'main'}</div>
        <div {...styles.content}>
          <div {...styles.piggy}>{'🐷'}</div>
          <div {...styles.border} />
        </div>
      </div>
    </div>
  );
};
