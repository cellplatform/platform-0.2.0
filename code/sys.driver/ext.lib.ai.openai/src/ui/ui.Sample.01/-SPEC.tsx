import { Dev, Pkg } from '../../test.ui';
import { DEFAULTS, Icons, type t } from './common';
import { Http } from './http';
import { Sample } from './ui';
import { Message } from './ui.Message';
import { EmptyMessage } from './ui.Message.Empty';

type T = {
  props: t.SampleProps;
  model?: t.ModelName;
  completion?: t.Completion;
  debug: { running?: boolean; forcePublicUrl?: boolean };
};
const initial: T = { props: {}, debug: {} };

/**
 * Spec
 */
const name = 'sample.api.openai';

export default Dev.describe(name, (e) => {
  type LocalStore = Pick<t.SampleProps, 'text'> & T['debug'] & Pick<T, 'completion' | 'model'>;
  const localstore = Dev.LocalStorage<LocalStore>(`dev:${Pkg.name}.${name}`);
  const local = localstore.object({
    text: 'say hello world properly',
    completion: undefined,
    model: DEFAULTS.model.default,
    forcePublicUrl: false,
  });

  const sendPrompt = async (state: t.DevCtxState<T>) => {
    // BEFORE send.
    const current = state.current;
    const forcePublicUrl = current.debug.forcePublicUrl ?? false;
    const text = (current.props.text ?? '').trim();
    const isRunning = !!current.debug.running;
    if (isRunning || !text) return;
    await state.change((d) => (d.debug.running = true));

    // API call.
    const res = await Http.fetchCompletion(text, { forcePublicUrl });

    // AFTER send.
    await state.change((d) => {
      d.completion = local.completion = res;
      d.debug.running = false;
    });
  };

  e.it('ui:init', async (e) => {
    const ctx = Dev.ctx(e);
    const dev = Dev.tools<T>(e, initial);

    const state = await ctx.state<T>(initial);
    await state.change((d) => {
      d.props.text = local.text;
      d.props.env = ctx.env;
      d.completion = local.completion;
      d.model = local.model;
      d.debug.forcePublicUrl = local.forcePublicUrl;
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
              local.text = e.content.text;
              await state.change((d) => (d.props.text = e.content.text));
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
    const link = Dev.Link.pkg(Pkg, dev);

    link.button('see: docs (openai api)', 'https://platform.openai.com/docs').hr(5, 20);

    dev.section('', (dev) => {
      dev.button((btn) => {
        const isRunning = () => !!state.current.debug.running;
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
            .right((e) => (e.state.model === model ? <Icons.Check size={16} /> : ''))
            .onClick((e) => e.change((d) => (local.model = d.model = model)));
        });
      };
      DEFAULTS.model.all.forEach(modelButton);

      dev.hr(-1, 5);
      dev.button('(reset)', (e) => e.change((d) => (d.completion = undefined)));
    });

    dev.hr(5, 20);

    dev.row((e) => {
      const completion = e.state.completion;
      const list = completion?.choices ?? [];
      if (list.length === 0) return <EmptyMessage />;

      const elMessages = list.map((e, i) => <Message key={i} message={e.message} />);
      return <div>{elMessages}</div>;
    });

    dev.hr(5, 20);

    dev.section('Debug', (dev) => {
      dev.boolean((btn) => {
        const value = (state: T) => Boolean(state.debug.forcePublicUrl);
        btn
          .label((e) => `force public url`)
          .value((e) => value(e.state))
          .onClick((e) => {
            e.change((d) => (local.forcePublicUrl = Dev.toggle(d.debug, 'forcePublicUrl')));
          });
      });
    });
  });

  e.it('ui:footer', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    const state = await dev.state();
    dev.footer.border(-0.1).render<T>((e) => {
      const { debug, props, completion } = e.state;
      const data = {
        origin: Http.url(debug.forcePublicUrl),
        props,
        completion,
      };
      return <Dev.Object name={name} data={data} expand={1} />;
    });
  });
});
