import type * as t from './t';

import { Monaco } from './Wrangle.Monaco';
import { Range } from './Wrangle.Range';
import { DEFAULTS } from './constants';

export const Wrangle = {
  Monaco,
  Range,

  editorClassName(editor?: t.MonacoCodeEditor) {
    let id = editor?.getId() ?? '';
    if (id.includes(':')) id = `instance-${id.split(':')[1]}`;
    return `${DEFAULTS.className} ${id}`.trim();
  },
};
