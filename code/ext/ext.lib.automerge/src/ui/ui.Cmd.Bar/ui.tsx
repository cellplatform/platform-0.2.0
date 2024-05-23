import type { t } from './common';

import { CmdBar } from 'sys.ui.react.common';
import { useController } from './use.Controller';

export const View: React.FC<t.CmdBarProps> = (props) => {
  const { enabled, doc, path, debug, focusOnReady } = props;
  const controller = useController({ enabled, doc, path, debug, focusOnReady });
  return (
    <CmdBar
      text={controller.text}
      enabled={controller.is.enabled}
      theme={props.theme}
      style={props.style}
      onReady={(e) => controller.onReady(e.ref)}
      onChange={(e) => controller.onChange(e.to)}
    />
  );
};
