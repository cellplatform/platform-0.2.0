import { CmdHost } from 'sys.ui.react.common';
import { DEFAULTS, type t } from './common';
import { useController } from './use.Controller';

export const View: React.FC<t.NetworkCmdHost> = (props) => {
  const { theme, doc, path = DEFAULTS.paths, enabled = true, imports, debug } = props;
  const controller = useController({ enabled, doc, path, imports, debug });

  /**
   * Render
   */
  return (
    <CmdHost.Stateful
      style={props.style}
      theme={theme}
      enabled={enabled}
      pkg={props.pkg}
      imports={imports}
      command={controller.cmd}
      selectedIndex={controller.selected.index}
      mutateUrl={false}
      autoGrabFocus={false}
      listMinWidth={300}
      focusOnClick={true}
      onReady={(e) => controller.onTextboxReady(e.textbox)}
      onItemSelect={(e) => controller.onSelectionChange(e.address)}
      onItemClick={(e) => controller.load(e.address)}
    />
  );
};
