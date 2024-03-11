import { DEFAULTS, DevBase, LocalStorage, Test, Value } from '../common';

import { PropList } from '../../ui/PropList';
import { Lorem } from '../../ui.tools';
import { ObjectView } from '../../ui/ObjectView';
import { DevSplash as Splash } from '../Dev.Splash';
import { DevIcons as Icons } from '../Dev.Icons';
import { DevTools, Helpers } from '../DevTools';
import { TestRunner } from '../TestRunner';
import { Spinner } from '../../ui/Spinner';
import { RowSpinner } from '../Dev.RowSpinner';

import { render } from './Dev.render';

const { describe, ctx } = DevBase.Spec;
const { trimStringsDeep } = Value.object;
const qs = DEFAULTS.qs;

export const Dev = {
  ...DevBase,
  ...Helpers,
  render,

  bundle: Test.bundle,
  FieldSelector: PropList.FieldSelector,
  Tools: DevTools,
  tools: DevTools.init,

  Icons,
  Spinner,
  RowSpinner,
  Splash,
  TestRunner,
  LocalStorage,
  Object: ObjectView,
  Lorem,
  Url: { qs },

  ctx,
  describe,
  trimStringsDeep,
};
