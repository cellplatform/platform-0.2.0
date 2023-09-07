import { useState } from 'react';
import { COLORS, DEFAULTS, css, type t } from './common';
import { View as Button } from './ui.Button';

type Content = JSX.Element | string | number | false;

/**
 * A Button that supports clipboard copying.
 */
export const CopyButton: React.FC<t.CopyButtonProps> = (props) => {
  const { onCopy, onClick } = props;
  const properties = { ...props };
  delete properties.onCopy;

  const [timer, setTimer] = useState<NodeJS.Timeout | undefined>();
  const [copiedContent, setCopiedContent] = useState<Content>();

  /**
   * Handlers
   */
  const startTimer = (delay: t.Milliseconds) => {
    if (timer) clearTimeout(timer);
    const onTimeout = () => {
      setTimer(undefined);
      setCopiedContent(undefined);
    };
    setTimer(setTimeout(onTimeout, delay));
  };

  const handleClick: React.MouseEventHandler = (e) => {
    onClick?.(e);
    if (onCopy) {
      let delay: number = DEFAULTS.copy.delay;
      let content: Content = <div {...styles.copied}>{DEFAULTS.copy.message}</div>;
      onCopy?.({
        delay: (msecs) => (delay = Math.max(0, msecs)),
        message: (input) => (content = input),
        async write(value) {
          if (value === undefined) return;
          await navigator.clipboard.writeText(String(value));
        },
      });
      setCopiedContent(content);
      startTimer(delay);
    }
  };

  /**
   * [Render]
   */
  const styles = {
    copied: css({
      color: COLORS.DARK,
      fontSize: 13,
    }),
  };

  const elOverlay = timer && copiedContent && <div>{copiedContent}</div>;
  return <Button {...properties} onClick={handleClick} overlay={elOverlay} />;
};
