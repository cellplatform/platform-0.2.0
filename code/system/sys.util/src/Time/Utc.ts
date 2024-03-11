import day from 'dayjs';
import { type t } from '../common';

/**
 * Helpers for working with
 */
export function utc(input?: t.DateInput) {
  const date = day(input);
  const res: t.DateTime = {
    get date() {
      return date.toDate();
    },
    get timestamp() {
      return date.toDate().getTime();
    },
    get unix() {
      return date.unix();
    },
    format(template?: string) {
      return date.format(template);
    },
  };
  return res;
}
