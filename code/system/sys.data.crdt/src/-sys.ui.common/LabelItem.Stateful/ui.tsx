import { DEFAULTS, type t } from './common';

import { LabelItem } from '../LabelItem/Root';
import { useController } from './useController.mjs';

/**
 * Sample of using the behavior controller hooks.
 */
export const View: React.FC<t.LabelItemStatefulProps> = (props) => {
  const { ctx, item, onChange, useBehaviors = DEFAULTS.useBehaviors.defaults } = props;

  /**
   * Roll-up controller.
   */
  const controller = useController({
    useBehaviors,
    ctx,
    item,
    onChange,
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
