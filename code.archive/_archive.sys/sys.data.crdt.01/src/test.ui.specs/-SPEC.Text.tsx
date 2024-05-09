import { Automerge, Crdt, Dev, css, rx, type t } from '../test.ui';

type T = { count: number };
const initial: T = { count: 0 };

export default Dev.describe('Text', (e) => {
  type D = { text: t.AutomergeText };
  const doc = Crdt.Doc.ref<D>('my-id', { text: Crdt.text() });

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

    doc.$.pipe(rx.takeUntil(dev.ctx.dispose$)).subscribe((e) => dev.redraw());

    dev.section((dev) => {
      dev.button('redraw', (e) => dev.redraw());
    });

    dev.hr(5, 30);

    dev.textbox((txt) =>
      txt
        .label('Text')
        .value(() => doc.current.text.toString())
        .focus({ onReady: true })
        .onChange((e) => {
          doc.change((d) => Crdt.Text.update(d.text, e.to.diff));
          txt.redraw(true);
        }),
    );
  });

  e.it('ui:footer', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    dev.footer.border(-0.1).render<D>((e) => {
      const text = doc.current.text.toString();
      const history = Automerge.getHistory(doc.current).map((m) => m.snapshot.text.toString());
      const data = { text, history };
      return <Dev.Object name={'Dev.Text'} data={data} expand={2} />;
    });
  });
});
