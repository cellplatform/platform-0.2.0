import React from 'react';

import iconLogoUrl from '../../assets/favicon.png?url';
import { COLORS, css, FC, t } from '../../common/index.mjs';
import { Sample } from '../../main/Sample.mjs';

export type AppBodyProps = { style?: t.CssValue };

export const AppBody: React.FC<AppBodyProps> = (props) => {
  /**
   * Handlers
   */
  const onSampleFilesystemClick = async () => {
    await Sample.fs();
  };

  const onSampleDeploy = async () => {
    // await Sample.tmpDeploy();
    await Sample.tmp();
  };

  /**
   * [Render]
   */
  const styles = {
    base: css({
      Absolute: 0,
      color: COLORS.DARK,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      userSelect: 'none',
    }),
    logoCellIcon: css({
      width: 189,
      height: 189,
      pointerEvents: 'none',
      marginBottom: 50,
    }),
    logoCellFlat: css({
      position: 'absolute',
      top: 20,
      right: 25,
      width: 50,
      height: 50,
      pointerEvents: 'none',
      opacity: 0.2,
    }),
    titleCell: css({
      position: 'absolute',
      bottom: 20,
      left: 25,
      fontSize: 50,
      fontWeight: 'bold',
      letterSpacing: '-0.03em',
      pointerEvents: 'none',
    }),
    titleRuntime: css({
      position: 'absolute',
      bottom: 20,
      right: 25,
      fontSize: 22,
    }),
    divider: css({
      position: 'absolute',
      left: 20,
      right: 20,
      bottom: 90,
      height: 10,
      backgroundColor: COLORS.DARK,
      opacity: 0.0,
    }),
    tmp: css({
      Absolute: [20, null, null, 20],
      lineHeight: 1.6,
    }),
    btn: css({
      cursor: 'pointer',
      ':hover': { color: COLORS.BLUE },
    }),
  };

  return (
    <div {...css(styles.base, props.style)} data-tauri-drag-region>
      <img src={iconLogoUrl} {...styles.logoCellIcon} />
      <div {...styles.divider} />
      <div {...styles.titleCell}>cell</div>
      <div {...styles.titleRuntime}>
        <span style={{ opacity: 0.2 }}>system.</span>runtime
      </div>
      <div {...styles.tmp}>
        <div {...styles.btn} onClick={onSampleFilesystemClick}>
          {'run: filesystem sample'}
        </div>
        <div {...styles.btn} onClick={onSampleDeploy}>
          {'run: deploy sample'}
        </div>
      </div>
    </div>
  );
};
