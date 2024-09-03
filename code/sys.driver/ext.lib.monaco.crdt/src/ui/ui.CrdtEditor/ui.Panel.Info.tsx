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
        theme={props.theme}
        enabled={enabled}
        fields={['Repo', 'Doc', 'Doc.URI', 'Doc.Object']}
        repos={{ main: repo }}
        data={{
          repo: 'main',
          document: [
            {
              uri: doc?.uri,
              address: { head: true },
              object: { visible: false },
            },
            {
              uri: doc?.uri,
              label: 'Lens',
              address: { head: true },
              object: { lens: path, visible: false },
            },
          ],
        }}
      />
    </div>
  );
};
