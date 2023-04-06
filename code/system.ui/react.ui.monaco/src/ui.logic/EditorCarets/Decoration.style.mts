import { DEFAULTS, t, Wrangle } from '../common';

export function DecorationStyle(editor: t.MonacoCodeEditor, id: string) {
  const editorSelector = Wrangle.editorClassName(editor).split(' ').join('.');
  const caretClass = `caret-${id.replace(/\./g, '-')}`;
  const selectionClass = `selection-${id.replace(/\./g, '-')}`;
  const style = document.createElement('style');
  style.setAttribute('type', 'text/css');
  style.setAttribute('data-meta', DEFAULTS.className);
  document.head.appendChild(style);

  return {
    caretClass,
    selectionClass,

    update(caret: t.EditorCaret) {
      style.innerHTML = `
      ${`.${editorSelector} .${caretClass}`} {
        opacity: ${caret.opacity};
        border-right: 2px solid ${caret.color};
      }
      ${`.${editorSelector} .${selectionClass}`} {
        opacity: ${0.05};
        background-color: ${caret.color};
      }
    `;
    },

    dispose() {
      document.head.removeChild(style);
    },
  };
}
