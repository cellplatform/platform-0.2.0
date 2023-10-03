import { useEffect, useRef, useState } from 'react';
import { Color, COLORS, css, DEFAULTS, FC, rx, type t } from '../common';

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
    base: css({
      backgroundColor: 'rgba(255, 0, 0, 0.1)' /* RED */,
    }),
  };

  return <div {...css(styles.base, props.style)}>{props.elements}</div>;
};
