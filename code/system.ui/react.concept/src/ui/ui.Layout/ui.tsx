import { COLORS, Empty, css, useRubberband, useSizeObserver, type t } from './common';
import { Body } from './ui.Body';
import { Index } from './ui.Index';

export const View: React.FC<t.LayoutProps> = (props) => {
  const { slugs = [], selected } = props;
  const isEmpty = slugs.length === 0;

  useRubberband(false);
  const resize = useSizeObserver();
  const tooSmall = resize.ready && Wrangle.tooSmall(resize.rect);

  let warning = '';
  if (tooSmall) warning = 'Window is too small.';

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

  const elEmpty = (isEmpty || warning) && <Empty message={warning} />;
  const elBody = !elEmpty && (
    <div {...styles.body}>
      <Index
        slugs={slugs}
        selected={selected}
        focused={props.focused === 'index'}
        onSelect={props.onSelect}
      />
      <Body
        slugs={slugs}
        selected={selected}
        onPlayToggle={props.onPlayToggle}
        onPlayComplete={props.onPlayComplete}
      />
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
