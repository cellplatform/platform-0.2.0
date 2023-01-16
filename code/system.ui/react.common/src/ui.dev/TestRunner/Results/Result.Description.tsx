import { COLORS, css, t } from '../common';

export type DescriptionProps = {
  text: string;
  style?: t.CssValue;
};

export const Description: React.FC<DescriptionProps> = (props) => {
  const desc = parseDescription(props.text);

  /**
   * [Render]
   */
  const styles = {
    base: css({ Flex: 'horizontal-center-start' }),
    todo: css({
      backgroundColor: COLORS.MAGENTA,
      marginRight: 6,
      PaddingX: 5,
      paddingTop: 1,
      paddingBottom: 1,
      fontSize: 10,
      fontWeight: 600,
      color: COLORS.WHITE,
      borderRadius: 3,
    }),
  };

  const elTodo = desc.isTodo && <div {...styles.todo}>TODO</div>;

  return (
    <div {...css(styles.base, props.style)}>
      {elTodo}
      <div>{desc.text}</div>
    </div>
  );
};

/**
 * [Heloers]
 */

function parseDescription(text: string) {
  text = (text || '').trim();
  const isTodo = text.startsWith('TODO:');
  text = text.replace(/^TODO\:/, '').trimStart();
  return { text, isTodo };
}
