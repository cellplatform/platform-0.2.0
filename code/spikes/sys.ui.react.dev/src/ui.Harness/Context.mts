import { t } from '../common';

/**
 * Information object passed as the {ctx} to tests.
 */
export const Context = {
  args() {
    const props: t.SpecRenderProps = {};

    const ctx: t.SpecCtx = {
      render(el) {
        props.element = el;
        return ctx;
      },
      width(value) {
        props.width = value;
        return ctx;
      },
      height(value) {
        props.height = value;
        return ctx;
      },
      size(width, height) {
        return ctx.width(width).height(height);
      },
      display(value) {
        props.display = value;
        return ctx;
      },
      backgroundColor(value) {
        props.backgroundColor = value;
        return ctx;
      },
    };

    return { ctx, mutable: { props } };
  },
};
