import { useEffect } from 'react';
import { MainArgs } from './-ui.dev.Main.Args';
import { Args, Color, KeyHint, css, useFocus, type t } from './common';
import { Ctrl } from '../CmdBar.Ctrl';

export type SampleProps = {
  cmdbar?: t.CmdBarRef | t.Cmd<t.CmdBarCtrlType>;
  size?: t.SizeTuple;
  argv?: string;
  theme?: t.CommonTheme;
  style?: t.CssValue;
};

export const SampleMain: React.FC<SampleProps> = (props) => {
  const { size = [] } = props;
  const focus = useFocus();
  const isFocused = focus.containsFocus;
  const args = Args.parse(props.argv);

  /**
   * Lifecycle
   */
  useEffect(() => {
    const cmdbar = wrangle.cmdbar(props);
    const events = cmdbar?.events();
    events?.on('Focus', (e) => {
      if (e.params.target === 'Main') focus.invoke();
    });
    return events?.dispose;
  }, [props.cmdbar]);

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
      outline: 'none',
      filter: `grayscale(${isFocused ? 0 : 100}%)`,
      transition,
      display: 'grid',
      placeItems: 'center',
    }),
    body: css({
      position: 'relative',
      width: size[0],
      height: size[1],
      display: 'grid',
      cursor: isFocused ? 'default' : 'pointer',
      transform: !isFocused ? `perspective(600px) rotateX(30deg) translateZ(-10px)` : undefined,
      transition: t('transform', 300),
      pointerEvents: 'auto',
    }),
    content: css({
      opacity: isFocused ? 1 : 0.8,
      display: 'grid',
      placeItems: 'center',
    }),
    border: css({
      position: 'relative',
      pointerEvents: 'none',
      Absolute: 8,
      borderRadius: 10,
      border: `dashed 1px ${Color.alpha(theme.fg, 0.9)}`,
      opacity: isFocused ? 0.8 : 0.5,
      backgroundColor: Color.alpha(theme.fg, 0.03),
      transition,
      display: 'grid',
    }),
    label: css({
      Absolute: [-15, 15, null, null],
      fontFamily: 'monospace',
      fontSize: 10,
      opacity: isFocused ? 1 : 0.3,
      transition,
    }),
    keyHint: css({
      Absolute: [null, 0, -25, 0],
      display: 'grid',
      placeItems: 'center',
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

  const elKeyHint = (
    <div {...styles.keyHint}>
      <KeyHint text={'META + J'} theme={theme.name} />
    </div>
  );

  return (
    <div {...css(styles.base, props.style)} ref={focus.ref} tabIndex={0}>
      <div {...styles.body}>
        {elKeyHint}
        <div {...styles.label}>{'main'}</div>
        <div {...styles.content}>
          {elArgs}
          <div {...styles.border}>
            <div />
          </div>
          <div {...styles.piggy}>{'🐷'}</div>
        </div>
      </div>
    </div>
  );
};

/**
 * Helpers
 */
const wrangle = {
  cmdbar(props: SampleProps) {
    return props.cmdbar ? Ctrl.cmdbar(props.cmdbar) : undefined;
  },
} as const;
