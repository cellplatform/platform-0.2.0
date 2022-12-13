import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { Margin, rx, slug, t } from '../common';

/**
 * Information object passed as the {ctx} to tests.
 */
export const SpecContext = {
  /**
   * Generate a new set of arguments used to render a spec/component.
   */
  args(options: { dispose$?: t.Observable<any> } = {}) {
    const { dispose$, dispose } = rx.disposable(options.dispose$);
    const rerun$ = new Subject<void>();

    const _args: t.SpecRenderArgs = {
      instance: { id: `render.${slug()}` },
      rerun$: rerun$.pipe(takeUntil(dispose$)),
      host: {},
      component: {},
      debug: { main: { elements: [] } },
    };

    /**
     * The component subject (being controlled by the spec).
     */
    const component: t.SpecCtxComponent = {
      render(el) {
        _args.component.element = el;
        return component;
      },

      size(...args) {
        _args.component.size = undefined;

        if (args.length === 2 && typeof args[0] === 'number' && typeof args[1] === 'number') {
          _args.component.size = { mode: 'center', width: args[0], height: args[1] };
        }

        if (args[0] === 'fill' || args[0] === 'fill-x' || args[0] === 'fill-y') {
          const margin = Margin.wrangle(args[1] ?? 50);
          _args.component.size = { mode: 'fill', margin, x: true, y: true };
          if (args[0] === 'fill-x') _args.component.size.y = false;
          if (args[0] === 'fill-y') _args.component.size.x = false;
        }

        return component;
      },
      display(value) {
        _args.component.display = value;
        return component;
      },
      backgroundColor(value) {
        _args.component.backgroundColor = value;
        return component;
      },
    };

    /**
     * The host container of the subject component.
     */
    const host: t.SpecCtxHost = {
      backgroundColor(color) {
        _args.host.backgroundColor = color;
        return host;
      },
    };

    /**
     * The debug panel containing UI reporting the state of the
     * component and controls for live manipulation of the compoonent.
     */
    const debug: t.SpecCtxDebug = {
      TEMP(el) {
        _args.debug.main.elements.push(el);
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
      rerun() {
        rerun$.next();
      },
      toObject() {
        return {
          host: { ..._args.host },
          component: { ..._args.component },
          debug: { ..._args.debug },
        };
      },
    };

    /**
     * API.
     */
    return {
      dispose,
      ctx,
      get args() {
        return _args;
      },
    };
  },
};
