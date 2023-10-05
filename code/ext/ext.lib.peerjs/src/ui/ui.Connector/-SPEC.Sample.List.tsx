import { LabelItem, css, type t } from './common';

export type SampleListProps = {
  elements?: JSX.Element[];
  list?: t.LabelItemListState;
  items?: t.LabelItemState[];
  style?: t.CssValue;
};

export const SampleList: React.FC<SampleListProps> = (props) => {
  const { list, items } = props;
  const controller = LabelItem.Stateful.useListController({ list, items });

  /**
   * [Render]
   */
  const styles = {
    base: css({ position: 'relative' }),
  };

  return (
    <div ref={controller.ref} {...css(styles.base, props.style)} tabIndex={0}>
      <div>{props.elements}</div>
    </div>
  );
};
