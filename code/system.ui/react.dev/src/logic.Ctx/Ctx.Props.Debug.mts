import { t, Id, Margin, DEFAULT } from './common';

import type { PropArgs } from './common.types';

export function CtxPropsDebug(props: PropArgs) {
  const { events } = props;
  const DEBUG = DEFAULT.props().debug;

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

    padding(input) {
      const value = Margin.wrangle(input ?? DEBUG.body.padding);
      props.current().debug.body.padding = value;
      props.changed();
      return api;
    },

    /**
     * Header
     */
    header: {
      render(input) {
        const id = Id.renderer.create();
        const fn = typeof input === 'function' ? input : () => input;
        props.current().debug.header.renderer = { id, fn };
        props.changed();
        return api.header;
      },
    },

    /**
     * Footer
     */
    footer: {
      render(input) {
        const id = Id.renderer.create();
        const fn = typeof input === 'function' ? input : () => input;
        props.current().debug.footer.renderer = { id, fn };
        props.changed();
        return api.footer;
      },
    },
  };

  return api;
}
