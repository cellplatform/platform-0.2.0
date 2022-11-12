import { t } from '../common';

/**
 * Information object passed as the {ctx} to tests.
 */
export const Context = {
  args() {
    const _props: t.SpecRenderProps = {};

    const ctx: t.SpecCtx = {
      render(el) {
        _props.element = el;
        return ctx;
      },
      width(value) {
        _props.width = value;
        return ctx;
      },
      height(value) {
        _props.height = value;
        return ctx;
      },
      size(width, height) {
        return ctx.width(width).height(height);
      },
      display(value) {
        _props.display = value;
        return ctx;
      },
      backgroundColor(value) {
        _props.backgroundColor = value;
        return ctx;
      },
      backdropColor(color) {
        _props.backdropColor = color;
        return ctx;
      },
    };

    return {
      ctx,
      get props() {
        return { ..._props };
      },
    };
  },
};
