import { CmdHost } from 'sys.ui.react.common';
import { Color, DEFAULTS, css, type t } from './common';
import { useController } from './use.Controller';

export type SampleHostProps = t.NetworkCmdhost & { debug?: string };

export const SampleHost: React.FC<SampleHostProps> = (props) => {
  const { theme, doc, path = DEFAULTS.paths, enabled = true, debug, imports } = props;
  const controller = useController({ enabled, doc, path, imports, debug });

  /**
   * Render
   */
  const color = Color.fromTheme(theme);
  const styles = {
    base: css({ position: 'relative', display: 'grid', color }),
    debug: css({
      Absolute: [-12, null, null, -12],
      fontSize: 22,
      display: 'grid',
      placeItems: 'center',
    }),
  };

  return (
    <div {...css(styles.base, props.style)}>
      <CmdHost.Stateful
        theme={theme}
        enabled={enabled}
        pkg={props.pkg}
        imports={imports}
        command={controller.cmd}
        selectedIndex={controller.selected}
        mutateUrl={false}
        autoGrabFocus={false}
        listMinWidth={300}
        focusOnClick={true}
        onReady={(e) => controller.onTextboxReady(e.textbox)}
        onItemSelect={(e) => controller.onSelectionChange(e.index)}
        onItemClick={(e) => controller.load(e.address)}
      />
      <div {...styles.debug}>{props.debug}</div>
    </div>
  );
};
