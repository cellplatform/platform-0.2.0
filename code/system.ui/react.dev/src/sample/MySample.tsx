import { css, t } from '../common';

export type MySampleProps = {
  text?: string;
  style?: t.CssValue;
  onClick?: () => void;
};

export const MySample: React.FC<MySampleProps> = (props) => {
  const styles = {
    base: css({
      position: 'relative',
      padding: [5, 8],
    }),
  };

  return (
    <div {...css(styles.base, props.style)} onClick={props.onClick}>
      <div>{props.text ?? 'MyComponent'} 🐷</div>
    </div>
  );
};
