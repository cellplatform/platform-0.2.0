import { useEffect, useState } from 'react';
import { type FallbackProps } from 'react-error-boundary';
import { Button, COLORS, Icons, css, type t } from './common';

export type ErrorFallbackProps = FallbackProps & {
  style?: t.CssValue;
  onError?: t.ModuleLoaderErrorHandler;
};

export const ErrorFallback: React.FC<ErrorFallbackProps> = (props) => {
  const { error, resetErrorBoundary } = props;
  const [closeable, setCloseable] = useState(!props.onError);

  /**
   * Lifecycle
   */
  useEffect(() => {
    if (props.onError) {
      const closeable = () => setCloseable(true);
      const clear = resetErrorBoundary;
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
    pre: css({ fontSize: 10, userSelect: 'text' }),
    message: css({}),
    stack: css({ opacity: 0.6 }),
    close: css({ Absolute: [5, 5, null, null] }),
  };

  const elError = (
    <pre {...styles.pre}>
      <div {...styles.message}>{error?.message ?? 'No Message'}</div>
      <div {...styles.stack}>{error?.stack ?? 'No Stack'}</div>
    </pre>
  );

  const elClose = closeable && (
    <Button style={styles.close} onClick={resetErrorBoundary}>
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
