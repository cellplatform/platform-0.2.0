import { t, Id } from './common';

import type { PropArgs } from './common';

export function CtxPropsDebug(props: PropArgs) {
  const api: t.DevCtxDebug = {
    render(fn) {
      const id = Id.renderer.create();
      props.current().debug.main.renderers.push({ id, fn });
      props.changed();
      return { id };
    },
  };
  return api;
}
