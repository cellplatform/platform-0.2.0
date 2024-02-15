import { Dev, Pkg } from '../../test.ui';
import { DEFAULTS, Icons, type t } from './common';
import { Http } from './http';
import { Sample, type SampleProps } from './ui';
import { Message } from './ui.Message';

type T = {
  props: SampleProps;
  completion?: t.Completion;
  model?: t.ModelName;
  running?: boolean;
};
const initial: T = { props: {} };

/**
 * Spec
 */
const name = 'sample.api.openai';

export default Dev.describe(name, (e) => {
  type LocalStore = Pick<SampleProps, 'text'> & Pick<T, 'completion' | 'model'>;
  const localstore = Dev.LocalStorage<LocalStore>(`dev:${Pkg.name}.${name}`);
  const local = localstore.object({
    text: 'say hello',
    completion: undefined,
    model: DEFAULTS.model.default,
  });

  const sendPrompt = async (state: t.DevCtxState<T>) => {
    // BEFORE send.
    const current = state.current;
    const text = (current.props.text ?? '').trim();
    const isRunning = !!current.running;
    if (isRunning || !text) return;
    await state.change((d) => (d.running = true));

    // API call.
    const res = await Http.getCompletion(text);

    // AFTER send.
    await state.change((d) => {
      d.completion = local.completion = res;
      d.running = false;
    });
  };

  e.it('ui:init', async (e) => {
    const ctx = Dev.ctx(e);
    const dev = Dev.tools<T>(e, initial);

    const state = await ctx.state<T>(initial);
    await state.change((d) => {
      d.props.text = local.text;
      d.completion = local.completion;
      d.model = local.model;
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
            onChange={async (e) => {
              local.text = e.text;
              await state.change((d) => (d.props.text = e.text));
              dev.redraw('debug');
            }}
            onCmdEnterKey={(e) => {
              console.info('⚡️ onCmdEnterKey', e);
              sendPrompt(state);
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
        const isEnabled = () => {
          const current = state.current;
          const text = current.props.text ?? '';
          return !isRunning() && text.length > 0;
        };
        btn
          .label(() => (isRunning() ? `sending` : `send prompt`))
          .right(() => <Icons.Send size={16} />)
          .spinner(() => isRunning())
          .enabled(isEnabled)
          .onClick((e) => sendPrompt(e.state));
      });
      dev.hr(-1, 5);

      const modelButton = (model: t.ModelName) => {
        dev.button((btn) => {
          btn
            .label(`model: ${model}`)
            .right((e) => (e.state.model === model ? '←' : ''))
            .onClick((e) => e.change((d) => (local.model = d.model = model)));
        });
      };
      DEFAULTS.model.all.forEach(modelButton);

      dev.hr(-1, 5);
      dev.button('(reset)', (e) => e.change((d) => (d.completion = undefined)));
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
      const { props, completion } = e.state;
      const data = { props, completion };
      return <Dev.Object name={name} data={data} expand={1} />;
    });
  });
});
