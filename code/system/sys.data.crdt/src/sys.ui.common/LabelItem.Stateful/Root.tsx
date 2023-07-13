import { useEffect, useRef, useState } from 'react';
import { Color, COLORS, css, DEFAULTS, FC, rx, type t } from '../common';
import { useController } from './useController.mjs';

import { LabelItem } from '../LabelItem/Root';

const View: React.FC<t.LabelItemStatefulProps> = (props) => {
  /**
   * [Render]
   */
  const controller = useController({});

  console.log('controller', controller);

  return <LabelItem style={props.style} />;
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
