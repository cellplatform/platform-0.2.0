import { Util } from '../Util.mjs';
import { Button, Keyboard, css, t, useMouseState } from '../common';

export type SpecsResetProps = {
  data: t.TestRunnerPropListData;
  style?: t.CssValue;
};

export const SpecsReset: React.FC<SpecsResetProps> = (props) => {
  const mouse = useMouseState();
  const keyboard = Keyboard.useKeyboardState();
  const isMeta = keyboard.current.modifiers.meta;
  const isClear = isMeta && mouse.isOver;
  const label = isClear ? 'clear' : 'all';

  /**
   * Handlers
   */
  const handleResetClick = (e: React.MouseEvent) => {
    const specs = props.data?.specs ?? {};
    const modifiers = Util.modifiers(e);
    specs.onReset?.({ modifiers });
  };

  /**
   * [Render]
   */
  const styles = {
    base: css({ flex: 1, Flex: 'horizontal-center-end' }),
    button: css({ marginRight: isClear ? 0 : 5 }),
  };

  return (
    <div {...css(styles.base, props.style)} {...mouse.handlers}>
      <Button onClick={handleResetClick} style={styles.button}>
        {label}
      </Button>
    </div>
  );
};
