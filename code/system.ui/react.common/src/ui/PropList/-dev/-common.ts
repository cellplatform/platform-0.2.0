export * from '../common';
export { Icons } from '../../Icons.mjs';
export { PropList } from '..';

export type MyField =
  | 'Module'
  | 'Module.Name'
  | 'Module.Version'
  | 'Module.Version.Diff'
  | 'Factory'
  | 'Factory.None'
  | 'Factory.Many'
  | 'Factory.EmptyArray'
  | 'Factory.Mixed';

export const SampleFields = {
  all: <MyField[]>[
    'Module',
    'Module.Name',
    'Module.Version',
    'Module.Version.Diff',
    'Factory',
    'Factory.None',
    'Factory.Many',
    'Factory.Mixed',
    'Factory.EmptyArray',
  ],
  defaults: <MyField[]>['Module.Name', 'Module.Version'],
};
