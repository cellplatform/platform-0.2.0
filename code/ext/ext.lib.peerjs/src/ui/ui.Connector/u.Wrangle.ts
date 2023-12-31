import { DEFAULTS, type t } from './common';

export const Wrangle = {
  listBehaviors(props: t.ConnectorProps): t.LabelItemBehaviorKind[] {
    const { behaviors = DEFAULTS.behaviors.default } = props;
    return ['Item', 'List', ...behaviors];
  },
} as const;
