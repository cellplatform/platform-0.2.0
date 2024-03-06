import { Icons, css, type t } from './common';

export type ErrorProps = {
  data: t.InfoError;
  style?: t.CssValue;
};

export const Error: React.FC<ErrorProps> = (props) => {
  const { data } = props;
  const tooltip = `${data.status || ''} ${data.message}`.trim();

  const styles = {
    base: css({
      display: 'grid',
      gridTemplateColumns: 'auto auto',
    }),
  };

  return (
    <div {...css(styles.base, props.style)} title={tooltip}>
      <Icons.Error size={14} />
    </div>
  );
};
