import { DEFAULTS, FC, type t } from './common';
import { View } from './ui';
import { Split } from './ui.Props.Split';
import { ImageScale } from './ui.Props.ImageScale';

/**
 * Export
 */
type Fields = {
  DEFAULTS: typeof DEFAULTS;
  Props: {
    Split: typeof Split;
    ImageScale: typeof ImageScale;
  };
};
export const VideoDiagram = FC.decorate<t.VideoDiagramProps, Fields>(
  View,
  { DEFAULTS, Props: { Split, ImageScale } },
  { displayName: 'Concept.VideoDiagram' },
);
