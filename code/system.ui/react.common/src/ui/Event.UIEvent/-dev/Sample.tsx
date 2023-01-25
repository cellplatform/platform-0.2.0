import { useEffect } from 'react';
import { Subject } from 'rxjs';

import { Card } from '../../Card';
import { TextSyntax } from '../../Text.Syntax';

import { UIEventPipeHookArgs, useUIEventPipe } from '..';
import { css, t } from '../common';

export type SampleEventCtx = { index: number; message: string };

export type DevSampleProps = {
  args: UIEventPipeHookArgs<SampleEventCtx, HTMLDivElement>;
  style?: t.CssValue;
};

export const DevSample: React.FC<DevSampleProps> = (props) => {
  const ui = useUIEventPipe<SampleEventCtx, HTMLDivElement>(props.args);

  useEffect(() => {
    const dispose$ = new Subject<void>();
    const events = ui.events({ dispose$ });

    events.$.subscribe((e) => {
      // console.log('inside hook', e);
    });

    return () => dispose$.next();
  }, []); // eslint-disable-line

  /**
   * [Render]
   */
  const styles = {
    base: css({ Flex: 'center-center', width: 300, height: 200 }),
    card: css({ padding: 20 }),
    label: css({ fontFamily: 'monospace', fontWeight: 'bold', fontSize: 16 }),
  };

  const elCard = (
    <div
      ref={ui.ref} // NB: Only required for special reference calculated, eg. [e.containsFocus]
      tabIndex={0}
      onClick={ui.mouse.onClick}
      onMouseEnter={ui.mouse.onMouseEnter}
      onMouseLeave={ui.mouse.onMouseLeave}
      onFocus={ui.focus.onFocus}
      onBlur={ui.focus.onBlur}
    >
      <Card style={styles.card}>
        <TextSyntax text={'<Component>'} style={styles.label} />
      </Card>
    </div>
  );

  return <div {...css(styles.base, props.style)}>{elCard}</div>;
};
