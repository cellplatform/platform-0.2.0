import { useEffect, useState } from 'react';
import { Color, COLORS, css, t, rx, slug, Vimeo, Time, useSizeObserver } from '../common';
import { KeyboardMonitor } from './VideoDiagram.keyboard.mjs';
import { Icons } from '../Icons.mjs';
import { TooSmall } from '../TooSmall';
import { ProgressBar } from './ProgressBar';

const SAMPLE = {
  video: 727951677, // TEMP 🐷
  diagram:
    'https://user-images.githubusercontent.com/185555/201820392-e66aa287-3df9-4d8f-a480-d15382f62c17.png',
};

export type VideoDiagramProps = {
  isDimmed?: boolean;
  minHeight?: number;
  minWidth?: number;
  style?: t.CssValue;
};

export const VideoDiagram: React.FC<VideoDiagramProps> = (props) => {
  const { isDimmed = false, minWidth = 550, minHeight = 550 } = props;

  const [instance, setInstance] = useState<t.VimeoInstance>();
  const [muted, setMuted] = useState(false);
  const [percent, setPercent] = useState(0);

  const size = useSizeObserver();
  const isTooSmall = !size.ready
    ? undefined
    : size.rect.width < minHeight || size.rect.height < minWidth;

  /**
   * Lifecycle
   */
  useEffect(() => {
    const id = `foo.${slug()}`;
    const bus = rx.bus();
    const instance = { bus, id };
    const vimeo = Vimeo.Events({ instance });
    setInstance(instance);

    const keyboard = KeyboardMonitor.listen({ vimeo, setMuted });

    vimeo.status.$.subscribe((e) => {
      setPercent(e.percent);
    });

    // TEMP 🐷
    Time.delay(100, () => vimeo.play.fire());

    return () => {
      vimeo.dispose();
      keyboard.dispose();
    };
  }, []);

  /**
   * [Render]
   */
  const styles = {
    base: css({
      position: 'relative',
      backgroundColor: Color.format(isDimmed ? 0.1 : 1),
      transition: `background-color 300ms`,
      overflow: 'hidden',
    }),
    body: css({
      Absolute: 0,
      opacity: size.ready ? 1 : 0,
      transition: 'opacity 150ms',
    }),
    video: {
      base: css({
        Absolute: [null, null, 30, 30],
        Flex: 'x-stretch-stretch',
      }),
      vimeo: css({
        border: `solid 1px ${Color.alpha(COLORS.DARK, 0.3)}`,
        boxShadow: `0 0px 16px 0 ${Color.alpha(COLORS.DARK, 0.06)}`,
        borderRadius: 10,
      }),
      icons: css({
        Absolute: [7, 7, null, null],
        Flex: 'x-center-center',
      }),
    },
    image: {
      base: css({
        Absolute: [100, 100, 150, 100],
        opacity: isDimmed ? 0.4 : 1,
        transition: `opacity 300ms`,
      }),
      inner: css({
        Absolute: 0,
        backgroundSize: 'contain',
        backgroundImage: `url(${SAMPLE.diagram})`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center center',
      }),
    },
  };

  const elVimeo = instance && (
    <div {...styles.video.base}>
      <Vimeo
        instance={instance}
        width={300}
        muted={muted}
        video={SAMPLE.video}
        style={styles.video.vimeo}
      />
      <div {...styles.video.icons}>
        <div>{muted && <Icons.Muted size={36} />}</div>
      </div>
    </div>
  );

  const elImage = (
    <div {...styles.image.base}>
      <div {...styles.image.inner} />
    </div>
  );

  const elProgressBar = (
    <ProgressBar
      percent={percent}
      style={{
        Absolute: [null, 50, 0, 50],
        opacity: isDimmed ? 0 : 1,
        transition: `opacity 300ms`,
      }}
    />
  );
  const elTooSmall = isTooSmall && <TooSmall backgroundColor={0.3} backdropBlur={22} />;

  return (
    <div {...css(styles.base, props.style)} ref={size.ref}>
      <div {...styles.body}>
        {elImage}
        {elVimeo}
        {elProgressBar}
        {elTooSmall}
      </div>
    </div>
  );
};
