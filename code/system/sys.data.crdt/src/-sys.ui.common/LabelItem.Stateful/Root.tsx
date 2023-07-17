import { LabelItem } from '../LabelItem/Root';
import { DEFAULTS, FC, type t } from './common';
import { useEditController } from './useEditController.mjs';
import { useSelectionController } from './useSelectionController.mjs';

/**
 * Sample of using the behavior controller hooks.
 */
const View: React.FC<t.LabelItemStatefulProps> = (input) => {
  const { onChange, item, useControllers = DEFAULTS.useControllers.default } = input;

  const editController = useEditController({
    enabled: useControllers.includes('Edit'),
    item,
    onChange,
  });

  const selectionController = useSelectionController({
    enabled: useControllers.includes('Selection'),
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
};
export const LabelItemStateful = FC.decorate<t.LabelItemStatefulProps, Fields>(
  View,
  { DEFAULTS, useEditController, useSelectionController },
  { displayName: 'LabelItem.Stateful' },
);
