import { useEffect, useRef, useState } from 'react';
import { DEFAULTS, Color, COLORS, css, t, rx, FC } from '../../common';
import { DocError } from '../Doc.Error';

export type DocImageProps = {
  node: t.MdastImage;
  def?: t.DocImageDef;
  style?: t.CssValue;
};

export const DocImage: React.FC<DocImageProps> = (props) => {
  const { node, def } = props;
  const src = node.url;

  const [loaded, setLoaded] = useState(false);
  const [loadError, setLoadError] = useState('');

  const width = def?.width;
  const border = def?.border;
  const margin = def?.margin;
  const title = Wrangle.title(def);

  /**
   * [Render]
   */
  const styles = {
    base: css({
      position: 'relative',
      maxWidth: DEFAULTS.MD.DOC.width,
      marginTop: margin?.top,
      marginBottom: margin?.bottom,
    }),
    image: {
      base: css({
        Flex: getAlignmentFlex(def?.align),
        visibility: loaded ? 'visible' : 'hidden',
      }),
      img: css({
        width,
        maxWidth: DEFAULTS.MD.DOC.width,
        boxSizing: 'border-box',
        border:
          typeof border !== 'number' ? undefined : `solid 1px ${Color.alpha(COLORS.DARK, 0.1)}`,
      }),
    },
    title: {
      base: css({
        Flex: getAlignmentFlex(title?.align),
        marginTop: 15,
        fontSize: 13,
        opacity: 0.5,
      }),
    },
  };

  const elTitle = title && <div {...styles.title.base}>{title.text}</div>;

  const elError = loadError && <DocError message={loadError} />;

  const elImage = !loadError && (
    <img
      {...styles.image.img}
      src={src}
      alt={node.alt || undefined}
      onLoad={(e) => setLoaded(true)}
      onError={(e) => {
        setLoaded(true);
        setLoadError(`Failed to load image at location: \`${src}\``);
      }}
    />
  );

  return (
    <div {...css(styles.base, props.style)} className={DEFAULTS.MD.CLASS.BLOCK}>
      <div {...styles.image.base}>{elImage}</div>

      {elError}
      {elTitle}
    </div>
  );
};

/**
 * Helpers
 */

const getAlignmentFlex = (align?: t.DocImageAlign) => {
  if (align === 'Center') return 'x-center-center';
  if (align === 'Right') return 'x-center-end';
  return;
};

/**
 * Helpers
 */
const Wrangle = {
  title(def?: t.DocImageDef): t.DocImageTitle | undefined {
    if (!def) return undefined;
    if (!def.title) return undefined;
    if (typeof def.title === 'string') return { text: def.title, align: 'Center' };

    const { text = 'Untitled', align = 'Center' } = def.title;
    return { text, align };
  },
};
