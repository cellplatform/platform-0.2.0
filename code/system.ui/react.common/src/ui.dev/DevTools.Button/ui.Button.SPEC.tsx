import { Button } from './ui.Button';
import { Dev } from '..';

const initial = { count: 0 };
type S = typeof initial;

export default Dev.describe('Button', (e) => {
  e.it('init', async (e) => {
    const ctx = Dev.ctx(e);
    ctx.component
      .display('grid')
      .size(250, undefined)
      .render((e) => {
        const right = <div>123</div>;
        return (
          <Button label={'My Button'} right={right} onClick={() => console.info(`⚡️ onClick`)} />
        );
      });
  });

  e.it('debug panel', async (e) => {
    const dev = Dev.tools<S>(e, initial);
    dev.button((btn) =>
      btn.label('My Button').onClick(async (e) => {
        await e.state.change((draft) => draft.count++);
        e.label(`count-${e.state.current.count}`);
      }),
    );
  });
});
