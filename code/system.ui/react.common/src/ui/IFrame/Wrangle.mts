import { DEFAULTS, type t } from './common';

export const Wrangle = {
  sandbox(props: t.IFrameProps) {
    const { sandbox = DEFAULTS.sandbox } = props;
    return Array.isArray(sandbox) ? sandbox.join(' ') : undefined; // NB: <undefined> === all restrictions applied.
  },

  content(props: t.IFrameProps): { src?: string; html?: string } {
    if (!props.src) return { src: undefined, html: undefined };
    if (typeof props.src === 'string') return { src: props.src };
    return { src: props.src.url, html: props.src.html };
  },
};
