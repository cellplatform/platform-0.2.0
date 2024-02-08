import { ModuleList } from '../List.Module';
import { DEFAULTS, FC, type t } from './common';

/**
 * A <ModuleList> typed to load [SpecModule]'s.
 */
const View: React.FC<t.SpecListProps> = (props) => <ModuleList {...props} />;

/**
 * Export
 */
type Fields = {
  DEFAULTS: typeof DEFAULTS;
};
export const SpecList = FC.decorate<t.SpecListProps, Fields>(
  View,
  { DEFAULTS },
  { displayName: 'SpecList' },
);
