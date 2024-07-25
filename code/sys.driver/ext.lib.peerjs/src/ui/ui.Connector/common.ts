import { Pkg, type t } from './common';

export * from '../common';
export { Data, Model } from '../ui.Connector.Model';

/**
 * Constants
 */

const name = 'Connector';
const props: t.PickRequired<t.ConnectorProps, 'theme' | 'tabIndex'> = {
  theme: 'Dark',
  tabIndex: 0,
};

const behaviors = {
  get all(): t.ConnectorBehavior[] {
    return ['Focus.OnLoad', 'Focus.OnArrowKey'];
  },
  get default(): t.ConnectorBehavior[] {
    return [];
  },
};

export const DEFAULTS = {
  name,
  displayName: `${Pkg.name}:${name}`,
  props,
  behaviors,
} as const;
