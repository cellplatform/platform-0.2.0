import { css, DEFAULTS, FC, Spinner, t } from '../common';
import { useGlobalStyles } from '../Markdown.GlobalStyles';
import { MarkdownParsedHandler, useBlockRenderer } from './useBlockRenderer.mjs';

export type MarkdownDocProps = {
  instance: t.Instance;
  markdown?: string;
  renderer?: t.MarkdownDocBlockRenderer;
  isLoading?: boolean;
  className?: string;
  style?: t.CssValue;
  paddingBottom?: number;
  width?: number;
  onParsed?: MarkdownParsedHandler;
};

const CLASS = DEFAULTS.MD.CLASS;

const View: React.FC<MarkdownDocProps> = (props) => {
  const { instance, markdown, renderer, onParsed, isLoading } = props;
  const { safeBlocks } = useBlockRenderer({ instance, markdown, renderer, onParsed });
  const globalStyles = useGlobalStyles();

  /**
   * [Render]
   */
  const styles = {
    base: css({
      position: 'relative',
      overflow: 'hidden',
      color: globalStyles.DocStyles.p.color,
      width: props.width,
    }),

    body: css({ position: 'relative' }),

    blocks: css({
      userSelect: 'text',
      opacity: isLoading ? 0.1 : 1,
      transition: `300ms`,
    }),

    element: {
      htmlBlock: css({}),
      jsxBlock: css({}),
    },

    spinner: css({
      Absolute: [38, 0, null, 0],
      display: 'grid',
      placeItems: 'center',
    }),

    footerSpacer: css({ height: props.paddingBottom }),
  };

  const elSpinner = isLoading && (
    <div {...styles.spinner}>
      <Spinner.Puff />
    </div>
  );

  const elHtml = (
    <div {...styles.blocks}>
      {safeBlocks.map((safeHtmlOrElement, i) => {
        if (typeof safeHtmlOrElement === 'string') {
          return (
            <div
              key={i}
              dangerouslySetInnerHTML={{ __html: safeHtmlOrElement }}
              className={CLASS.BLOCK}
              {...styles.element.htmlBlock}
            />
          );
        }

        if (typeof safeHtmlOrElement === 'object')
          return (
            <div key={i} {...styles.element.jsxBlock} className={CLASS.BLOCK}>
              {safeHtmlOrElement}
            </div>
          );

        return null;
      })}
    </div>
  );

  const elBody = (
    <div {...styles.body}>
      {elHtml}
      {props.paddingBottom && <div {...styles.footerSpacer} />}
    </div>
  );

  const className = `${CLASS.ROOT} ${props.className ?? ''}`.trim();
  return (
    <div {...css(styles.base, props.style)} className={className}>
      {elBody}
      {elSpinner}
    </div>
  );
};

/**
 * Export
 */

type Fields = {};

export const MarkdownDoc = FC.decorate<MarkdownDocProps, Fields>(
  View,
  {},
  { displayName: 'MarkdownDoc' },
);
