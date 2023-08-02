import {
  Button,
  Color,
  COLORS,
  css,
  Spinner,
  State,
  t,
  useClickOutside,
  useMouse,
} from '../common';
import { Icons } from '../Icons.mjs';
import { useOverlayState } from './useOverlayState.mjs';

export type OverlayFrameProps = {
  instance: t.Instance;
  def: t.OverlayDef;
  style?: t.CssValue;
};

export const OverlayFrame: React.FC<OverlayFrameProps> = (props) => {
  const { instance } = props;

  const outside = useClickOutside((e) => State.withEvents(instance, (e) => e.overlay.close()));
  const state = useOverlayState(instance, props.def);
  const mouse = {
    root: useMouse(),
    body: useMouse(),
  };

  const isOverGutter = mouse.root.isOver && !mouse.body.isOver;

  /**
   * [Render]
   */
  const styles = {
    base: css({
      position: 'relative',
      backgroundColor: Color.format(0.8),
      backdropFilter: `blur(${isOverGutter ? 8 : 40}px)`,
    }),
    body: css({
      Absolute: 80,
      borderRadius: 8,
      boxSizing: 'border-box',
      padding: 30,
      overflow: 'hidden',
      boxShadow: `0 0 60px 0 ${Color.format(-0.1)}`,
      border: `solid 1px `,
      '@media (max-width: 1100px)': { opacity: 0, pointerEvents: 'none' },

      borderColor: Color.format(1),
      backgroundColor: Color.format(isOverGutter ? 0.15 : 1),
      transition: `background-color 350ms, border-color 150ms`,
    }),
    close: css({
      Absolute: [12, 12, null, null],
      opacity: isOverGutter ? 1 : 0.1,
      transition: `opacity 200ms`,
    }),
  };

  const elSpinner = !state.ready && (
    <Spinner.Center style={{ Absolute: 0 }}>
      <Spinner.Puff size={54} />
    </Spinner.Center>
  );

  const el = state.ready && state.Component && state.content?.md && (
    <state.Component instance={instance} dimmed={isOverGutter} style={{ Absolute: 0 }} />
  );

  const elClose = (
    <Button style={styles.close}>
      <Icons.Close size={60} color={COLORS.DARK} />
    </Button>
  );

  return (
    <div {...css(styles.base, props.style)} {...mouse.root.handlers}>
      <div ref={outside.ref} {...styles.body} {...mouse.body.handlers}>
        {el}
        {elSpinner}
      </div>
      {elClose}
    </div>
  );
};
