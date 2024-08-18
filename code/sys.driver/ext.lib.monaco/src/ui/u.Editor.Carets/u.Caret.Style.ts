import { DEFAULTS, Wrangle, type t } from '../common';

export function caretStyleFactory(editor: t.MonacoCodeEditor, id: string) {
  const editorSelector = Wrangle.Editor.className(editor).split(' ').join('.');

  const style = document.createElement('style');
  style.setAttribute('type', 'text/css');
  style.setAttribute('data-meta', DEFAULTS.className);
  document.head.appendChild(style);

  const api = {
    class: {
      caret: `caret-${safeClassname(id)}`,
      selection: `selection-${safeClassname(id)}`,
    },

    update(caret: t.EditorCaret) {
      style.innerHTML = `
      ${`.${editorSelector} .${api.class.caret}`} {
        opacity: ${caret.opacity};
        border-right: 2px solid ${caret.color};
      }
      ${`.${editorSelector} .${api.class.selection}`} {
        opacity: ${0.15};
        background-color: ${caret.color};
      }
    `;
    },

    dispose() {
      document.head.removeChild(style);
    },
  } as const;
  return api;
}

/**
 * Helpers
 */
function safeClassname(id: string) {
  return id.replace(/\./g, '-').replace(/\:/g, '-');
}
