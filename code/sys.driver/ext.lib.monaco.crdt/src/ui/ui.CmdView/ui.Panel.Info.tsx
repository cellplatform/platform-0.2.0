import { CrdtInfo, css, DEFAULTS, type t } from './common';

type P = t.CmdViewProps;
const def = DEFAULTS.props;

export type PanelInfoProps = {
  repo?: P['repo'];
  doc?: P['doc'];
  enabled?: boolean;
  theme?: t.CommonTheme;
  style?: t.CssValue;
};

export const PanelInfo: React.FC<PanelInfoProps> = (props) => {
  const { repo, doc, enabled = def.enabled } = props;

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
          document: {
            ref: doc,
            uri: { head: true },
            object: { visible: false },
          },
        }}
      />
    </div>
  );
};
