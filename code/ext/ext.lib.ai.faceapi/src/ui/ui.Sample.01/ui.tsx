import { useEffect, useRef, useState } from 'react';
import { css, faceapi, type t } from './common';

export type SampleProps = {
  stream?: MediaStream;
  style?: t.CssValue;
};

export const Sample: React.FC<SampleProps> = (props) => {
  const { stream } = props;

  const [modelsReady, setModelsReady] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  /**
   * Lifecycle
   */
  useEffect(() => {
    load().then(() => setModelsReady(true));
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (modelsReady && stream && video) {
      video.srcObject = stream;
      video.play();
    }
  }, [modelsReady, stream, !!videoRef.current]);

  /**
   * Render
   */
  const styles = {
    base: css({ position: 'relative', display: 'grid' }),
    video: css({
      width: '100%',
      height: '100%',
      objectFit: 'cover',
    }),
    canvas: css({ position: 'absolute', width: '100%', height: '100%' }),
  };

  const elVideo = (
    <video
      ref={videoRef}
      muted={true}
      autoPlay={false}
      onPlay={() => {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        if (video && canvas) monitorFaces(video, canvas);
      }}
      {...styles.video}
    />
  );

  return (
    <div {...css(styles.base, props.style)}>
      <canvas ref={canvasRef} {...styles.canvas} />
      {elVideo}
    </div>
  );
};

/**
 * Helpers
 */

async function load() {
  const url = 'https://api.db.team/faceapi/models';
  await Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri(url),
    faceapi.nets.faceLandmark68Net.loadFromUri(url),
    faceapi.nets.faceRecognitionNet.loadFromUri(url),
    faceapi.nets.faceExpressionNet.loadFromUri(url),
  ]);
}

function getSize(element: HTMLElement) {
  return { width: element.offsetWidth, height: element.offsetHeight } as const;
}

async function monitorFaces(video: HTMLVideoElement, canvas: HTMLCanvasElement) {
  const size = getSize(video);
  faceapi.matchDimensions(canvas, size);
  setInterval(() => detectFaces(video, canvas), 100);
}

async function detectFaces(video: HTMLVideoElement, canvas: HTMLCanvasElement) {
  const options = new faceapi.TinyFaceDetectorOptions();
  const detections = await faceapi
    .detectAllFaces(video, options)
    .withFaceLandmarks()
    .withFaceExpressions();

  const resizeDetections = faceapi.resizeResults(detections, getSize(video));

  canvas.getContext('2d')?.clearRect(0, 0, canvas.width, canvas.height);
  faceapi.draw.drawDetections(canvas, resizeDetections);
  faceapi.draw.drawFaceLandmarks(canvas, resizeDetections);
  faceapi.draw.drawFaceExpressions(canvas, resizeDetections);
}
