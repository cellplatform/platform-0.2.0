import { useEffect, useState } from 'react';
import { Color, css, PageStack, rx, type t } from './common';

export type HistoryStackProps = {
  doc?: t.Doc;
  theme?: t.CommonTheme;
  style?: t.CssValue;
  onClick?: React.MouseEventHandler;
};

export const HistoryStack: React.FC<HistoryStackProps> = (props) => {
  const { doc } = props;
  const [page, setPage] = useState(0);

  /**
   * Effects
   */
  useEffect(() => {
    const events = doc?.events();
    const $ = events?.changed$.pipe(rx.debounceTime(100));
    $?.subscribe(() => setPage((n) => n + 1));
    return events?.dispose;
  }, [doc?.instance]);

  /**
   * Render
   */
  const theme = Color.theme(props.theme);
  const styles = {
    base: css({ opacity: 0.3 }),
  };

  return (
    <PageStack
      current={page}
      style={css(styles.base, props.style)}
      theme={theme.name}
      onClick={props.onClick}
    />
  );
};
