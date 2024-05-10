import type { FallbackProps } from 'react-error-boundary';

import { useEffect, useState } from 'react';
import { Button, COLORS, Color, Icons, css, type t } from './common';

export type ErrorFallbackProps = FallbackProps & {
  style?: t.CssValue;
  onError?: t.ModuleLoaderErrorHandler;
  onErrorCleared?: t.ModuleLoaderErrorClearedHandler;
};

export const ErrorFallback: React.FC<ErrorFallbackProps> = (props) => {
  const { error } = props;
  const [closeable, setCloseable] = useState(!props.onError);

  /**
   * Handlers
   */
  const clear = () => {
    props.resetErrorBoundary();
    props.onErrorCleared?.({ error });
  };

  /**
   * Lifecycle
   */
  useEffect(() => {
    if (props.onError) {
      const closeable = () => setCloseable(true);
      props.onError({ error, clear, closeable });
    }
  }, []);

  /**
   * Render
   */
  const color = COLORS.WHITE;
  const styles = {
    base: css({
      position: 'relative',
      color,
      backgroundColor: COLORS.MAGENTA,
      overflow: 'hidden',
      display: 'grid',
      placeItems: 'center',
    }),
    body: css({ position: 'relative', minWidth: 400, MarginX: 50 }),
    pre: css({
      position: 'relative',
      fontSize: 10,
      userSelect: 'text',
    }),
    traceline: css({
      Absolute: [-20, null, null, 0],
      width: 0.5,
      height: 100,
      backgroundColor: Color.alpha(COLORS.WHITE, 0.2),
    }),
    message: css({ marginBottom: 5 }),
    stack: css({ opacity: 0.6 }),
    close: css({ Absolute: [5, 5, null, null] }),
  };

  const elError = (
    <pre {...styles.pre}>
      <div {...styles.traceline} />
      <div {...styles.message}>{error?.message ?? 'No Message'}</div>
      <div {...styles.stack}>{error?.stack ?? 'No Stack'}</div>
    </pre>
  );

  const elClose = closeable && (
    <Button style={styles.close} onClick={clear}>
      <Icons.Close color={color} />
    </Button>
  );

  return (
    <div {...css(styles.base, props.style)}>
      <div {...styles.body}>{elError}</div>
      {elClose}
    </div>
  );
};
