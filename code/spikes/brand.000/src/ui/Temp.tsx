import { COLORS, css, t } from '../common';

export type TempProps = {
  style?: t.CssValue;
};

export const Temp: React.FC<TempProps> = (props) => {
  /**
   * [Render]
   */
  const styles = {
    base: css({
      backgroundColor: COLORS.WHITE,
      Absolute: 0,
      display: 'grid',
      placeItems: 'center',
    }),
    img: css({
      width: '50%',
      borderRadius: 20,
    }),
  };

  const URL =
    'https://user-images.githubusercontent.com/185555/220750207-446214da-4210-413e-b925-a843640bebf6.png';

  return (
    <div {...css(styles.base, props.style)}>
      <img src={URL} alt={'sys.education (system)'} {...styles.img} />
    </div>
  );
};
