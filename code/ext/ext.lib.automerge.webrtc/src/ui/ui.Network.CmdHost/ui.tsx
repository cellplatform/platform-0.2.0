import { CmdHost, DEFAULTS, type t } from './common';
import { useController } from './use.Controller';

export const View: React.FC<t.NetworkCmdHost> = (props) => {
  const { theme, doc, path = DEFAULTS.paths, enabled = true, imports, debug } = props;
  const { onLoad, onCommand } = props;
  const controller = useController({ enabled, doc, path, imports, debug, onLoad, onCommand });

  /**
   * Render
   */
  return (
    <CmdHost.Stateful
      style={props.style}
      badge={props.badge}
      pkg={props.pkg}
      imports={imports}
      theme={theme}
      enabled={enabled}
      mutateUrl={false}
      showParamDev={false}
      autoGrabFocus={false}
      listMinWidth={300}
      focusOnClick={true}
      hrDepth={props.hrDepth}
      listEnabled={controller.listEnabled}
      filter={controller.filter}
      command={controller.cmd}
      selected={controller.selectedUri}
      onReady={(e) => controller.onTextboxReady(e.textbox)}
      onItemSelect={(e) => controller.onSelectionChange(e.uri)}
      onItemInvoke={(e) => {
        controller.onSelectionChange(e.uri);
        controller.onInvoke();
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter') controller.onInvoke();
      }}
    />
  );
};
