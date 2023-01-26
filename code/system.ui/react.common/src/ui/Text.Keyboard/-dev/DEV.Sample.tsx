import { useEffect } from 'react';

// import { Keyboard } from '..';
import { Color, COLORS, css, Icons, t, rx } from './DEV.common';
import { DevModifierKeys } from './DEV.ModifierKeys';

export type EventCtx = { index: number; message: string };

export type DevSampleProps = {
  // hook: t.KeyboardPipeHookArgs;
  style?: t.CssValue;
};

export const DevSample: React.FC<DevSampleProps> = (props) => {
  // const keyboard = Keyboard.useKeyboardState(props.hook);

  /**
   * NOTE: Test multiple instances of the hook initiated.
   *       Should not duplicate keyboard events.
   */
  // Keyboard.useEventPipe(props.hook);
  // Keyboard.useEventPipe(props.hook);

  useEffect(() => {
    const { dispose$, dispose } = rx.disposable();
    // const events = keyboard.events({ dispose$ });

    //     events.$.subscribe((e) => {
    //       console.log('keyboard (inside hook)', e);
    //     });
    //
    //     // events.down.
    //     events.up.escape((e) => {
    //       console.log('Escape', e);
    //     });

    // events.down.enter((e) => {
    //   console.log('Enter', e);
    // });

    // events.up.enter().$.subscribe((e) => {
    //   console.log('$.Enter(up):', e);
    // });

    // events.down.code('KeyK', (e) => {
    //   console.log('k', e);
    // });

    return () => dispose();
  }, []);

  /**
   * [Render]
   */
  const styles = {
    base: css({ position: 'relative', Flex: 'y-stretch-stretch', boxSizing: 'border-box' }),
    body: {
      base: css({ flex: 1, position: 'relative' }),
      inner: css({ Absolute: 0, Flex: 'center-center', overflow: 'hidden' }),
    },
    footer: css({ Flex: 'x-spaceBetween-center', padding: 10 }),
    icon: css({ Absolute: [0, null, null, 12] }),
    keys: css({ Flex: 'x-center-center' }),
    key: {
      base: css({
        Flex: 'y-center-center',
        position: 'relative',
        color: COLORS.DARK,
        backgroundColor: Color.alpha(COLORS.DARK, 0.04),
        PaddingX: 10,
        padding: 3,
        boxSizing: 'border-box',
        marginRight: 10,
        ':last-child': { margin: 0 },
      }),
      label: css({ fontSize: 50 }),
      code: css({ fontSize: 9, paddingTop: 5 }),
      traceline: css({
        height: 1,
        Absolute: [49, 0, null, 0],
        backgroundColor: Color.alpha(COLORS.MAGENTA, 0.2),
        userSelect: 'none',
      }),
    },
  };

  const elIcon = (
    <Icons.Keyboard.fill size={42} color={Color.alpha(COLORS.DARK, 0.3)} style={styles.icon} />
  );

  const elKeys = (
    <div {...styles.keys}>
      {/* {keyboard.state.current.pressed.map((e, i) => {
        return (
          <div key={`${e.code}.${i}`} {...styles.key.base}>
            <div {...styles.key.label}>{e.key}</div>
            <div {...styles.key.code}>{e.code}</div>
            <div {...styles.key.traceline} />
          </div>
        );
      })} */}
    </div>
  );

  // const last = keyboard.state.last;
  // const elEventProps = last && (
  //   <div {...css({ Absolute: [15, 0 - Keyboard.UI.EventProps.minWidth - 15, null, null] })}>
  //     <Keyboard.UI.EventProps event={last} />
  //   </div>
  // );

  return (
    <div {...css(styles.base, props.style)}>
      <div {...styles.body.base}>
        <div {...styles.body.inner}>
          {elKeys}
          {elIcon}
        </div>
        {/* {elEventProps} */}
      </div>
      <div {...styles.footer}>
        {/* <DevModifierKeys edge={'Left'} state={keyboard.state} />
        <DevModifierKeys edge={'Right'} state={keyboard.state} /> */}
      </div>
    </div>
  );
};
