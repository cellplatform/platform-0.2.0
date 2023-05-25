import { useEffect, useRef, useState } from 'react';
import { Color, COLORS, css, t, rx, FC, DEFAULTS, FIELDS, PropList } from './common';
import { Item } from './Root.item';

const runner = Item.runner;

/**
 * <PropList> compact test-runner.
 */
export type TestRunnerPropListProps = {
  title?: t.PropListProps['title'];
  width?: t.PropListProps['width'];
  fields?: t.TestRunnerField[];
  data?: t.TestRunnerPropListData;
  margin?: t.CssEdgesInput;
  card?: boolean;
  flipped?: boolean;
  style?: t.CssValue;
};

/**
 * Component
 */
const View: React.FC<TestRunnerPropListProps> = (props) => {
  const { data = {}, fields = DEFAULTS.fields } = props;
  const { pkg } = data;

  const items = PropList.builder<t.TestRunnerField>()
    .field('Module', { label: 'Module', value: pkg?.name ?? '-' })
    .field('Module.Version', { label: 'Version', value: pkg?.version ?? '-' })
    .field('Tests.Run', () => {

      return [];

    })
    .items(fields);

  return (
    <PropList
      title={Wrangle.title(props)}
      items={items}
      width={props.width ?? { min: 230 }}
      defaults={{ clipboard: false }}
      card={props.card}
      flipped={props.flipped}
      padding={props.card ? [20, 25, 20, 25] : undefined}
      margin={props.margin}
      style={props.style}
    />
  );
};

/**
 * Helpers
 */

const Wrangle = {
  title(props: TestRunnerPropListProps) {
    const title = PropList.Wrangle.title(props.title);
    if (!title.margin && props.card) title.margin = [0, 0, 15, 0];
    return title;
  },
};

/**
 * Export
 */
type Fields = {
  FIELDS: typeof FIELDS;
  DEFAULTS: typeof DEFAULTS;
  Item: typeof Item;
  runner: typeof Item.runner;
};

export const TestRunnerPropList = FC.decorate<TestRunnerPropListProps, Fields>(
  View,
  { FIELDS, DEFAULTS, Item, runner },
  { displayName: 'TestRunnerPropList' },
);
