import { css, type t } from './common';

export type DevLayoutMediaComponentsProps = {
  elements?: JSX.Element[];
  width?: number;
  style?: t.CssValue;
};

export const DevLayoutMediaComponents: React.FC<DevLayoutMediaComponentsProps> = (props) => {
  const { width = 300, elements = [] } = props;

  /**
   * [Render]
   */
  const SPACING = 30;

  const styles = {
    base: css({
      flex: 1,
      pointerEvents: 'auto',
      position: 'relative',
      Flex: 'vertical-stretch-stretch',
      boxSizing: 'border-box',
      padding: 30,
      width,
    }),
    list: {
      item: {
        base: css({
          position: 'relative',
          marginBottom: SPACING,
          ':last-child': { marginBottom: 0 },
        }),
      },
    },
  };

  const elList = elements.map((el, i) => {
    const key = `element.${i}`;
    return (
      <div key={key} {...styles.list.item.base}>
        {el}
      </div>
    );
  });

  return <div {...css(styles.base, props.style)}>{elList}</div>;
};
