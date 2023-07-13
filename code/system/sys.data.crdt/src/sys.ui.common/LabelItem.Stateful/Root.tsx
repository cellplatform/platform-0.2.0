import { DEFAULTS, FC, type t } from './common';
import { useController } from './useController.mjs';

import { LabelItem } from '../LabelItem/Root';

const View: React.FC<t.LabelItemStatefulProps> = (props) => {
  const enabled = props.useController && !props.props;
  const controller = useController({ enabled });
  return <LabelItem {...(props.props ?? controller.props)} style={props.style} />;
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
