import { Dev, t } from '../test.ui';

type T = {
  spinning?: boolean;
  results?: t.TestSuiteRunResponse[];
};
const initial: T = {};

export default Dev.describe('Root', (e) => {
  type LocalStore = { selected: string[] };
  const localstore = Dev.LocalStorage<LocalStore>('dev:sys.crdt.testrunner');
  const local = localstore.object({ selected: [] });

  e.it('init', async (e) => {
    const ctx = Dev.ctx(e);
    await ctx.state<T>(initial);

    ctx.subject
      .backgroundColor(1)
      .size('fill')
      .render<T>((e) => {
        const { spinning, results } = e.state;
        return (
          <Dev.TestRunner.Results
            data={results}
            spinning={spinning}
            scroll={true}
            style={{ Absolute: 0 }}
          />
        );
      });
  });

  e.it('ui:debug', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    const state = await dev.state();

    dev.row((e) => {
      return (
        <Dev.TestRunner.PropList.Controlled
          initial={{
            run: {
              label: 'Verify',
              list: [
                // System
                import('../crdt.DocRef/-TEST.mjs'),
                import('../crdt.DocFile/-TEST.mjs'),
                import('../crdt.DocSync/-dev/-TEST.DocSync.mjs'),
                import('../crdt.DocSync/-dev/-TEST.PeerSyncer.mjs'),
                import('../crdt.Lens/-dev/-TEST.mjs'),
                import('../crdt.Schema/-dev/-TEST.mjs'),
                import('../crdt.helpers/-TEST.mjs'),

                // Driver (Automerge)
                import('../driver.Automerge/-dev/TEST.basic.mjs'),
                import('../driver.Automerge/-dev/TEST.api.mjs'),
                import('../driver.Automerge/-dev/TEST.initialState.mjs'),
                import('../driver.Automerge/-dev/TEST.filesystem.mjs'),
                import('../driver.Automerge/-dev/TEST.sync.mjs'),
              ],
            },
            specs: { selected: local.selected },
          }}
          onChanged={async (e) => {
            local.selected = e.selected;
            await state.change((d) => (d.results = e.results));
          }}
        />
      );
    });
  });

  e.it('ui:footer', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    dev.footer.border(-0.1).render<T>((e) => {
      const data = {
        TestResults: e.state.results,
      };
      return <Dev.Object name={`state`} data={data} expand={1} />;
    });
  });
});
