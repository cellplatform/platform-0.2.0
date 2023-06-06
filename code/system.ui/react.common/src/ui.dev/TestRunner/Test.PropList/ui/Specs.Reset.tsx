import { Util } from '../Util.mjs';
import { Button, Keyboard, css, useMouseState, type t } from '../common';

export type SpecsResetProps = {
  data: t.TestPropListData;
  groups: t.TestSuiteGroup[];
  enabled?: boolean;
  style?: t.CssValue;
};

export const SpecsReset: React.FC<SpecsResetProps> = (props) => {
  const { enabled = true } = props;

  const mouse = useMouseState();
  const keyboard = Keyboard.useKeyboardState();
  const isOver = mouse.isOver;
  const isMeta = keyboard.current.modifiers.meta;
  const isClear = Wrangle.isClear(props, isMeta, isOver);
  const label = isClear ? '(none)' : '(all)';

  /**
   * Handlers
   */
  const handleResetClick = (e: React.MouseEvent) => {
    if (!enabled) return;
    const specs = props.data?.specs ?? {};
    const modifiers = Util.modifiers(e);
    const select = isClear ? 'none' : 'all';
    specs.onReset?.({ modifiers, select });
  };

  /**
   * [Render]
   */
  const styles = {
    base: css({
      flex: 1,
      opacity: isOver ? 1 : 0.5,
      transition: 'opacity 0.15s ease-in-out',
      Flex: 'horizontal-center-end',
    }),
    button: css({}),
  };

  return (
    <div {...css(styles.base, props.style)} {...mouse.handlers}>
      <Button onClick={handleResetClick} style={styles.button} isEnabled={enabled}>
        {label}
      </Button>
    </div>
  );
};

/**
 * Helpers
 */
const Wrangle = {
  isClear(props: SpecsResetProps, isMeta: boolean, isOver: boolean) {
    const isInvert = isMeta && isOver;
    const isAllSelected = Wrangle.isAllSelected(props.data, props.groups);
    const isNoneSelected = Wrangle.isNoneSelected(props.data);
    if (isAllSelected) return true;
    if (isNoneSelected) return false;
    return isInvert;
  },

  isAllSelected(data: t.TestPropListData, groups: t.TestSuiteGroup[]) {
    const total = Util.groupsToSuites(groups).length;
    const selected = data.specs?.selected ?? [];
    return selected.length > 0 && selected.length === total;
  },

  isNoneSelected(data: t.TestPropListData) {
    const selected = data.specs?.selected ?? [];
    return selected.length === 0;
  },
};
