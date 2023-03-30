import { t, Dev, CSS } from '../../../test.ui';
import { MonacoEditor, MonacoEditorProps } from '..';

const DEFAULTS = MonacoEditor.DEFAULTS;

type T = { props: MonacoEditorProps };
const initial: T = {
  props: {
    text: '',
    language: DEFAULTS.language,
    tabSize: DEFAULTS.tabSize,
    focusOnLoad: true,
  },
};

export default Dev.describe('MonacoEditor', (e) => {
  type LocalStore = { text: string; language: t.EditorLanguage };
  const localstore = Dev.LocalStorage<LocalStore>('dev:sys.monaco.crdt');
  const local = localstore.object({
    text: initial.props.text!,
    language: initial.props.language!,
  });

  let editor: t.MonacoCodeEditor;
  let monaco: t.Monaco;

  e.it('init', async (e) => {
    const ctx = Dev.ctx(e);
    const state = await ctx.state<T>(initial);
    state.change((d) => {
      d.props.text = local.text;
      d.props.language = local.language;
    });

    ctx.subject
      .size('fill')
      .display('grid')
      .render<T>((e) => {
        return (
          <MonacoEditor
            {...e.state.props}
            onReady={(e) => {
              console.info(`⚡️ onReady:`, e);
              editor = e.editor;
              monaco = e.monaco;
            }}
            onChange={(e) => {
              local.text = e.text;
            }}
          />
        );
      });
  });

  e.it('ui:debug', async (e) => {
    const dev = Dev.tools<T>(e, initial);

    dev.section('Language', (dev) => {
      const hr = () => dev.hr(-1, 5);

      const language = (input: t.EditorLanguage) => {
        const language = input as t.EditorLanguage;
        return dev.button((btn) =>
          btn
            .label(language)
            .right((e) => (e.state.props.language === language ? '← current' : ''))
            .onClick((e) => {
              e.change((d) => (d.props.language = language));
              local.language = language;
            }),
        );
      };
      language('typescript');
      language('javascript');
      hr();
      language('json');
      language('yaml');
      hr();
      language('markdown');
    });

    dev.hr(5, 20);

    dev.section('Options', (dev) => {
      const tabSize = (size: number) => {
        const label = `tabSize: ${size}`;
        dev.button(label, (e) => e.change((d) => (d.props.tabSize = size)));
      };
      tabSize(2);
      tabSize(4);
    });

    dev.hr(5, 20);

    dev.section('Caret', (dev) => {
      dev.button('tmp', (e) => {
        //
        console.log('editor', editor);
        console.log('monaco', monaco);

        // Create a cursor decoration for another user
        const cursorDecoration = {
          range: new monaco.Range(1, 1, 1, 1),
          options: {
            className: CSS.CLASS.CARET,
            isWholeLine: true,
          },
        };

        // Add the cursor decoration to the editor
        const cursor = editor.getModel()?.deltaDecorations([], [cursorDecoration]);
        console.log('cursor', cursor);

        // Update the cursor position for another user
        function updateCursor(lineNumber: number, column: number) {
          const newRange = new monaco.Range(lineNumber, column, lineNumber, column);
          editor.getModel()?.deltaDecorations(cursor!, [
            {
              range: newRange,
              options: {
                className: CSS.CLASS.CARET,
                // isWholeLine: true,
              },
            },
          ]);
        }
        // Example usage
        updateCursor(1, 5); // Move the cursor to line 1, column 5
      });
    });
  });

  e.it('ui:footer', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    dev.footer
      .border(-0.1)
      .render<T>((e) => <Dev.Object name={'Dev.MonacoEditor'} data={e.state} expand={1} />);
  });
});
