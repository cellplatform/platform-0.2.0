import { LabelItem, Pkg } from './common';

export * from '../common';
export const Model = LabelItem.Stateful.Model;

/**
 * Constants
 */
export const DEFAULTS = {
  typename: {
    list: `${Pkg.name}.Connector.List`,
    self: `${Pkg.name}.Connector.Self`,
    remote: `${Pkg.name}.Connector.Remote`,
  },
  timeout: {
    error: 3500,
    closePending: 2500,
    copiedPending: 1200,
  },
} as const;
