import { COLORS, css, type t, useSizeObserver } from './common';

import { Body } from './ui.Body';
import { Empty } from './ui.Empty';
import { Index } from './ui.Index';

export const View: React.FC<t.RootProps> = (props) => {
  const { slugs = [], selected, vimeo } = props;
  const isEmpty = slugs.length === 0;
  let warning = !vimeo ? '⚠️ Vimeo instance not specified.' : undefined;

  const resize = useSizeObserver();
  const tooSmall = resize.ready && Wrangle.tooSmall(resize.rect);
  if (!warning && tooSmall) warning = 'Window is too small.';

  /**
   * [Render]
   */
  const styles = {
    base: css({
      Absolute: 0,
      display: 'grid',
      color: COLORS.DARK,
    }),
    body: css({
      position: 'relative',
      display: 'grid',
      gridTemplateColumns: 'auto 1fr',
    }),
  };

  const elEmpty = (isEmpty || warning) && <Empty text={warning} />;
  const elBody = !elEmpty && (
    <div {...styles.body}>
      <Index slugs={slugs} selected={selected} onSelect={props.onSelect} />
      <Body slugs={slugs} selected={selected} vimeo={vimeo} onPlayComplete={props.onPlayComplete} />
    </div>
  );

  const elMain = resize.ready && (
    <>
      {elEmpty}
      {elBody}
    </>
  );

  return (
    <div ref={resize.ref} {...css(styles.base, props.style)}>
      {elMain}
    </div>
  );
};

/**
 * Helpers
 */
const Wrangle = {
  tooSmall(rect: t.DomRect) {
    if (rect.width < 600) return true;
    if (rect.height < 550) return true;
    return false;
  },
} as const;
