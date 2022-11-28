import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { rx, slug, t, Margin } from '../common';

/**
 * Information object passed as the {ctx} to tests.
 */
export const Context = {
  args(options: { dispose$?: t.Observable<any> } = {}) {
    const { dispose$, dispose } = rx.disposable(options.dispose$);
    const rerun$ = new Subject<void>();
    const _props: t.SpecRenderProps = {
      instance: { id: slug() },
      rerun$: rerun$.pipe(takeUntil(dispose$)),
    };

    const ctx: t.SpecCtx = {
      render(el) {
        _props.element = el;
        return ctx;
      },
      size(...args) {
        _props.size = undefined;

        if (args.length === 2 && typeof args[0] === 'number' && typeof args[1] === 'number') {
          _props.size = { mode: 'center', width: args[0], height: args[1] };
        }

        if (args[0] === 'fill' || args[0] === 'fill-x' || args[0] === 'fill-y') {
          const margin = Margin.wrangle(args[1] ?? 50);
          _props.size = { mode: 'fill', margin, x: true, y: true };
          if (args[0] === 'fill-x') _props.size.y = false;
          if (args[0] === 'fill-y') _props.size.x = false;
        }

        return ctx;
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

      rerun() {
        rerun$.next();
      },
    };

    return {
      dispose,
      ctx,
      get props() {
        return { ..._props };
      },
    };
  },
};

/**
 * Helpers
 */
