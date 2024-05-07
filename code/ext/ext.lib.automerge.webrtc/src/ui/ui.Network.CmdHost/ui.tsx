import { CmdHost, DEFAULTS, type t } from './common';
import { useController } from './use.Controller';

export const View: React.FC<t.NetworkCmdHost> = (props) => {
  const { theme, doc, path = DEFAULTS.paths, enabled = true, imports, debug, onLoad } = props;
  const controller = useController({ enabled, doc, path, imports, debug, onLoad });

  /**
   * Render
   */
  return (
    <CmdHost.Stateful
      style={props.style}
      theme={theme}
      enabled={enabled}
      badge={props.badge}
      pkg={props.pkg}
      imports={imports}
      filter={controller.filter}
      command={controller.cmd}
      selected={controller.selected.uri}
      hrDepth={props.hrDepth}
      mutateUrl={false}
      showParamDev={false}
      autoGrabFocus={false}
      listMinWidth={300}
      focusOnClick={true}
      onReady={(e) => controller.onTextboxReady(e.textbox)}
      onItemSelect={(e) => controller.onSelectionChange(e.address)}
      onItemClick={(e) => controller.onLoadedChange(e.address)}
      onKeyDown={(e) => {
        if (e.key === 'Enter') controller.onEnter();
      }}
    />
  );
};
