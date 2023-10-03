import { RenderCount } from '../../RenderCount';
import { css, type t } from '../common';

import { LabelItemStateful } from '..';

export type SampleListProps = {
  elements?: JSX.Element[];
  useBehaviors?: t.LabelItemBehaviorKind[];
  list?: t.LabelItemListState;
  style?: t.CssValue;
};

export const SampleList: React.FC<SampleListProps> = (props) => {
  const { useBehaviors, list } = props;
  const controller = LabelItemStateful.useListController({ useBehaviors, list });

  /**
   * [Render]
   */
  const styles = {
    base: css({ position: 'relative' }),
  };

  return (
    <div {...css(styles.base, props.style)}>
      <RenderCount absolute={[-18, 0, null, null]} />
      <div>{props.elements}</div>
    </div>
  );
};
