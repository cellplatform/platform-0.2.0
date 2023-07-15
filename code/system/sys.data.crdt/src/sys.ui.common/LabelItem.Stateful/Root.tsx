import { LabelItem } from '../LabelItem/Root';
import { DEFAULTS, FC, type t } from './common';
import { useController } from './useController.mjs';

const View: React.FC<t.LabelItemStatefulProps> = (input) => {
  const { onChange, state } = input;

  const enabled = input.useController;
  const controller = useController({ enabled, state, onChange });

  /**
   * Render
   */
  return (
    <LabelItem
      style={input.style}
      {...controller.props}
      {...controller.handlers}
      focusOnEdit={true}
      label={controller.data.label}
    />
  );
};

/**
 * Export
 */
type Fields = {
  DEFAULTS: typeof DEFAULTS;
  useController: typeof useController;
};
export const LabelItemStateful = FC.decorate<t.LabelItemStatefulProps, Fields>(
  View,
  { DEFAULTS, useController },
  { displayName: 'LabelItem.Stateful' },
);
