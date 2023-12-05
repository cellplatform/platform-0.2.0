import { Button, Icons, css, type t } from './common';

export type RestartProps = {
  style?: t.CssValue;
};

export const Restart: React.FC<RestartProps> = (props) => {
  const reload = () => location.reload();

  const styles = {
    base: css({ display: 'grid', placeItems: 'center', padding: 80 }),
    body: css({ display: 'grid', placeItems: 'center', gridTemplateRows: 'auto auto' }),
  };

  return (
    <div {...css(styles.base, props.style)}>
      <Button onClick={reload}>
        <div {...styles.body}>
          <Icons.Refresh size={48} />
          <div>{'reload required'}</div>
        </div>
      </Button>
    </div>
  );
};
