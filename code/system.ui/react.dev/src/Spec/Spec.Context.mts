import { Margin, slug, t } from '../common';
import { BusEvents } from '../ui.Bus/Bus.Events.mjs';

/**
 * Information object passed as the {ctx} to tests.
 */
export const SpecContext = {
  /**
   * Generate a new set of arguments used to render a spec/component.
   */
  create(instance: t.DevInstance, options: { dispose$?: t.Observable<any> } = {}): t.SpecContext {
    const events = BusEvents({ instance, dispose$: options.dispose$ });
    const { dispose, dispose$ } = events;

    const _props: t.SpecRenderProps = {
      id: `render.${slug()}`,
      host: {},
      component: {},
      debug: { main: { elements: [] } },
    };

    /**
     * The component subject (being controlled by the spec).
     */
    const component: t.SpecCtxComponent = {
      render(el) {
        _props.component.element = el;
        return component;
      },

      size(...args) {
        _props.component.size = undefined;

        if (args.length === 2 && typeof args[0] === 'number' && typeof args[1] === 'number') {
          _props.component.size = { mode: 'center', width: args[0], height: args[1] };
        }

        if (args[0] === 'fill' || args[0] === 'fill-x' || args[0] === 'fill-y') {
          const margin = Margin.wrangle(args[1] ?? 50);
          _props.component.size = { mode: 'fill', margin, x: true, y: true };
          if (args[0] === 'fill-x') _props.component.size.y = false;
          if (args[0] === 'fill-y') _props.component.size.x = false;
        }

        return component;
      },

      display(value) {
        _props.component.display = value;
        return component;
      },

      backgroundColor(value) {
        _props.component.backgroundColor = value;
        return component;
      },
    };

    /**
     * The host container of the subject component.
     */
    const host: t.SpecCtxHost = {
      backgroundColor(color) {
        _props.host.backgroundColor = color;
        return host;
      },
    };

    /**
     * The debug panel containing UI reporting the state of the
     * component and controls for live manipulation of the compoonent.
     */
    const debug: t.SpecCtxDebug = {
      TEMP(el) {
        _props.debug.main.elements.push(el);
        return debug;
      },
    };

    /**
     * The context object passed into the spec.
     */
    const ctx: t.SpecCtx = {
      component,
      host,
      debug,
      toObject() {
        return { instance, props: { ..._props } };
      },
      async run(target) {
        const res = await events.run.fire({ target });
        const info = res.info ?? (await events.info.get());
        return info;
      },
    };

    /**
     * API.
     */
    return {
      dispose,
      dispose$,
      ctx,
      get props() {
        return _props;
      },
    };
  },
};
