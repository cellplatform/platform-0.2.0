import { Color, ObjectView, ProgressBar, Time, Value, css, type t } from '../../common';

type Seconds = number;

export type DevSampleProps = {
  src?: string;
  duration?: Seconds;
  currentTime?: Seconds;
  style?: t.CssValue;
  onProgressBarClick?: (e: { percent: number }) => void;
};

export const DevSample: React.FC<DevSampleProps> = (props) => {
  const { duration = -1, currentTime = -1 } = props;
  const percent = duration >= 0 ? currentTime / duration : 0;

  const msecs = {
    duration: duration * 1000,
    currentTime: currentTime * 1000,
  };

  /**
   * [Render]
   */
  const styles = {
    base: css({
      position: 'relative',
      boxSizing: 'border-box',
      padding: 30,
    }),
    title: css({
      borderBottom: `solid 1px ${Color.format(-0.1)}`,
      paddingBottom: 10,
      marginBottom: 10,
    }),
    progressBar: css({
      marginTop: 30,
    }),
  };

  let data = {} as any;

  if (duration >= 0) {
    data = {
      ...data,
      duration: `${Time.duration(msecs.duration).min}m`,
      'duration(secs)': Value.round(duration, 0),
      'current(secs)': Value.round(currentTime, 0),
      progress: `${Value.round(percent * 100, 0)}%`,
    };
  }

  if (duration < 0) {
    data.loaded = false;
  }

  return (
    <div {...css(styles.base, props.style)}>
      <div {...styles.title}>{`🐷 AudioPlayer`}</div>
      <ObjectView data={data} expand={2} />
      <ProgressBar
        percent={percent}
        style={styles.progressBar}
        onClick={props.onProgressBarClick}
      />
    </div>
  );
};
