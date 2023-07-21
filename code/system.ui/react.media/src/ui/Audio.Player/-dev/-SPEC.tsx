import { Dev, type t } from '../../../test.ui';
import { DevSample, DevSampleProps } from '../-dev/DEV.Sample';

/**
 * SAMPLE
 * 💦💦💦💦💦
 * Podcast:   Metamuse
 *            https://museapp.com/podcast.rss
 *
 * Episode:   46
 *    Title:  Industrial research with Peter van Hardenberg
 *    Audio:  https://media.museapp.com/podcast/46-industrial-research.mp3
 *
 * Eipsode    47
 *    Title:  Designing creative tools
 *    Audio:  https://media.museapp.com/podcast/47-designing-creative-tools.mp3
 *
 * Episode    48
 *    Title:
 *
 */

const URLS = {
  episode46: {
    title: 'Industrial research with Peter van Hardenberg',
    media: 'https://media.museapp.com/podcast/46-industrial-research.mp3',
  },
  episode47: {
    title: 'Designing creative tools',
    media: 'https://media.museapp.com/podcast/47-designing-creative-tools.mp3',
  },
};

type T = { props: DevSampleProps };
const initial: T = {
  props: {
    src: URLS.episode46.media,
  },
};

export default Dev.describe('AudioPlayer', (e) => {
  let _audio: HTMLAudioElement | undefined;
  const getOrCreateAudio = (state: t.DevCtxState<T>) => {
    if (_audio) return _audio;

    const props = state.current.props;
    if (!props.src) return;

    type AudioEvents = 'play' | 'pause' | 'ended' | 'timeupdate' | 'loadedmetadata';
    // play: This event is fired when playback of the audio file begins.
    // pause: This event is fired when playback of the audio file is paused.
    // ended: This event is fired when playback of the audio file is complete.
    // timeupdate: This event is fired as the audio file is being played, indicating that the playback position has changed.    //
    // loadedmetadata: This event is fired when the metadata for the audio file has been loaded, including the duration of the audio file.

    const audio = (_audio = new Audio(props.src));
    _audio.addEventListener('play', (e) => {
      console.log('play', e);
    });

    _audio.addEventListener('pause', (e) => {
      console.log('pause', e);
    });

    _audio.addEventListener('ended', (e) => {
      console.log('ended', e);
    });

    _audio.addEventListener('timeupdate', (e) => {
      // console.log('timeupdate', e);
      const currentTime = audio.currentTime;
      console.log('currentTime (secs):', audio.currentTime);
      state.change((d) => (d.props.currentTime = currentTime));
    });

    _audio.addEventListener('loadedmetadata', async (e) => {
      console.log('loadedmetadata', e);
      const seconds = audio.duration;
      console.log('duration (secs):', seconds);
      state.change((d) => (d.props.duration = seconds));
    });

    return _audio;
  };

  e.it('init', async (e) => {
    const ctx = Dev.ctx(e);
    const state = await ctx.state<T>(initial);
    ctx.subject
      .backgroundColor(1)
      .size([400, null])
      .display('grid')
      .render<T>((e) => {
        return (
          <DevSample
            {...e.state.props}
            onProgressBarClick={(e) => {
              const audio = getOrCreateAudio(state)!;
              const jumpTo = e.percent * audio.duration;
              audio.currentTime = jumpTo;
            }}
          />
        );
      });
  });

  e.it('ui:debug', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    const state = await dev.ctx.state(initial);

    dev.footer
      .border(-0.1)
      .render<T>((e) => <Dev.Object name={'spec'} data={e.state} expand={1} />);

    dev.TODO(`
AudioPlayer    
- [ ] Play audio files
- [ ] jump time controls - back 30s, 15s | forward 30s, 2m
- [ ] indexable list of named timestamps (markers, chapters, note-entry pointers)
- [ ] track and seek
- [ ] eventbus ($) observable AudioPlayer
  - [ ] started, stoped, current location
  - [ ] ended



    `);

    dev.hr(5, 30);

    dev.section('AudioPlayer', (e) => {
      const audio = () => getOrCreateAudio(state)!;

      dev.button('play', () => audio().play());
      dev.button('pause', () => audio().pause());
      dev.hr();

      dev.section('jump', (dev) => {
        const jump = (seconds: number, label?: string) => {
          dev.button((btn) =>
            btn
              .label(label ?? `${seconds} seconds`)
              .onClick(() => (audio().currentTime += seconds)),
          );
        };

        jump(-30, 'back 30s');
        jump(-15, 'back 15s');
        dev.hr();
        jump(30, 'forward 30s');
        jump(120, 'forward 2m');
      });
    });
  });
});
