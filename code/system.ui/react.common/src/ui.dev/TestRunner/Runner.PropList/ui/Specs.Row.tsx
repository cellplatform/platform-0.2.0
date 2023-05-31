import { useState } from 'react';
import { Button, css, DEFAULTS, Switch, t } from '../common';
import { useSpecImport } from '../hooks/useSpecImport.mjs';
import { Util } from '../Util.mjs';
import { RunIcon } from './Specs.Row.RunIcon';

export type SpecsRowProps = {
  data: t.TestRunnerPropListData;
  import: t.SpecImport;
  style?: t.CssValue;
  onSelectionChange?: t.SpecsSelectionHandler;
  onRunClick?: t.SpecRunClickHandler;
};

export const SpecsRow: React.FC<SpecsRowProps> = (props) => {
  const spec = useSpecImport(props.data, props.import);
  const ellipsis = Wrangle.ellipsis(props);
  const isRunning = Wrangle.isRunning(props, spec.hash);

  const [isOver, setOver] = useState(false);

  /**
   * Handlers
   */
  const handleSwitchClick = (e: React.MouseEvent) => {
    if (spec.suite) {
      props.onSelectionChange?.({
        import: props.import,
        spec: spec.suite,
        from: spec.isSelected,
        to: !spec.isSelected,
        modifiers: Util.modifiers(e),
      });
    }
  };

  const handleTestRunClick = (e: React.MouseEvent) => {
    if (spec.suite) {
      props.onRunClick?.({
        spec: spec.suite,
        modifiers: Util.modifiers(e),
      });
    }
  };

  /**
   * [Render]
   */
  const styles = {
    base: css({
      flex: 1,
      display: 'grid',
      gridTemplateColumns: '1fr auto',
      columnGap: 5,
    }),
    left: css({
      display: 'grid',
      gridTemplateColumns: 'auto 1fr',
      columnGap: 8,
    }),
    right: css({
      paddingTop: 2,
      display: 'grid',
      justifyContent: 'center',
      alignContent: 'top',
    }),
    description: css({
      paddingTop: 1,
    }),
    ellipsis: css({
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    }),
  };

  return (
    <div {...css(styles.base, props.style)}>
      <Button onClick={handleTestRunClick} onMouse={(e) => setOver(e.isOver)}>
        <div {...styles.left}>
          <RunIcon isSelected={spec.isSelected} isOver={isOver} isRunning={isRunning} />
          <div {...css(styles.description, ellipsis ? styles.ellipsis : false)}>
            {spec.description}
          </div>
        </div>
      </Button>
      <div {...styles.right} onClick={handleSwitchClick}>
        <Switch height={12} value={spec.isSelected} />
      </div>
    </div>
  );
};

/**
 * Helpers
 */
const Wrangle = {
  ellipsis(props: SpecsRowProps) {
    const ellipsis = props.data.specs?.ellipsis ?? DEFAULTS.ellipsis;
    return typeof ellipsis === 'function' ? ellipsis() : ellipsis;
  },

  results(props: SpecsRowProps, hash: string) {
    const results = props.data.specs?.results;
    return results ? results[hash] : false;
  },

  isRunning(props: SpecsRowProps, hash: string) {
    return Wrangle.results(props, hash) === true;
  },
};
