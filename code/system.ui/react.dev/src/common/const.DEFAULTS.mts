import type { t } from '../common.t';
import { Color } from './libs.mjs';
import { COLORS } from './const.COLORS.mjs';

export const DEFAULTS = {
  get props(): t.DevRenderProps {
    return {
      host: {
        backgroundColor: Color.alpha(COLORS.DARK, 0.02),
        tracelineColor: Color.alpha(COLORS.DARK, 0.1),
        backgroundImage: { url: '', size: 'cover', margin: [0, 0, 0, 0] },
      },
      subject: {},
      debug: {
        width: 400,
        header: { border: {}, padding: [8, 8, 8, 8] },
        body: {
          renderers: [],
          scroll: true,
          padding: [15, 15, 15, 15],
        },
        footer: { border: {}, padding: [8, 8, 8, 8] },
      },
    };
  },

  get info(): t.DevInfo {
    return {
      instance: { kind: 'dev:harness', session: '', bus: '' },
      render: { revision: { props: 0, state: 0 } },
      run: { count: 0 },
    };
  },

  /**
   * URL query-string keys.
   */
  QS: {
    d: 'd', // NB: alias for "?dev"
    dev: 'dev',
  },
} as const;
