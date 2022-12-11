import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { rx, slug, t, Margin } from '../common';

/**
 * Information object passed as the {ctx} to tests.
 */
export const SpecContext = {
  args(options: { dispose$?: t.Observable<any> } = {}) {
    const { dispose$, dispose } = rx.disposable(options.dispose$);
    const rerun$ = new Subject<void>();

    const _args: t.SpecRenderArgs = {
      instance: { id: slug() },
      rerun$: rerun$.pipe(takeUntil(dispose$)),
      component: {},
      host: {},
    };

    const ctx: t.SpecCtx = {
      render(el) {
        _args.component.element = el;
        return ctx;
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

        return ctx;
      },
      display(value) {
        _args.component.display = value;
        return ctx;
      },
      backgroundColor(value) {
        _args.component.backgroundColor = value;
        return ctx;
      },
      backdropColor(color) {
        _args.host.backgroundColor = color;
        return ctx;
      },

      rerun() {
        rerun$.next();
      },
    };

    return {
      dispose,
      ctx,
      get args() {
        return {
          ..._args,
          component: { ..._args.component },
          host: { ..._args.host },
        };
      },
    };
  },
};
