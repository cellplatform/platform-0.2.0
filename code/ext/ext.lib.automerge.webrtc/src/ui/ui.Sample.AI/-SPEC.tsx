import { Dev, Pkg } from '../../test.ui';
import { Sample, type SampleProps } from './ui';
import { type t } from './common';
import { Http } from './http';
import { Message } from './ui.Message';

type T = {
  props: SampleProps;
  completion?: t.Completion;
  running?: boolean;
};
const initial: T = { props: {} };

/**
 * Spec
 */
const name = 'Sample.AI';

export default Dev.describe(name, (e) => {
  type LocalStore = Pick<SampleProps, 'text'> & Pick<T, 'completion'>;
  const localstore = Dev.LocalStorage<LocalStore>(`dev:${Pkg.name}.${name}`);
  const local = localstore.object({
    text: 'say hello',
    completion: undefined,
  });

  e.it('ui:init', async (e) => {
    const ctx = Dev.ctx(e);
    const dev = Dev.tools<T>(e, initial);

    const state = await ctx.state<T>(initial);
    await state.change((d) => {
      d.props.text = local.text;
      d.completion = local.completion;
    });

    ctx.debug.width(330);
    ctx.subject
      .backgroundColor(1)
      .size('fill')
      .display('grid')
      .render<T>((e) => {
        return (
          <Sample
            {...e.state.props}
            onChange={(e) => {
              state.change((d) => (d.props.text = e.text));
              local.text = e.text;
            }}
          />
        );
      });
  });

  e.it('ui:debug', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    const state = await dev.state();

    dev.section('', (dev) => {
      dev.button((btn) => {
        const isRunning = () => !!state.current.running;
        const isEnabled = () => !isRunning();
        btn
          .label(`chat completion`)
          .spinner(() => isRunning())
          .enabled(isEnabled)
          .onClick(async (e) => {
            if (isRunning()) return;
            await e.state.change((d) => (d.running = true));
            const text = e.state.current.props.text ?? '';
            const res = await Http.getCompletion(text);
            await e.change((d) => {
              d.completion = local.completion = res;
              d.running = false;
            });
          });
      });

      dev.hr(-1, 5);
      dev.button('clear', (e) => e.change((d) => (d.completion = undefined)));
    });

    dev.hr(5, 20);

    dev.row((e) => {
      const list = e.state.completion;
      if (!list) return null;
      return (
        <div>
          {list.choices.map((e, i) => (
            <Message key={i} message={e.message} />
          ))}
        </div>
      );
    });
  });

  e.it('ui:footer', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    const state = await dev.state();
    dev.footer.border(-0.1).render<T>((e) => {
      const data = e.state;
      return <Dev.Object name={name} data={data} expand={1} />;
    });
  });
});
