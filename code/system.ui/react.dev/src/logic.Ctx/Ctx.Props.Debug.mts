import { t, Id } from './common';

import type { PropArgs } from './common.types';

export function CtxPropsDebug(props: PropArgs) {
  const { events } = props;

  const api: t.DevCtxDebug = {
    row(input) {
      const id = Id.renderer.create();
      const fn = typeof input === 'function' ? input : () => input;
      const redraw = () => events.redraw.fire(id);
      props.current().debug.body.renderers.push({ id, fn });
      props.changed();
      return { id, redraw };
    },

    scroll(value) {
      props.current().debug.body.scroll = value;
      props.changed();
      return api;
    },
  };

  return api;
}
