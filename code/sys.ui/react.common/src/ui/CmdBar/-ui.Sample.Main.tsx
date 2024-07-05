import { useEffect } from 'react';
import { Color, css, useFocus, type t, Args } from './common';
import { Ctrl } from './ctrl';
import { MainArgs } from './-ui.Sample.Main.Args';

export type SampleMainProps = {
  cmd?: t.CmdBarCtrl | t.Cmd<t.CmdBarCtrlType>;
  size: [number, number];
  theme?: t.CommonTheme;
  style?: t.CssValue;
};

export const SampleMain: React.FC<SampleMainProps> = (props) => {
  const { cmd, size } = props;
  const focus = useFocus();
  const isFocused = focus.containsFocus;


  /**
   * Lifecycle
   */
  useEffect(() => {
    const cmdbar = cmd ? Ctrl.cmdbar(cmd) : undefined;
    const events = cmdbar?.cmd.events();
    events?.on('Key:Action', (e) => {
      const name = e.params.name;
      if (name === 'FocusMain') focus.focus();
    });
    return events?.dispose;
  }, [cmd]);

  /**
   * Render
   */
  const t = (prop: string, time: t.Milliseconds = 100) => `${prop} ${time}ms ease-in-out`;
  const transition = [t('opacity'), t('font-size')].join(', ');
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
      width: size[0],
      height: size[1],
      outline: 'none',
      display: 'grid',
      cursor: isFocused ? 'default' : 'pointer',
      transform: !isFocused ? `perspective(800px) rotateX(50deg) translateZ(-10px)` : undefined,
      transition: t('transform', 300),
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
      transition: transition,
    }),
    label: css({
      Absolute: [-10, 15, null, null],
      fontFamily: 'monospace',
      fontSize: 10,
      opacity: isFocused ? 1 : 0.3,
      transition: transition,
    }),
    piggy: css({
      fontSize: 36,
      filter: `grayscale(${isFocused ? 0 : 100}%)`,
      transition,
      textShadow: `0px 4px 18px ${Color.format(theme.is.light ? 0 : isFocused ? -0.3 : -0.1)}`,
      opacity: isFocused ? 1 : 0.5,
    }),
  };

  const elArgs = args && (
    <MainArgs args={args} isFocused={isFocused} style={{ Absolute: 15 }} theme={theme.name} />
  );

  return (
    <div {...css(styles.base, props.style)}>
      <div {...styles.body} ref={focus.ref} tabIndex={0}>
        <div {...styles.label}>{'main'}</div>
        <div {...styles.content}>
          {elArgs}
          <div {...styles.piggy}>{'🐷'}</div>
          <div {...styles.border} />
        </div>
      </div>
    </div>
  );
};
