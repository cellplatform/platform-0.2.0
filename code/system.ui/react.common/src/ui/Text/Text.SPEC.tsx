import { Dev } from '../../test.ui';

export default Dev.describe('Text', (e) => {
  e.it('debug panel', async (e) => {
    const dev = Dev.tools(e);

    dev.section('Text to Speech (W3C)', (dev) => {
      const synth = window.speechSynthesis;

      const utter = (text: string) => {
        const utter = new SpeechSynthesisUtterance(text);
        synth.cancel();
        synth.speak(utter);
      };

      dev.button('short: "Hello World!"', (e) => {
        utter(`Hello World!`);
      });

      dev.button('long: Orwell (extract - "Why I Write")', async (e) => {
        const { Essays } = await import('./dev/SAMPLE.essay.mjs');
        const text = Essays.Orwell.extract;
        const words = text.split(' ');

        utter(words.join(' '));
        e.label(`long: ${words.length} words`);
      });

      dev.hr();
      dev.button('cancel', () => synth.cancel());
      dev.hr();
    });
  });
});
