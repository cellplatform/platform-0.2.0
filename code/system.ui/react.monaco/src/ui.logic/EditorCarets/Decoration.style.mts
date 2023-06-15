import { DEFAULTS, t, Wrangle } from '../common';

export function DecorationStyle(editor: t.MonacoCodeEditor, id: string) {
  const editorSelector = Wrangle.editorClassName(editor).split(' ').join('.');
  const style = document.createElement('style');
  style.setAttribute('type', 'text/css');
  style.setAttribute('data-meta', DEFAULTS.className);
  document.head.appendChild(style);

  const api = {
    className: {
      caret: `caret-${id.replace(/\./g, '-')}`,
      selection: `selection-${id.replace(/\./g, '-')}`,
    },

    update(caret: t.EditorCaret) {
      style.innerHTML = `
      ${`.${editorSelector} .${api.className.caret}`} {
        opacity: ${caret.opacity};
        border-right: 2px solid ${caret.color};
      }
      ${`.${editorSelector} .${api.className.selection}`} {
        opacity: ${0.05};
        background-color: ${caret.color};
      }
    `;
    },

    dispose() {
      document.head.removeChild(style);
    },
  };

  return api;
}
