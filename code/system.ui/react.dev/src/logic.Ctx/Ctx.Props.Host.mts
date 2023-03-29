import { DEFAULTS, t, Margin } from './common';
import { CtxPanelEdge } from './Ctx.PanelEdge.mjs';

import type { PropArgs } from './common.types';

const HOST = DEFAULTS.props.host;

export function CtxPropsHost(props: PropArgs) {
  const api: t.DevCtxHost = {
    backgroundColor(value) {
      if (value === null) value = HOST.backgroundColor!;
      props.current().host.backgroundColor = value;
      props.changed();
      return api;
    },
    tracelineColor(value) {
      if (value === null) value = HOST.tracelineColor!;
      props.current().host.tracelineColor = value;
      props.changed();
      return api;
    },
    backgroundImage(value) {
      props.current().host.backgroundImage = Wrangle.backgroundImage(value);
      props.changed();
      return api;
    },

    header: CtxPanelEdge(HOST.header, (fn) => {
      fn(props.current().host.header);
      props.changed();
    }),
    footer: CtxPanelEdge(HOST.footer, (fn) => {
      fn(props.current().host.footer);
      props.changed();
    }),
  };
  return api;
}

/**
 * Helpers
 */

const Wrangle = {
  backgroundImage(
    input: string | t.DevBackgroundImageInput | null,
  ): t.DevBackgroundImage | undefined {
    if (input === null || input === undefined) return;

    if (typeof input === 'string') {
      const url = input.trim();
      if (!url) return;
      return {
        url,
        size: HOST.backgroundImage?.size,
        margin: HOST.backgroundImage?.margin,
      };
    }

    const url = (input.url || '').trim();
    const margin = Margin.wrangle(input.margin);
    const size = input.size ?? HOST.backgroundImage?.size;
    const opacity = input.opacity;

    return { url, margin, size, opacity };
  },
};
