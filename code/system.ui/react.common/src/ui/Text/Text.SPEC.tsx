import { Dev } from '../../test.ui';

export default Dev.describe('Text', (e) => {
  e.it('debug panel', async (e) => {
    const dev = Dev.tools(e);

    dev.button('text to speech', (e) => {
      const text = `Hello World.`;
      const synth = window.speechSynthesis;
      const utter = new SpeechSynthesisUtterance(text);
      synth.speak(utter);
    });
  });
});
