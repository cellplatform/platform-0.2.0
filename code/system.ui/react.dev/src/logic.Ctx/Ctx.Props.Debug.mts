import { t, Id, Margin, DEFAULT } from './common';

import type { PropArgs } from './common.types';

export function CtxPropsDebug(props: PropArgs) {
  const { events } = props;
  const DEBUG = DEFAULT.props.debug;

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

    width(input) {
      const value = Wrangle.width(input, DEFAULT.props.debug.width);
      props.current().debug.width = value;
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
      border(color) {
        if (color === null) color = DEBUG.header.border.color!;
        props.current().debug.header.border.color = color;
        props.changed();
        return api.header;
      },
      padding(input) {
        const value = Margin.wrangle(input ?? DEBUG.header.padding);
        props.current().debug.header.padding = value;
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
      border(color) {
        if (color === null) color = DEBUG.footer.border.color!;
        props.current().debug.footer.border.color = color;
        props.changed();
        return api.footer;
      },
      padding(input) {
        const value = Margin.wrangle(input ?? DEBUG.footer.padding);
        props.current().debug.footer.padding = value;
        props.changed();
        return api.footer;
      },
    },
  };

  return api;
}

/**
 * [Helpers]
 */

const Wrangle = {
  width(value: number | undefined, defaultValue?: number) {
    if (typeof value !== 'number') return defaultValue;
    return Math.max(0, value);
  },
};
