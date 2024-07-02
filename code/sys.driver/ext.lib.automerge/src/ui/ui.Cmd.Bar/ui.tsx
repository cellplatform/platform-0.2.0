import { useRef } from 'react';
import { BaseComponent, slug, type t } from './common';
import { useController } from './use.Controller';

export const View: React.FC<t.CmdBarProps> = (props) => {
  const { enabled, ctrl, doc, paths, debug, focusOnReady } = props;

  const instance = useRef(props.instance ?? slug()).current;
  const handlers = wrangle.handlers(props);
  const controller = useController({
    instance,
    enabled,
    ctrl,
    doc,
    paths,
    debug,
    focusOnReady,
    handlers,
  });

  return (
    <BaseComponent
      ctrl={ctrl}
      text={controller.text}
      enabled={controller.is.enabled}
      theme={props.theme}
      style={props.style}
      onReady={(e) => controller.onReady(e.ref)}
      onChange={(e) => controller.onChange(e.to)}
      onSelect={(e) => props.onSelect?.(e)}
    />
  );
};

/**
 * Helpers
 */
const wrangle = {
  handlers(props: t.CmdBarProps): t.CmdBarHandlers {
    const { onText, onCommand, onInvoke, onReady } = props;
    return { onText, onCommand, onInvoke, onReady };
  },
} as const;
