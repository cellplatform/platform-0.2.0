import { domAnimation, LazyMotion } from 'framer-motion';
import { css, type t } from './common';
import { Background } from './ui.Background';
import { Dialog } from './ui.Dialog';
import { Paused } from './ui.Paused';
import { Recording } from './ui.Recording';

export type RecordButtonProps = {
  bus: t.EventBus<any>;
  stream?: MediaStream;
  size?: 45;
  state?: t.RecordButtonState;
  isEnabled?: boolean;
  style?: t.CssValue;
  dialog?: t.RecordButtonDialog;
  onClick?: t.RecordButtonClickEventHandler;
};

export const RecordButton: React.FC<RecordButtonProps> = (props) => {
  const { stream } = props;
  const state = props.state ?? 'default';
  const current = state;
  const size = props.size ?? 45;
  const isEnabled = props.isEnabled ?? true;

  let height = size as number;
  let width = height;
  const borderRadius = {
    root: size / 2,
    inner: size / 2 - 5,
  };

  if (isEnabled) {
    if (['recording', 'paused', 'dialog'].includes(state)) width = size * 4;
    if (['dialog'].includes(state)) height = height * 5;
  }

  const styles = {
    base: css({
      position: 'relative',
      cursor: 'default',
      userSelect: 'none',
      fontSize: 14,
    }),
  };

  const fireClick = (action?: t.RecordButtonAction) => {
    if (isEnabled) props.onClick?.({ current, action });
  };
  const handleClick = (state: t.RecordButtonState[], action?: t.RecordButtonAction) => {
    if (state.includes(current)) fireClick(action);
  };

  return (
    <div {...css(styles.base, props.style)} onClick={() => handleClick(['default', 'recording'])}>
      <LazyMotion features={domAnimation}>
        <Background
          isEnabled={isEnabled}
          state={state}
          width={width}
          height={height}
          borderRadius={borderRadius}
        />

        <Recording
          stream={stream}
          state={state}
          style={{ Absolute: 6 }}
          width={width - 12}
          isEnabled={isEnabled}
          onClick={() => handleClick(['recording'])}
        />

        <Paused
          state={state}
          isEnabled={isEnabled}
          style={{ Absolute: 6 }}
          width={width - 12}
          height={size - 12}
          onClick={(e) => handleClick(['paused'], e.action)}
        />

        <Dialog
          isEnabled={isEnabled}
          state={state}
          style={{ Absolute: 6 }}
          borderRadius={borderRadius.inner}
          data={props.dialog}
        />
      </LazyMotion>
    </div>
  );
};
