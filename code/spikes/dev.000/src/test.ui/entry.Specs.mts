import { Specs as MonacoSpecs } from 'sys.ui.react.monaco';
import { Specs as VideoSpecs } from 'sys.ui.react.video';
import { Specs as CommonSpecs } from 'sys.ui.react.common';

export const Specs = {
  ModuleRoot: () => import('../ui/Root/Root.SPEC'),
  ...CommonSpecs,
  ...MonacoSpecs,
  ...VideoSpecs,
};
