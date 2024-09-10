import { CrdtInfo, css, DEFAULTS, type t } from './common';

const DEF = DEFAULTS.props;

export type PanelInfoProps = {
  path?: t.ObjectPath;
  data?: t.CrdtEditorData;
  enabled?: boolean;
  theme?: t.CommonTheme;
  style?: t.CssValue;
};

export const PanelInfo: React.FC<PanelInfoProps> = (props) => {
  const { data = {}, path, enabled = DEF.enabled } = props;
  const { repo, doc } = data;
  const main = repo;
  const uri = doc?.uri;

  const fields = data.info?.fields ?? DEFAULTS.Panel.Info.fields.default;
  const address = { head: true };
  const lens = path;

  /**
   * Render
   */
  const styles = {
    base: css({
      pointerEvents: enabled ? 'auto' : 'none',
      display: 'grid',
    }),
  };

  return (
    <div {...css(styles.base, props.style)}>
      <CrdtInfo.Stateful
        enabled={enabled}
        theme={props.theme}
        fields={fields}
        repos={{ main }}
        data={{
          repo: 'main',
          document: [
            { uri, address, object: { visible: false } },
            { uri, label: 'Lens', address, object: { lens, visible: false } },
          ],
        }}
      />
    </div>
  );
};
