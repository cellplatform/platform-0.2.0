import { CrdtInfo, css, DEFAULTS, type t } from './common';

type P = t.CmdViewProps;
const def = DEFAULTS.props;

export type PanelInfoProps = {
  repo?: P['repo'];
  doc?: P['doc'];
  fields?: P['infoFields'];
  enabled?: boolean;
  theme?: t.CommonTheme;
  style?: t.CssValue;
};

export const PanelInfo: React.FC<PanelInfoProps> = (props) => {
  const { repo, doc, fields = def.infoFields, enabled = def.enabled } = props;

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
        fields={fields}
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
