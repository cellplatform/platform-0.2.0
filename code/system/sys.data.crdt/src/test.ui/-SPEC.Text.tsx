import { css, Dev, Crdt, t, Automerge } from '../test.ui';

type T = { count: number };
const initial: T = { count: 0 };

export default Dev.describe('Text', (e) => {
  type D = { text: t.AutomergeText };
  const doc = Crdt.Doc.ref<D>({ text: new Automerge.Text() });

  e.it('init', async (e) => {
    const ctx = Dev.ctx(e);
    ctx.subject
      .backgroundColor(1)
      .display('grid')
      .render((e) => {
        const text = doc.current.text.toString().trim();
        const style: t.CssValue = {
          fontSize: 18,
          padding: 10,
          opacity: text ? 1 : 0.5,
        };

        return <div {...css(style)}>{text || 'empty'}</div>;
      });
  });

  e.it('ui:debug', async (e) => {
    const dev = Dev.tools(e);
    const state = await dev.ctx.state<T>(initial);
    const redraw = () => state.change((d) => d.count++);

    dev.textbox((txt) =>
      txt
        .label('Text')
        .value(() => doc.current.text.toString())
        .focus({ onReady: true })
        .onChange((e) => {
          doc.change((d) => {
            e.next.diff.forEach((change) => {
              if (change.kind === 'Added') {
                d.text.insertAt(change.index, change.value);
              }
              if (change.kind === 'Deleted') {
                d.text.deleteAt(change.index, change.value.length);
              }
            });
          });
          redraw();
        }),
    );

    /**
     * Footer
     */
    dev.footer.border(-0.1).render<D>((e) => {
      const text = doc.current.text.toString();
      const data = { text };
      return <Dev.Object name={'Dev.Text'} data={data} expand={1} />;
    });
  });
});
