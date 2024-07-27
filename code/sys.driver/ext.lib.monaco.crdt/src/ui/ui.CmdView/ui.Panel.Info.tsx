import { CrdtInfo, DEFAULTS, type t } from './common';

type P = t.CmdViewProps;

export type PanelInfoProps = {
  repo?: P['repo'];
  doc?: P['doc'];
  fields?: P['infoFields'];
  theme?: t.CommonTheme;
  style?: t.CssValue;
};

export const PanelInfo: React.FC<PanelInfoProps> = (props) => {
  const { repo, doc, fields = DEFAULTS.props.infoFields } = props;

  /**
   * Render
   */
  return (
    <CrdtInfo
      style={props.style}
      theme={props.theme}
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
  );
};
