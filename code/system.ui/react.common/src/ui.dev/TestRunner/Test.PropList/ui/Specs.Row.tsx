import { css, type t } from '../common';
import { Util } from '../Util.mjs';

import { Body } from './Specs.Row.Body';
import { Switch } from './Specs.Row.Switch';
import { Title } from './Specs.Row.Title';

export type SpecsRowProps = {
  data: t.TestPropListData;
  suite: t.TestSuiteModel;
  title: string;
  indent?: number;
  enabled?: boolean;
  style?: t.CssValue;
  onSelectionChange?: t.SpecsSelectionHandler;
  onRunClick?: t.SpecRunClickHandler;
};

export const SpecsRow: React.FC<SpecsRowProps> = (props) => {
  const { data, suite, title, enabled = true } = props;
  const isSelected = Util.isSelected(data, suite);
  const isSelectable = Util.isSelectable(data);

  /**
   * Handlers
   */
  const handleSwitchClick = (e: React.MouseEvent) => {
    if (!enabled) return;
    props.onSelectionChange?.({
      suite,
      from: isSelected,
      to: !isSelected,
      modifiers: Util.modifiers(e),
    });
  };

  const handleBodyClick = (e: React.MouseEvent) => {
    if (!enabled) return;
    props.onRunClick?.({
      suite,
      modifiers: Util.modifiers(e),
    });
  };

  /**
   * [Render]
   */
  const styles = {
    base: css({
      position: 'relative',
      flex: 1,
    }),
    body: css({
      display: 'grid',
      paddingLeft: props.indent,
      gridTemplateColumns: isSelectable ? 'auto 1fr' : undefined,
      columnGap: 10,
    }),
  };

  const elSwitch = isSelectable && (
    <Switch
      isSelected={isSelected}
      // indent={props.indent}
      onClick={handleSwitchClick}
      enabled={enabled}
    />
  );

  const elTitle = title && <Title text={title} />;

  const elBody = (
    <Body
      data={props.data}
      suite={suite}
      isSelected={isSelected}
      enabled={enabled}
      onClick={handleBodyClick}
    />
  );

  return (
    <div {...css(styles.base, props.style)}>
      {elTitle}
      <div {...styles.body}>
        {elSwitch}
        {elBody}
      </div>
    </div>
  );
};
