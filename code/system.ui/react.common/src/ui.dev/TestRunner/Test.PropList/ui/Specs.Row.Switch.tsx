import { Switch as BaseSwitch, css, type t } from '../common';

export type RowSwitchProps = {
  isSelected?: boolean;
  indent?: number;
  style?: t.CssValue;
  onClick?: React.MouseEventHandler;
};

export const Switch: React.FC<RowSwitchProps> = (props) => {
  const { isSelected } = props;

  /**
   * [Render]
   */
  const styles = {
    base: css({
      paddingTop: 2,
      marginLeft: props.indent,
      display: 'grid',
      justifyContent: 'center',
      alignContent: 'top',
    }),
  };

  return (
    <div {...css(styles.base, props.style)}>
      <BaseSwitch height={12} value={isSelected} onClick={props.onClick} />
    </div>
  );
};
