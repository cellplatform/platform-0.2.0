import { DEFAULTS, MonacoEditor } from '.';
import { Dev, EditorCarets, Immutable, Json, Pkg, rx, Wrangle, type t } from '../../test.ui';
import { CODE_SAMPLES } from './-sample.code';

type P = t.MonacoEditorProps;
type D = {
  render: boolean;
  selection: t.EditorRange | null;
};

/**
 * Spec
 */
const name = 'MonacoEditor';

export default Dev.describe(name, (e) => {
  type LocalStore = { props?: string; debug?: string };
  const localstore = Dev.LocalStorage<LocalStore>(`dev:${Pkg.name}.${name}`);
  const local = localstore.object({ props: undefined, debug: undefined });

  const State = {
    props: Immutable.clonerRef<P>(Json.parse<P>(local.props, DEFAULTS.props)),
    debug: Immutable.clonerRef<D>(Json.parse<D>(local.debug, { selection: null, render: true })),
  } as const;

  let editor: t.MonacoCodeEditor;
  let monaco: t.Monaco;
  let carets: t.EditorCarets;

  e.it('ui:init', async (e) => {
    const ctx = Dev.ctx(e);
    const dev = Dev.tools<D>(ctx);

    const props$ = State.props.events().changed$;
    const debug$ = State.debug.events().changed$;

    rx.merge(props$, debug$)
      .pipe(rx.debounceTime(1000))
      .subscribe(() => {
        local.props = Json.stringify(State.props.current);
        local.debug = Json.stringify(State.debug.current);
      });

    rx.merge(props$, debug$)
      .pipe(rx.debounceTime(100))
      .subscribe(() => dev.redraw('debug'));

    ctx.debug.width(360);
    ctx.subject
      .size('fill')
      .display('grid')
      .render<D>((e) => {
        const debug = State.debug.current;
        const props = State.props.current;
        Dev.Theme.background(dev, props.theme, 1);

        if (!debug.render) return null;

        return (
          <MonacoEditor
            {...props}
            onReady={(e) => {
              console.info(`⚡️ onReady:`, e);
              e.dispose$.subscribe(() => console.info(`⚡️ onReady.dispose$`));

              editor = e.editor;
              monaco = e.monaco;
              carets = e.carets;
              carets.$.subscribe((e) => ctx.redraw());

              const asRange = Wrangle.asRange;
              const debug = State.debug.current;
              if (debug.selection) editor.setSelection(debug.selection);
              editor.onDidChangeCursorSelection((e) => {
                State.debug.change((d) => (d.selection = asRange(e.selection)));
              });

              ctx.redraw();

              // Sample: catch [CMD + Enter] key.
              editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, (e) => {
                console.log('CMD + Enter', e);
              });
            }}
            onChange={(e) => {
              console.info(`⚡️ onChange:`, e);
              State.props.change((d) => (d.text = e.state.text));
            }}
          />
        );
      });
  });

  e.it('ui:debug', async (e) => {
    const dev = Dev.tools<D>(e);
    const ctx = dev.ctx;

    dev.section('Properties', (dev) => {
      const current = () => State.props.current;
      const change = (fn: (d: P) => void) => {
        State.props.change((d) => fn(d));
        dev.redraw();
      };

      Dev.Theme.immutable(dev, State.props, 1);
      dev.hr(-1, 5);

      dev.boolean((btn) => {
        const value = () => !!current().enabled;
        btn
          .label((e) => `enabled`)
          .value((e) => value())
          .onClick((e) => change((d) => Dev.toggle(d, 'enabled')));
      });

      dev.boolean((btn) => {
        const value = () => !!current().readOnly;
        btn
          .label((e) => `readOnly`)
          .value((e) => value())
          .onClick((e) => change((d) => Dev.toggle(d, 'readOnly')));
      });
      dev.boolean((btn) => {
        const value = () => !!current().minimap;
        btn
          .label((e) => `minimap`)
          .value((e) => value())
          .onClick((e) => change((d) => Dev.toggle(d, 'minimap')));
      });

      dev.hr(-1, 5);

      const tabSize = (size: number) => {
        dev.button((btn) => {
          btn
            .label(`tabSize: ${size}`)
            .right((e) => (current().tabSize === size ? '←' : ''))
            .enabled((e) => true)
            .onClick((e) => change((d) => (d.tabSize = size)));
        });
      };
      tabSize(2);
      tabSize(4);

      dev.hr(-1, 10);
      dev.textbox((txt) =>
        txt
          .margin([0, 0, 10, 0])
          .label((e) => 'placeholder')
          .placeholder('enter placeholder text')
          .value((e) => current().placeholder)
          .onChange((e) => change((d) => (d.placeholder = e.to.value)))
          .onEnter((e) => {}),
      );
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
        return dev.button((btn) => {
          const current = () => State.props.current.language;
          btn
            .label(language)
            .right(() => (current() === language ? '←' : ''))
            .onClick((e) => {
              State.props.change((d) => {
                d.language = language;
                if (codeSample) d.text = format(codeSample);
              });
            });
        });
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

    dev.section('Carets', (dev) => {
      const getCaret = () => carets.identity('foo.bar');

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

    dev.hr(5, 20);

    dev.section('Debug', (dev) => {
      dev.button('redraw', (e) => ctx.redraw());
      dev.boolean((btn) => {
        const value = () => !!State.debug.current.render;
        btn
          .label(() => `render`)
          .value(() => value())
          .onClick(() => {
            State.debug.change((d) => Dev.toggle(d, 'render'));
            dev.redraw();
          });
      });
    });
  });

  e.it('ui:footer', (e) => {
    const dev = Dev.tools<D>(e);
    dev.footer.border(-0.1).render<D>((e) => {
      const textModel = editor?.getModel();
      const text = textModel?.getValue() ?? '';

      const data = {
        props: State.props.current,
        editor: !editor
          ? undefined
          : {
              'id.instance': editor?.getId(),
              'css.class': MonacoEditor.className(editor),
              text: `chars:(${text.length}), lines:(${text.split('\n').length})`,
            },
        // carets: carets?.current ?? [],
      };
      return <Dev.Object name={name} data={data} expand={{ level: 1, paths: ['$'] }} />;
    });
  });
});
