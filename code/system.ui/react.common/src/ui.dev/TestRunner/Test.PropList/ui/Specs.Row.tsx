import { css, type t } from '../common';
import { Util } from '../Util.mjs';
import { Body } from './Specs.Row.Body';
import { Title } from './Specs.Row.Title';
import { Switch } from './Specs.Row.Switch';

export type SpecsRowProps = {
  data: t.TestPropListData;
  suite: t.TestSuiteModel;
  title: string;
  indent?: number;
  style?: t.CssValue;
  onSelectionChange?: t.SpecsSelectionHandler;
  onRunClick?: t.SpecRunClickHandler;
};

export const SpecsRow: React.FC<SpecsRowProps> = (props) => {
  const { data, suite, title } = props;
  const isSelected = Util.isSelected(data, suite);

  /**
   * Handlers
   */
  const handleSwitchClick = (e: React.MouseEvent) => {
    props.onSelectionChange?.({
      suite,
      from: isSelected,
      to: !isSelected,
      modifiers: Util.modifiers(e),
    });
  };

  const handleBodyClick = (e: React.MouseEvent) => {
    props.onRunClick?.({
      suite,
      modifiers: Util.modifiers(e),
    });
  };

  /**
   * [Render]
   */
  const styles = {
    base: css({ flex: 1 }),
    body: css({ display: 'grid', gridTemplateColumns: 'auto 1fr', columnGap: 10 }),
  };

  const elSwitch = (
    <Switch isSelected={isSelected} indent={props.indent} onClick={handleSwitchClick} />
  );

  const elTitle = title && <Title text={title} />;

  const elBody = (
    <Body data={props.data} suite={suite} isSelected={isSelected} onClick={handleBodyClick} />
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
