import { css, t } from '../common';

export type DocErrorProps = {
  title?: string;
  message?: string;
  error?: Error;
  style?: t.CssValue;
};

export const DocError: React.FC<DocErrorProps> = (props) => {
  const { title = 'Error', message } = props;

  /**
   * [Render]
   */
  const styles = {
    base: css({
      backgroundColor: 'rgba(255, 0, 0, 0.1)' /* RED */,
      Padding: [20, 30],
      borderRadius: 3,
      lineHeight: '1.6em',
    }),
    title: css({ fontWeight: 'bold' }),
    message: css({}),
  };
  return (
    <div {...css(styles.base, props.style)}>
      <div {...styles.title}>{title}</div>
      <div {...styles.message}>{message}</div>
    </div>
  );
};
