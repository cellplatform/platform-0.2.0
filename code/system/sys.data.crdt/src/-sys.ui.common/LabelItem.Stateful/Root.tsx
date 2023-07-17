import { DEFAULTS, FC, type t } from './common';

import { LabelItem } from '../LabelItem/Root';
import { BehaviorSelector } from './ui.BehaviorSelector';
import { useEditController } from './useEditController.mjs';
import { useSelectionController } from './useSelectionController.mjs';

/**
 * Sample of using the behavior controller hooks.
 */
const View: React.FC<t.LabelItemStatefulProps> = (input) => {
  const { onChange, item, useBehaviors = DEFAULTS.useBehaviors.default } = input;

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
      style={input.style}
      label={editController.data.label}
      focusOnEdit={true}
      rightActions={input.rightActions ?? editController.props.rightActions}
    />
  );
};

/**
 * Export
 */
type Fields = {
  DEFAULTS: typeof DEFAULTS;
  useEditController: typeof useEditController;
  useSelectionController: typeof useSelectionController;
  BehaviorSelector: typeof BehaviorSelector;
};
export const LabelItemStateful = FC.decorate<t.LabelItemStatefulProps, Fields>(
  View,
  {
    DEFAULTS,
    useEditController,
    useSelectionController,
    BehaviorSelector,
  },
  { displayName: 'LabelItem.Stateful' },
);
