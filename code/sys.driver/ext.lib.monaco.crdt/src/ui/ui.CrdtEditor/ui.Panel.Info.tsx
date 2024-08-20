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
      <CrdtInfo
        theme={props.theme}
        enabled={enabled}
        stateful={true}
        fields={['Repo', 'Doc', 'Doc.URI', 'Doc.Object']}
        data={{
          repo,
          document: [
            {
              ref: doc,
              uri: { head: true },
              object: { visible: false },
            },
            {
              ref: doc,
              label: 'Lens',
              uri: { head: true },
              object: { lens: path, visible: false },
            },
          ],
        }}
      />
    </div>
  );
};
