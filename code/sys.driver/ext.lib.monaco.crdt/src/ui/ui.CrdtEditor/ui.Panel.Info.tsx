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
        fields={['Repo', 'Doc', 'Doc.URI', 'Doc.Object']}
        repos={{ main }}
        data={{
          repo: 'main',
          document: [
            { uri, address: { head: true }, object: { visible: false } },
            { uri, label: 'Lens', address: { head: true }, object: { lens: path, visible: false } },
          ],
        }}
      />
    </div>
  );
};
