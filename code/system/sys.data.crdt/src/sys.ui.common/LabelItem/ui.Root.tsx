import { RefObject } from 'react';
import { COLORS, DEFAULTS, Style, css, type t } from './common';

import { Label } from './ui.Label';
import { LeftAction } from './ui.Root.Left.Action';
import { RightActions } from './ui.Root.Right.Actions';

type Props = t.LabelItemProps & { inputRef: RefObject<t.TextInputRef> };

export const View: React.FC<Props> = (props) => {
  const {
    inputRef,
    enabled = DEFAULTS.enabled,
    selected = DEFAULTS.selected,
    indent = DEFAULTS.indent,
    padding = DEFAULTS.padding,
  } = props;

  /**
   * [Render]
   */
  const styles = {
    base: css({
      pointerEvents: enabled ? 'auto' : 'none',
      backgroundColor: selected ? COLORS.BLUE : undefined,
      boxSizing: 'border-box',
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
  };

  return (
    <div {...css(styles.base, props.style)}>
      <div {...styles.body}>
        <LeftAction {...props} />
        <Label {...props} inputRef={inputRef} />
        <RightActions {...props} style={styles.right} />
      </div>
    </div>
  );
};
