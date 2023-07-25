import { DEFAULTS, type t } from './common';

import { LabelItem } from '../Item.LabelItem/Root';
import { useItemController } from './use.mjs';

/**
 * Sample of using the behavior controller hooks.
 */
export const View: React.FC<t.LabelItemStatefulProps> = (props) => {
  const { ctx, item, onChange, useBehaviors = DEFAULTS.useBehaviors.defaults } = props;

  /**
   * Roll-up controller.
   */
  const controller = useItemController({
    ctx,
    item,
    onChange,
    useBehaviors,
  });

  const { data, handlers } = controller;

  /**
   * Render
   */
  return (
    <LabelItem
      {...handlers}
      style={props.style}
      label={data.label}
      left={data.left}
      right={data.right}
      enabled={data.enabled}
      editing={data.editing}
      focused={data.focused}
      focusOnEdit={true}
    />
  );
};
