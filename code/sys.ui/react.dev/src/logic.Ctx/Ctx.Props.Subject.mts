import { DEFAULTS, Id, Is, Margin, type t } from './common';
import type { PropArgs } from './common.types';

const SUBJECT = DEFAULTS.props.subject;

export function CtxPropsSubject(props: PropArgs) {
  const api: t.DevCtxSubject = {
    render(fn) {
      const id = Id.renderer.create();
      props.current().subject.renderer = { id, fn };
      props.changed();
      return api;
    },

    size(...args) {
      const current = props.current().subject;
      current.size = undefined;

      if (Array.isArray(args[0])) {
        const [width, height] = args[0];
        if (Is.nil(width) && Is.nil(height)) {
          current.size = undefined;
        } else {
          current.size = {
            mode: 'center',
            width: typeof width === 'number' ? width : undefined,
            height: typeof height === 'number' ? height : undefined,
          };
        }
        props.changed();
      }

      if (args[0] === 'fill' || args[0] === 'fill-x' || args[0] === 'fill-y') {
        const margin = Margin.wrangle((args[1] as t.DevMarginInput) ?? 50);
        current.size = { mode: 'fill', margin, x: true, y: true };
        if (args[0] === 'fill-x') current.size.y = false;
        if (args[0] === 'fill-y') current.size.x = false;
        props.changed();
      }

      if (args.every((v) => v === null)) {
        current.size = undefined;
        props.changed();
      }

      return api;
    },

    display(value) {
      props.current().subject.display = value;
      props.changed();
      return api;
    },

    backgroundColor(value) {
      if (value === null) value = SUBJECT.backgroundColor!;
      props.current().subject.backgroundColor = value;
      props.changed();
      return api;
    },

    color(value) {
      if (value === null) value = SUBJECT.color!;
      props.current().subject.color = value;
      props.changed();
      return api;
    },
  };

  return api;
}
