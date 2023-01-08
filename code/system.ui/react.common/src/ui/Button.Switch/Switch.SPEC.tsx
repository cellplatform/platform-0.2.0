import { Dev } from '../../test.ui';
import { Switch, SwitchProps } from '.';

type T = SwitchProps;
const initial: T = {};

export default Dev.describe('Switch (Button)', (e) => {
  e.it('init', async (e) => {
    const ctx = Dev.ctx(e);
    ctx.component.render<T>((e) => {
      return <Switch {...e.state} />;
    });
  });

  e.it('debug panel', async (e) => {
    const dev = Dev.tools<T>(e, initial);

    dev
      .button((btn) =>
        btn
          .label('toggle `isEnabled`')
          .onClick((e) => e.change((draft) => (draft.isEnabled = !draft.isEnabled))),
      )
      .button((btn) =>
        btn
          .label('toggle `value`')
          .onClick((e) => e.change((draft) => (draft.value = !draft.value))),
      );
  });
});
