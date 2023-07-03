import { useRef } from 'react';
import type { HTMLAttributeReferrerPolicy } from 'react';

import { css, FC, type t } from '../common';
import { DEFAULTS } from './const.mjs';

type HttpPermissionsPolicy = string; // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Permissions-Policy
type UrlString = string;
type Src = { html?: string; url?: UrlString };

export type IFrameLoadedEventHandler = (e: IFrameLoadedEventHandlerArgs) => void;
export type IFrameLoadedEventHandlerArgs = {
  href: string;
};

export type IFrameProps = {
  src?: UrlString | Src;
  width?: string | number;
  height?: string | number;
  title?: string;
  name?: string;
  sandbox?: true | t.IFrameSandbox[];
  allow?: HttpPermissionsPolicy;
  allowFullScreen?: boolean;
  referrerPolicy?: HTMLAttributeReferrerPolicy | undefined;
  loading?: t.IFrameLoading;
  style?: t.CssValue;
  onLoad?: IFrameLoadedEventHandler;
};

const View: React.FC<IFrameProps> = (props) => {
  const { width, height, loading = 'eager' } = props;
  const content = Wrangle.content(props);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  /**
   * [Handlers]
   */
  const handleLoad = () => {
    let href = content.src ?? '';
    try {
      href = iframeRef.current?.contentWindow?.location.href ?? href;
    } catch (error) {
      // [Ignore]: This will be a cross-origin block.
      //           Fire the best guess at what the URL is.
    }
    props.onLoad?.({ href });
  };

  /**
   * [Render]
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
          ref={iframeRef}
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

/**
 * [Helpers]
 */
const Wrangle = {
  sandbox(props: IFrameProps) {
    const { sandbox = DEFAULTS.sandbox } = props;
    return Array.isArray(sandbox) ? sandbox.join(' ') : undefined; // NB: <undefined> === all restrictions applied.
  },

  content(props: IFrameProps): { src?: string; html?: string } {
    if (!props.src) return { src: undefined, html: undefined };
    if (typeof props.src === 'string') return { src: props.src };
    return { src: props.src.url, html: props.src.html };
  },
};

/**
 * Export
 */

type Fields = {
  DEFAULTS: typeof DEFAULTS;
};
export const IFrame = FC.decorate<IFrameProps, Fields>(
  View,
  { DEFAULTS },
  { displayName: 'IFrame' },
);
