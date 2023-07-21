import { DEFAULTS, type t } from './common';

type SizeValue = number | string;

export const Wrangle = {
  total(props: t.GridProps) {
    const value = props.total ?? DEFAULTS.total;
    return typeof value === 'object' ? value : positiveXY(value);
  },

  gap(props: t.GridProps): t.GridXY {
    const value = props.gap ?? DEFAULTS.gap;
    if (typeof value === 'number') return positiveXY(value);

    const x = positive(value.x ?? DEFAULTS.gap);
    const y = positive(value.y ?? DEFAULTS.gap);
    return { x, y } as const;
  },

  forEach(total: t.GridXY, fn: (x: number, y: number) => void) {
    Array.from({ length: total.y }).forEach((_, y) => {
      Array.from({ length: total.x }).forEach((_, x) => fn(x, y));
    });
  },

  config(props: t.GridProps) {
    const total = Wrangle.total(props);
    const cells: t.GridCell[] = [];
    const columns: SizeValue[] = [];
    const rows: SizeValue[] = [];

    const cell = (x: number, y: number) => {
      let body: JSX.Element | undefined;
      const args: t.GridCellConfigureArgs = {
        total,
        x,
        y,
        body(element) {
          body = element ?? undefined;
          return args;
        },
      };
      props.cell?.(args);
      cells.push({ x, y, body });
    };

    const size = (total: number, index: number, fn?: t.GridSizeConfigure) => {
      return fn ? fn({ total, index }) : 1;
    };

    const put = (length: number, into: SizeValue[], fn: (value: number) => SizeValue) => {
      Array.from({ length }).forEach((_, v) => into.push(fn(v)));
    };
    put(total.x, columns, (value) => size(total.x, value, props.row));
    put(total.y, rows, (value) => size(total.y, value, props.row));
    Wrangle.forEach(total, (x, y) => cell(x, y));

    const findItem = (x: number, y: number) => {
      return cells.find((item) => item.x === x && item.y === y);
    };

    return {
      cells,
      columns,
      rows,
      forEach(fn: t.GridCellHandler) {
        Wrangle.forEach(total, (x, y) => {
          const item = findItem(x, y);
          fn({ x, y, body: item?.body });
        });
      },
    } as const;
  },

  toGridTemplate(values: SizeValue[]) {
    return values
      .map((value) => (typeof value === 'number' ? `${positive(value)}fr` : value))
      .join(' ');
  },
};

/**
 * Helpers
 */
const positive = (value: number) => Math.max(0, value);
const positiveXY = (x: number, y: number = x): t.GridXY => ({ x: positive(x), y: positive(y) });
