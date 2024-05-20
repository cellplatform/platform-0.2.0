import { css, Dev } from '../../../test.ui';

type T = { pitch: number };
const initial: T = { pitch: 1 };

export default Dev.describe('Text', (e) => {
  e.it('init', async (e) => {
    const ctx = Dev.ctx(e);
    await ctx.state<T>(initial);
    ctx.subject
      .display('grid')
      .backgroundColor(0.03)
      .render<T>((e) => {
        return <div {...css({ fontSize: 200 })}>{'🤖'}</div>;
      });
  });

  e.it('ui:debug', async (e) => {
    const dev = Dev.tools<T>(e);
    const state = await dev.ctx.state<T>(initial);

    dev.footer
      .border(-0.1)
      .render<T>((e) => <Dev.Object name={'Text'} data={e.state} expand={3} />);

    dev.section('Speech Synthesis Utterance 🤖 (W3C)', (dev) => {
      if (typeof window.speechSynthesis !== 'object') return;

      const synth = window.speechSynthesis;
      const utterance = new SpeechSynthesisUtterance();

      const utter = async (text: string) => {
        const utter = utterance;
        utter.text = text;
        utter.pitch = state.current.pitch;
        synth.cancel();
        synth.speak(utter);
      };

      dev.hr();

      dev.button('short: "Hello World!"', async (e) => {
        await utter(`Hello World!`);
      });

      dev.button('long: Orwell (essay extract - "Why I Write", 1946)', async (e) => {
        const { Essays } = await import('./-SPEC.essay');
        const text = Essays.Orwell.extract;
        const words = text.split(' ');

        e.label(`long: ${words.length} words`);
        await utter(words.join(' '));
      });

      dev.hr();
      dev.button('cancel', () => synth.cancel());
      dev.hr();

      dev.section('Pitch', (dev) => {
        const adjustPitch = async (amount: number) => {
          const pitch = state.current.pitch + amount;
          await state.change((d) => (d.pitch = pitch));
          if (utterance.text) await utter(utterance.text);
        };

        const BY = 0.1;
        dev.button('increment (+)', (e) => adjustPitch(BY));
        dev.button('increment (-)', (e) => adjustPitch(0 - BY));
      });
    });
  });
});
