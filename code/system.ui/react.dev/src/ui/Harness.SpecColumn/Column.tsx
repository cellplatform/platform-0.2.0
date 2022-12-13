import { useEffect, useState } from 'react';
import { distinctUntilChanged } from 'rxjs/operators';

import { css, DevBus, FC, t } from '../common';
import { SpecColumnMain } from './Column.Main';

export type HarnessSpecColumnProps = {
  instance: t.DevInstance;
  renderArgs?: t.SpecRenderArgs;
  style?: t.CssValue;
};

export const HarnessSpecColumn: React.FC<HarnessSpecColumnProps> = (props) => {
  const { instance, renderArgs } = props;

  const [results, setResults] = useState<t.TestSuiteRunResponse>();

  /**
   * Lifecycle
   */
  useEffect(() => {
    const events = DevBus.Events({ instance });
    events.info.changed$
      .pipe(
        distinctUntilChanged(
          (prev, next) => prev.info.run.results?.tx === next.info.run.results?.tx,
        ),
      )
      .subscribe((e) => {
        setResults(e.info.run.results);
      });

    return () => events.dispose();
  }, [instance.id]);

  /**
   * Handlers
   */
  const tmpPrint = () => {
    // TEMP 🐷
    console.info(`Info (Run Results):`, results);
    console.log('results.tests', results?.tests);
  };

  /**
   * [Render]
   */
  const styles = {
    base: css({
      flex: 1,
      overflow: 'hidden',
      backgroundColor: 'rgba(255, 0, 0, 0.1)' /* RED */,
    }),
    body: css({
      backgroundColor: 'rgba(255, 0, 0, 0.1)' /* RED */,
    }),
  };

  return (
    <div {...css(styles.base, props.style)}>
      <div {...styles.body} onClick={tmpPrint}>
        <SpecColumnMain instance={instance} results={results} renderArgs={renderArgs} />
      </div>
    </div>
  );
};
