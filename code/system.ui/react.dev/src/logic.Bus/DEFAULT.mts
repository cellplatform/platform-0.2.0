import { t } from './common';
import { DEFAULT as SPEC_DEFAULT } from '../Spec.Context/DEFAULT.mjs';

export const DEFAULT = {
  info(): t.DevInfo {
    return {
      instance: { kind: 'dev:harness', context: '', bus: '' },
      render: {},
      run: { count: 0 },
    };
  },

  props(id?: string): t.SpecRenderProps {
    return SPEC_DEFAULT.props(id);
  },
};
