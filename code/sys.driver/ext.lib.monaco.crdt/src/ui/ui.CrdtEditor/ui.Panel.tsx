import { Color, css, DEFAULTS, type t } from './common';
import { PanelDocUri } from './ui.Panel.DocUri';
import { PanelInfo } from './ui.Panel.Info';

const DEF = DEFAULTS.props;

export type PanelProps = {
  dataPath?: t.ObjectPath;
  data?: t.CrdtEditorData;
  enabled?: boolean;
  borderColor?: string;
  theme?: t.CommonTheme;
  style?: t.CssValue;
};

export const Panel: React.FC<PanelProps> = (props) => {
  const { data, enabled = DEF.enabled, dataPath } = props;
  const doc = data?.doc;

  /**
   * Render
   */
  const theme = Color.theme(props.theme);
  const styles = {
    base: css({
      backgroundColor: Color.alpha(theme.bg, 0.2),
      color: theme.fg,
      display: 'grid',
      backdropFilter: `blur(80px)`,
      gridTemplateRows: `1fr auto`,
    }),
    info: {
      base: css({ position: 'relative', display: 'grid', Scroll: true }),
      inner: css({ Absolute: 0, boxSizing: 'border-box', padding: 15 }),
      footer: css({ height: 30 }),
    },
    uri: css({
      borderTop: `solid 1px ${props.borderColor}`,
      padding: 15,
    }),
  };

  const elPanelInfo = (
    <div {...styles.info.base}>
      <div {...styles.info.inner}>
        <PanelInfo data={data} path={dataPath} enabled={enabled} theme={theme.name} />
        <div {...styles.info.footer} />
      </div>
    </div>
  );

  const elDocUri = (
    <div {...styles.uri}>
      <PanelDocUri doc={doc} theme={theme.name} enabled={enabled} />
    </div>
  );

  return (
    <div {...css(styles.base, props.style)}>
      {elPanelInfo}
      {elDocUri}
    </div>
  );
};
