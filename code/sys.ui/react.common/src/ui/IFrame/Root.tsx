import { useRef, useEffect } from 'react';
import { css, type t } from './common';
import { Wrangle } from './Wrangle.mjs';

export const IFrame: React.FC<t.IFrameProps> = (props) => {
  const { width, height, loading = 'eager' } = props;
  const content = Wrangle.content(props);
  const ref = useRef<HTMLIFrameElement>(null);

  /**
   * Handlers.
   */
  const handleLoad = () => {
    let href = content.src ?? '';
    try {
      href = ref.current?.contentWindow?.location.href ?? href;
    } catch (error) {
      // [Ignore]: This will be a cross-origin block.
      //           Fire the best guess at what the URL is.
    }
    props.onLoad?.({ ref, href });
  };

  /**
   * Lifecycle
   */
  useEffect(() => props.onReady?.({ ref }), []);

  /**
   * Render
   */
  const styles = {
    base: css({ position: 'relative', width, height }),
    iframe: css({
      Absolute: 0,
      width: width ?? '100%',
      height: height ?? '100%',
      border: 'none',
    }),
  };

  return (
    <div {...css(styles.base, props.style)}>
      {props.src && (
        <iframe
          {...styles.iframe}
          ref={ref}
          src={content.src}
          srcDoc={content.html}
          title={props.title}
          name={props.name}
          allow={props.allow}
          allowFullScreen={props.allowFullScreen}
          referrerPolicy={props.referrerPolicy}
          loading={loading}
          sandbox={Wrangle.sandbox(props)}
          onLoad={handleLoad}
        />
      )}
    </div>
  );
};
