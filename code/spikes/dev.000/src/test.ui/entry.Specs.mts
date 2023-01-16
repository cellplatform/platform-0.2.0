import { ModuleSpecs as DevSpecs } from 'sys.ui.react.dev';
import {
  Specs as CommonSpecs,
  DevSpecs as ComonDevSpecs,
  ExternalSpecs as CommonExternalSpecs,
} from 'sys.ui.react.common';
import { Specs as MonacoSpecs } from 'sys.ui.react.monaco';
import { Specs as VideoSpecs } from 'sys.ui.react.video';

export const Specs = {
  Root: () => import('../ui/Root/Root.SPEC'),
  ...CommonSpecs,
  ...CommonExternalSpecs,
  ...ComonDevSpecs,
  ...DevSpecs,
  ...MonacoSpecs,
  ...VideoSpecs,
};
