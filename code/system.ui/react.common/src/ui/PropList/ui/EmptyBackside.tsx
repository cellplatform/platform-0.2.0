import { css, type t } from '../common';

export type EmptyBacksideProps = {
  message?: string;
  style?: t.CssValue;
};

export const EmptyBackside: React.FC<EmptyBacksideProps> = (props) => {
  const { message = 'Nothing to display.' } = props;

  const styles = {
    base: css({
      boxSizing: 'border-box',
      padding: 10,
      fontSize: 14,
      fontStyle: 'italic',
      opacity: 0.3,
      textAlign: 'center',
    }),
  };

  return (
    <div {...css(styles.base, props.style)}>
      <div>{message}</div>
    </div>
  );
};
