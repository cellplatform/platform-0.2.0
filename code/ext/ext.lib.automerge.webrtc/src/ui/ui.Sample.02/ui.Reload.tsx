import { Button, Icons, css, type t } from './common';

export type ReloadProps = {
  style?: t.CssValue;
};

export const Reload: React.FC<ReloadProps> = (props) => {
  const reload = () => location.reload();

  const styles = {
    base: css({ display: 'grid', placeItems: 'center' }),
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
