import { useRedrawOnChange as useRedraw } from '../use';
import { type t } from './common';

export function useRedrawOnChange(data: t.InfoData) {
  useRedraw(data.document?.doc);
  useRedraw(data.history?.doc);
}
