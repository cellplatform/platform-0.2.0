import { Position, Range } from 'monaco-editor';

import type { t } from './common';
import type { ISelection } from 'monaco-editor';

export type SelectionOffset = { start: number; end: number };

export const Wrangle = {
  offsets(editor: t.MonacoCodeEditor, selection: ISelection): SelectionOffset {
    const model = editor.getModel();
    if (!model) throw new Error(`Editor did not return a text model.`);

    const position = Wrangle.position(selection);
    const range = Range.fromPositions(position.start, position.end);
    return {
      start: model.getOffsetAt(range.getStartPosition()),
      end: model.getOffsetAt(range.getEndPosition()),
    };
  },

  position(selection: ISelection) {
    const { selectionStartLineNumber, selectionStartColumn } = selection;
    const { positionLineNumber, positionColumn } = selection;
    return {
      start: new Position(selectionStartLineNumber, selectionStartColumn),
      end: new Position(positionLineNumber, positionColumn),
    };
  },
};
