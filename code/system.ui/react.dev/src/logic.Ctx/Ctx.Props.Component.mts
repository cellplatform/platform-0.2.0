import { Margin, t } from './common';

import type { PropArgs } from './common';

export function CtxPropsComponent(props: PropArgs) {
  const api: t.SpecCtxComponent = {
    render(fn) {
      props.current().component.renderer = fn;
      props.changed();
      return api;
    },

    size(...args) {
      const current = props.current().component;
      current.size = undefined;

      if (args.length === 2 && (typeof args[0] === 'number' || typeof args[1] === 'number')) {
        current.size = {
          mode: 'center',
          width: typeof args[0] === 'number' ? args[0] : undefined,
          height: typeof args[1] === 'number' ? args[1] : undefined,
        };
        props.changed();
      }

      if (args[0] === 'fill' || args[0] === 'fill-x' || args[0] === 'fill-y') {
        const margin = Margin.wrangle(args[1] ?? 50);
        current.size = { mode: 'fill', margin, x: true, y: true };
        if (args[0] === 'fill-x') current.size.y = false;
        if (args[0] === 'fill-y') current.size.x = false;
        props.changed();
      }

      return api;
    },

    display(value) {
      props.current().component.display = value;
      props.changed();
      return api;
    },

    backgroundColor(value) {
      props.current().component.backgroundColor = value;
      props.changed();
      return api;
    },
  };

  return api;
}
