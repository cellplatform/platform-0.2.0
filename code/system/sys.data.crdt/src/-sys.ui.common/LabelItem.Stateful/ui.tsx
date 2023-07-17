import { DEFAULTS, type t } from './common';

import { LabelItem } from '../LabelItem/Root';
import { useEditController } from './useEditController.mjs';
import { useSelectionController } from './useSelectionController.mjs';

export type ViewProps = {
  style?: t.CssValue;
};

/**
 * Sample of using the behavior controller hooks.
 */
export const View: React.FC<t.LabelItemStatefulProps> = (props) => {
  const { onChange, item, useBehaviors = DEFAULTS.useBehaviors.default } = props;

  const editController = useEditController({
    enabled: useBehaviors.includes('Edit'),
    item,
    onChange,
  });

  const selectionController = useSelectionController({
    enabled: useBehaviors.includes('Selection'),
    item,
  });

  /**
   * Render
   */
  return (
    <LabelItem
      {...editController.props}
      {...editController.handlers}
      style={props.style}
      label={editController.data.label}
      focusOnEdit={true}
      rightActions={props.rightActions ?? editController.props.rightActions}
    />
  );
};
