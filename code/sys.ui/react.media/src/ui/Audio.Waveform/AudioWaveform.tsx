import { useRef } from 'react';
import { css, type t } from '../../common';
import { useAudioAnalyser } from './useAudioAnalyser.mjs';
import { useDrawWaveform } from './useDrawWaveform.mjs';

export type AudioWaveformProps = {
  stream?: MediaStream;
  width?: number;
  height?: number;
  lineColor?: string | number;
  lineWidth?: number;
  style?: t.CssValue;
};

/**
 * Paints an audio waveform to a <canvas> element.
 *
 * Samples:
 *    https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Visualizations_with_Web_Audio_API
 *    https://www.twilio.com/blog/audio-visualisation-web-audio-api--react
 *
 */
export const AudioWaveform: React.FC<AudioWaveformProps> = (props) => {
  const { width = 300, height = 30, stream, lineColor, lineWidth } = props;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { audioData } = useAudioAnalyser({ stream });

  useDrawWaveform({ canvasRef, audioData, lineColor, lineWidth });

  const styles = {
    base: css({ width, height }),
  };

  return (
    <div {...css(styles.base, props.style)}>
      <canvas ref={canvasRef} width={width} height={height} />
    </div>
  );
};
