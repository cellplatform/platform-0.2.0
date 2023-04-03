import type { t } from '../../common.t';

export type MonacoEditorCaret = {
  id: string;
  color: string;
  selection: t.IRange;
};
