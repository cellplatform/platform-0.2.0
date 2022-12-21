import { t } from './common';

import type { PropArgs } from './common';

export function CtxPropsDebug(props: PropArgs) {
  const api: t.SpecCtxDebug = {
    body(renderer) {
      props.current().debug.main.renderers.push(renderer);
      props.changed();
      return api;
    },
  };
  return api;
}
