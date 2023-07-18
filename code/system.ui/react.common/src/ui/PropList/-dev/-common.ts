export * from '../common';
export { Icons } from '../../Icons.mjs';
export { PropList } from '..';

export type MyFields =
  | 'Module'
  | 'Module.Name'
  | 'Module.Version'
  | 'Module.Version.Diff'
  | 'Factory'
  | 'Factory.None'
  | 'Factory.Many'
  | 'Factory.EmptyArray';

export const SampleFields = {
  all: <MyFields[]>[
    'Module',
    'Module.Name',
    'Module.Version',
    'Module.Version.Diff',
    'Factory',
    'Factory.None',
    'Factory.Many',
    'Factory.EmptyArray',
  ],
  default: <MyFields[]>['Module.Name', 'Module.Version'],
};
