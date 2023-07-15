import { RefObject } from 'react';
import { css, DEFAULTS, Style, type t } from './common';

import { Label } from './ui.Label';
import { LeftAction } from './ui.Root.Left.Action';
import { RightActions } from './ui.Root.Right.Actions';
import { Wrangle } from './Wrangle';

type Props = t.LabelItemProps & { inputRef: RefObject<t.TextInputRef> };

export const View: React.FC<Props> = (props) => {
  const {
    inputRef,
    enabled = DEFAULTS.enabled,
    indent = DEFAULTS.indent,
    padding = DEFAULTS.padding,
    focused = DEFAULTS.focused,
    tabIndex = DEFAULTS.tabIndex,
  } = props;

  /**
   * [Render]
   */
  const styles = {
    base: css({
      position: 'relative',
      pointerEvents: enabled ? 'auto' : 'none',
      backgroundColor: Wrangle.backgroundColor(props),
      boxSizing: 'border-box',
      outline: 'none',
      ...Style.toPadding(props.padding ?? padding),
    }),
    body: css({
      boxSizing: 'border-box',
      marginLeft: indent,
      display: 'grid',
      gridTemplateColumns: 'auto 1fr auto',
      columnGap: 3,
    }),
    right: css({ marginLeft: 5 }),
    focusBorder: css({
      pointerEvents: 'none',
      Absolute: 0,
      border: `solid 1px ${Wrangle.borderColor(props)}`,
    }),
  };

  const elFocusBorder = focused && <div {...styles.focusBorder} />;

  return (
    <div {...css(styles.base, props.style)} tabIndex={tabIndex}>
      <div {...styles.body}>
        <LeftAction {...props} />
        <Label {...props} inputRef={inputRef} />
        <RightActions {...props} style={styles.right} />
      </div>
      {elFocusBorder}
    </div>
  );
};
