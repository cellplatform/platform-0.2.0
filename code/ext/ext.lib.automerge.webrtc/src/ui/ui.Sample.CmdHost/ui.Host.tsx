import { CmdHost } from 'sys.ui.react.common';
import { Color, DEFAULTS, css, type t } from './common';
import { useController } from './use.Controller';

export type SampleHostProps = {
  pkg: t.ModuleDef;
  imports?: t.ModuleImports;
  doc?: t.Lens;
  path?: t.CmdHostPaths;
  theme?: t.CommonTheme;
  enabled?: boolean;
  debug?: string;
  style?: t.CssValue;
};

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
      display: 'grid',
      placeItems: 'center',
      fontSize: 22,
    }),
  };

  return (
    <div {...css(styles.base, props.style)}>
      <CmdHost.Stateful
        enabled={enabled}
        pkg={props.pkg}
        imports={imports}
        command={controller.value}
        mutateUrl={false}
        autoGrabFocus={false}
        listMinWidth={300}
        focusOnClick={true}
        theme={theme}
        onReady={(e) => controller.onTextboxReady(e.textbox)}
        onItemClick={(e) => controller.load(e.address)}
      />
      <div {...styles.debug}>{props.debug}</div>
    </div>
  );
};
