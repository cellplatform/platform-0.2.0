import { LabelItem } from '../LabelItem/Root';
import { DEFAULTS, FC, type t } from './common';
import { useEditController } from './useEditController.mjs';

/**
 * Sample of using the behavior controller hooks.
 */
const View: React.FC<t.LabelItemStatefulProps> = (input) => {
  const { onChange, state } = input;

  const editController = useEditController({
    enabled: input.useEditController ?? DEFAULTS.useEditController,
    state,
    onChange,
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
};
export const LabelItemStateful = FC.decorate<t.LabelItemStatefulProps, Fields>(
  View,
  { DEFAULTS, useEditController },
  { displayName: 'LabelItem.Stateful' },
);
