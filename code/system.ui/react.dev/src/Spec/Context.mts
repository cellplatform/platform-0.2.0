import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { rx, slug, t } from '../common';

type Id = string;
type Margin = number | [number, number] | [number, number, number, number];

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
        if (args[0] === 'fill') {
          const margin = Wrangle.margin(args[1] ?? 50);
          _props.size = { mode: 'fill', margin };
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

const Wrangle = {
  margin(input?: Margin, defaultMargin?: number): [number, number, number, number] {
    if (input === undefined) return Wrangle.asMargin(defaultMargin ?? 0);
    if (typeof input === 'number') return Wrangle.asMargin(input);
    if (input.length === 2) return [input[0], input[1], input[0], input[1]];
    return [input[0], input[1], input[2], input[3]];
  },

  asMargin(value: number): [number, number, number, number] {
    return [value, value, value, value];
  },
};
