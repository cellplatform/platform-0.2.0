import { MonacoEditor } from '.';
import { Dev, EditorCarets, Wrangle, type t } from '../../test.ui';
import { CODE_SAMPLES } from './-Sample.code';

const DEFAULTS = MonacoEditor.DEFAULTS;

type T = { props: t.MonacoEditorProps };
const initial: T = {
  props: {
    text: '',
    theme: 'Light',
    language: DEFAULTS.language,
    tabSize: DEFAULTS.tabSize,
    focusOnLoad: true,
  },
};

export default Dev.describe('MonacoEditor', (e) => {
  type LocalStore = {
    text: string;
    language: t.EditorLanguage;
    selection: t.EditorRange | null;
  };
  const localstore = Dev.LocalStorage<LocalStore>('dev:sys.ui.monoaco.MonacoEditor');
  const local = localstore.object({
    text: initial.props.text!,
    language: initial.props.language!,
    selection: null,
  });

  let editor: t.MonacoCodeEditor;
  let monaco: t.Monaco;
  let carets: t.EditorCarets;

  e.it('ui:init', async (e) => {
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
              carets = EditorCarets(editor);
              // carets.$.subscribe((e) => ctx.redraw());

              const asRange = Wrangle.asRange;
              if (local.selection) editor.setSelection(local.selection);
              editor.onDidChangeCursorSelection((e) => (local.selection = asRange(e.selection)));

              ctx.redraw();
            }}
            onChange={(e) => {
              local.text = e.text;
              // ctx.redraw();
            }}
          />
        );
      });
  });

  e.it('ui:debug', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    const ctx = dev.ctx;

    dev.section('Debug', (dev) => {
      dev.button('redraw', (e) => ctx.redraw());
    });

    dev.hr(5, 20);

    dev.section('Language', (dev) => {
      const hr = () => dev.hr(-1, 5);

      const language = (input: t.EditorLanguage, codeSample?: string) => {
        const language = input as t.EditorLanguage;
        const format = (code: string) => {
          code = code.replace(/^\s*\n|\n\s*$/g, '');
          return `${code}\n`;
        };
        return dev.button((btn) =>
          btn
            .label(language)
            .right((e) => (e.state.props.language === language ? '← current' : ''))
            .onClick((e) => {
              e.change((d) => {
                local.language = d.props.language = language;
                if (codeSample) local.text = d.props.text = format(codeSample);
              });
            }),
        );
      };
      language('typescript', CODE_SAMPLES.typescript);
      language('javascript', CODE_SAMPLES.javascript);
      hr();
      language('rust', CODE_SAMPLES.rust);
      language('go', CODE_SAMPLES.go);
      language('python', CODE_SAMPLES.python);
      hr();
      language('json', CODE_SAMPLES.json);
      language('yaml', CODE_SAMPLES.yaml);
      hr();
      language('markdown', CODE_SAMPLES.markdown);
    });

    dev.hr(5, 20);

    dev.section('Options', (dev) => {
      dev.textbox((txt) =>
        txt
          .margin([0, 0, 10, 0])
          .label((e) => 'placeholder')
          .placeholder('enter placeholder text')
          .value((e) => e.state.props.placeholder)
          .onChange((e) => e.change((d) => (d.props.placeholder = e.to.value)))
          .onEnter((e) => {}),
      );

      const tabSize = (size: number) => {
        const label = `tabSize: ${size}`;
        dev.button(label, (e) => e.change((d) => (d.props.tabSize = size)));
      };
      tabSize(2);
      tabSize(4);
    });

    dev.hr(-1);

    dev.section('EditorTheme', (dev) => {
      const theme = (value: t.EditorTheme) => {
        dev.button((btn) =>
          btn
            .label(() => `theme: "${value}"`)
            .right((e) => (e.state.props.theme === value ? '← current' : ''))
            .onClick((e) => e.change((d) => (d.props.theme = value))),
        );
      };
      theme('Light');
      theme('Dark');
    });

    dev.hr(5, 20);

    dev.section('Carets', (dev) => {
      const getCaret = () => carets.id('foo.bar');

      const changeSelection = (
        label: string,
        selection: t.EditorRangesInput,
        options: { right?: string } = {},
      ) => {
        dev.button((btn) =>
          btn
            .label(label)
            .right(options.right ?? '')
            .onClick(() => getCaret().change({ selections: selection })),
        );
      };

      dev.button('selection: null', (e) => getCaret().change({ selections: null }));
      changeSelection('selection: [ ]', []);
      dev.hr(-1, 5);
      changeSelection('selection: [1, 3]', [1, 3]);
      changeSelection('selection: [1, 5]', [1, 5]);
      changeSelection('selection: {EditorRange}', {
        startLineNumber: 1,
        startColumn: 5,
        endLineNumber: 2,
        endColumn: 2,
      });
      dev.hr(-1, 5);
      changeSelection('selection: [1, 5], [2, 2]', [
        [1, 5],
        [2, 2],
      ]);
      changeSelection('selection: {EditorRange}, {EditorRange}', [
        {
          startLineNumber: 1,
          startColumn: 5,
          endLineNumber: 2,
          endColumn: 2,
        },
        {
          startLineNumber: 3,
          startColumn: 1,
          endLineNumber: 3,
          endColumn: 3,
        },
      ]);

      const color = (color: string) => {
        dev.button(`color: ${color}`, (e) => getCaret().change({ color }));
      };

      dev.hr(-1, 5);
      color('red');
      color('blue');
      dev.hr(-1, 5);
      dev.button((btn) =>
        btn
          .label('clear')
          .right('(dispose all)')
          .onClick(() => carets.current.forEach((c) => c.dispose())),
      );
    });
  });

  e.it('ui:footer', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    dev.footer.border(-0.1).render<T>((e) => {
      const textModel = editor?.getModel();
      const text = textModel?.getValue() ?? '';

      const data = {
        props: e.state.props,
        editor: !editor
          ? undefined
          : {
              'id.instance': editor?.getId(),
              'css.class': MonacoEditor.className(editor),
              text: `chars:(${text.length}), lines:(${text.split('\n').length})`,
            },
        carets: carets?.current ?? [],
      };
      return (
        <Dev.Object name={'MonacoEditor'} data={data} expand={{ level: 1, paths: ['$.editor'] }} />
      );
    });
  });
});
