import { MediaStream } from '.';
import { Button, css, Delete, Dev, rx, slug, t } from '../../test.ui';
import { DevAudioWaveform } from './-dev/DEV.AudioWaveform';
import { DevRecordButton } from './-dev/DEV.RecordButton';
import { Sample } from './-dev/DEV.Sample';
import { FileUtil } from './util';

import type { VideoProps } from '../MediaStream.Video';

type T = {
  props: VideoProps;
  muted: { video: boolean; audio: boolean };
};
const initial: T = {
  props: { muted: true },
  muted: { video: false, audio: false },
};

export default Dev.describe('MediaStream', (e) => {
  const ref = `sample.${slug()}`;
  const bus = rx.bus<t.MediaEvent>();
  const events = MediaStream.Events(bus);

  const updateMute = async (state: T) => {
    const { stream } = await events.status(ref).get();
    if (stream) {
      stream.media.getAudioTracks().forEach((track) => (track.enabled = !state.muted.audio));
      stream.media.getVideoTracks().forEach((track) => (track.enabled = !state.muted.video));
    }
  };

  const startVideoStream = async (state: T) => {
    await events.stop(ref).fire();
    await events.start(ref).video();
    await updateMute(state);
  };

  e.it('init', async (e) => {
    const ctx = Dev.ctx(e);
    await ctx.state<T>(initial);

    MediaStream.Controller({ bus });

    rx.payload<t.MediaStreamErrorEvent>(bus.$, 'MediaStream/error')
      .pipe(rx.filter((e) => e.ref === ref))
      .subscribe((e) => {
        console.info('MediaStream/error:', e);
      });

    ctx.subject.display('grid').render<T>((e) => {
      const width = 300;
      const styles = {
        streamRef: css({}),
        flowH: css({ Flex: 'horizontal-center-center' }),
      };

      const getNextPath = async () => {
        return ''; // TEMP 🐷
        // const fs = await e.ctx.filesystem.store();
        // const files = (await fs.manifest()).files.filter((e) =>
        //   e.path.match(/project\/.*\.webm$/),
        // );
        // const total = files.length;
        // return `project/video-${total + 1}.webm`;
      };

      const elStartMediastreamButton = (
        <Button onClick={() => startVideoStream(e.state)}>⚡️ Start</Button>
      );

      const topLeft = (
        <div {...styles.flowH}>
          <div {...css({ marginRight: 6 })}>{'<VideoStream>'}</div>
          {elStartMediastreamButton}
        </div>
      );

      /**
       * Video Stream.
       */
      const elVideoStream = <Sample {...e.state.props} streamRef={ref} bus={bus} />;

      /**
       * Audio Waveform.
       */
      const elAudioWaveform = (
        <DevAudioWaveform bus={bus} streamRef={ref} width={width} height={30} />
      );

      /**
       * Record button.
       */
      const elRecordButton = (
        <DevRecordButton
          bus={bus}
          streamRef={ref}
          onFileReady={async (e) => {
            const data = e.data;
            const path = await getNextPath();

            // e.ctx.action.saveVideo(path, data);
            console.log('TODO', 'save video', path);
            console.log('video/data:', e.mimetype, data);

            const name = 'video.webm';
            const blob = e.toBlob();
            FileUtil.download(name, blob);
          }}
        />
      );

      return (
        <div>
          {elVideoStream}
          {elAudioWaveform}
          {elRecordButton}
        </div>
      );
    });
  });

  e.it('ui:debug', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    const state = await dev.ctx.state<T>(initial);

    dev.footer
      .border(-0.1)
      .render<T>((e) => <Dev.Object name={'info'} data={e.state} expand={1} />);

    dev.section('Properties', (dev) => {
      dev.boolean((btn) =>
        btn
          .label('muted')
          .value((e) => e.state.props.muted)
          .onClick((e) => e.change((d) => Dev.toggle(d.props, 'muted'))),
      );
    });

    dev.hr();

    dev.section('Debug', (dev) => {
      const muted = (key: keyof T['muted']) => {
        dev.boolean((btn) =>
          btn
            .label(`${key}: muted`)
            .value((e) => e.state.muted[key])
            .onClick((e) => {
              e.change((d) => Dev.toggle(d.muted, key));
              updateMute(e.state.current);
            }),
        );
      };
      muted('video');
      muted('audio');
      dev.hr();
    });

    dev.section('Events', (dev) => {
      let _info: JSX.Element;
      const draw = (title: string, data: any) => {
        _info = <Dev.Object name={title} data={Delete.undefined(data)} expand={1} fontSize={12} />;
        redraw();
      };

      events.status(ref).res$.subscribe(async (e) => {
        const info = await events.all.status().get();
        draw('status', info);
      });

      dev
        .button('⚡️ MediaStream/start (video)', async (e) => {
          await startVideoStream(e.state.current);
        })
        .button('⚡️ MediaStream/start (screen)', async (e) => {
          await events.stop(ref).fire();
          await events.start(ref).screen();
          await updateMute(state.current);
        })
        .hr()
        .button('⚡️ MediaStream/status:req', async (e) => {
          const res = await events.status(ref).get();
          draw('status', res);
        })
        .button('⚡️ MediaStreams/status:req (all)', async (e) => {
          const res = await events.all.status().get();
          draw('status.all', res);
        })
        .hr()
        .button('⚡️ MediaStreams/record/status:req', async (e) => {
          const res = await events.record(ref).status.get();
          draw('status.record', res);
        })
        .hr();

      const { redraw } = dev.row((e) => _info);
    });
  });
});
