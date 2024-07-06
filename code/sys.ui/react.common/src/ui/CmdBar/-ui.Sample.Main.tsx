import { useEffect } from 'react';
import { MainArgs } from './-ui.Sample.Main.Args';
import { Args, COLORS, Color, css, useFocus, type t } from './common';
import { Ctrl } from './ctrl';

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
      if (name === 'Focus:Main') focus.focus();
    });
    return events?.dispose;
  }, [cmd]);

  /**
   * Render
   */
  const t = (prop: string, time: t.Msecs = 100) => `${prop} ${time}ms`;
  const transition = [t('opacity'), t('font-size'), t('background-color')].join(', ');
  const theme = Color.theme(props.theme);
  const styles = {
    base: css({
      color: theme.fg,
      userSelect: 'none',
      display: 'grid',
      placeItems: 'center',
      outline: 'none',
      filter: `grayscale(${isFocused ? 0 : 100}%)`,
      transition,
    }),
    body: css({
      position: 'relative',
      width: size[0],
      height: size[1],
      display: 'grid',
      cursor: isFocused ? 'default' : 'pointer',
      transform: !isFocused ? `perspective(300px) rotateX(40deg) translateZ(-10px)` : undefined,
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
      border: `dashed 1px ${COLORS.MAGENTA}`,
      opacity: isFocused ? 0.8 : 0.3,
      backgroundColor: Color.alpha(theme.fg, 0.03),
      transition,
    }),
    label: css({
      Absolute: [-10, 15, null, null],
      fontFamily: 'monospace',
      fontSize: 10,
      opacity: isFocused ? 1 : 0.3,
      transition,
    }),
    piggy: css({
      fontSize: 48,
      textShadow: `0px 4px 18px ${Color.format(theme.is.light ? 0 : isFocused ? -0.3 : -0.1)}`,
      opacity: isFocused ? 1 : theme.is.dark ? 0.2 : 0.4,
      transition,
    }),
  };

  const elArgs = args && (
    <MainArgs args={args} isFocused={isFocused} style={{ Absolute: 15 }} theme={theme.name} />
  );

  return (
    <div {...css(styles.base, props.style)} ref={focus.ref} tabIndex={0}>
      <div {...styles.body}>
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
