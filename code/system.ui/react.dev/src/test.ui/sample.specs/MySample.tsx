import { css, t } from '../common';

export type MySampleProps = {
  text?: string;
  state?: t.Json;
  style?: t.CssValue;
  onClick?: () => void;
};

let _count = 0;

export const MySample: React.FC<MySampleProps> = (props) => {
  const styles = {
    base: css({
      backgroundColor: 'rgba(255, 0, 0, 0.1)' /* RED */,
      position: 'relative',
      padding: [5, 8],
      fontFamily: 'sans-serif',
    }),
    render: css({
      Absolute: [4, 5, null, null],
      fontSize: 11,
      opacity: 0.6,
    }),
  };

  _count++;
  const elRender = <div {...styles.render}>render-{_count}</div>;

  return (
    <div {...css(styles.base, props.style)} onClick={props.onClick}>
      <div>{props.text ?? 'MySample'} 🐷</div>
      <div>
        <pre>state: {props.state ? JSON.stringify(props.state) : 'undefined'} </pre>
      </div>
      <div>
        <a href={'?dev'}>?dev</a>
      </div>
      {elRender}
    </div>
  );
};
