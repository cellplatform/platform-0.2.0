import { R, t } from '../common';
import { Wrangle } from './Wrangle.mjs';

type Seconds = number;
type SecondsValue = number | null;

/**
 * Helpers for interpreting the play sequence of a time-map expressed
 * on a diagram.
 */
export const TimeMap = {
  /**
   * Time events sorted by `start` second (ascending).
   */
  sorted(input?: t.DocDiagramMedia[]): t.DocDiagramMediaType[] {
    const res = (input || [])
      .map((media, indexRef) => {
        const { start, end } = media;
        const kind = Wrangle.toKind(media);
        const res = kind ? { kind, start, end, indexRef } : undefined;
        return res;
      })
      .filter(Boolean)
      .map((e) => e as t.DocDiagramMediaType);

    return R.sortBy(R.prop('start'), res);
  },

  /**
   * Look at the list of items, and determine if the current item to display.
   */
  current(input: t.DocDiagramMedia[] | undefined, seconds: number) {
    const isBefore = (start?: SecondsValue) => typeof start === 'number' && start <= seconds;
    const isEnded = (end?: SecondsValue) => typeof end === 'number' && end <= seconds;

    const sorted = TimeMap.sorted(input).filter((item) => typeof item.start === 'number');
    const before = sorted.filter(({ start }) => isBefore(start));
    const last = before[before.length - 1];

    return isEnded(last?.end) ? undefined : last;
  },
};
