import { RenderCount } from '../../RenderCount';
import { css, type t } from '../common';

import { LabelItemStateful } from '..';

export type SampleListProps = {
  elements?: JSX.Element[];
  useBehaviors?: t.LabelItemBehaviorKind[];
  list?: t.LabelListState;
  items?: t.LabelItemState[];
  renderCount?: t.RenderCountProps;
  style?: t.CssValue;
};

export const SampleList: React.FC<SampleListProps> = (props) => {
  const { useBehaviors, list, items } = props;
  const controller = LabelItemStateful.useListController({ useBehaviors, list, items });

  /**
   * [Render]
   */
  const styles = {
    base: css({
      position: 'relative',
      outline: 'none',
    }),
  };

  return (
    <div ref={controller.ref} {...css(styles.base, props.style)} tabIndex={0}>
      {props.renderCount && <RenderCount {...props.renderCount} />}
      <div>{props.elements}</div>
    </div>
  );
};
