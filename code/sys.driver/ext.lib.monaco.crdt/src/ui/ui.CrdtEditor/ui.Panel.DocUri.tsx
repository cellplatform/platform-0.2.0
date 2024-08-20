import { useState } from 'react';
import { Color, COLORS, css, DEFAULTS, DocUri, Icons, Time, type t } from './common';

type P = t.CrdtEditorProps;
const DEF = DEFAULTS.props;

export type PanelDocUriProps = {
  doc?: t.Doc;
  enabled?: boolean;
  theme?: t.CommonTheme;
  style?: t.CssValue;
};

export const PanelDocUri: React.FC<PanelDocUriProps> = (props) => {
  const { doc, enabled = DEF.enabled } = props;

  const [isCopy, setIsCopy] = useState(false);
  const [copiedText, setCopiedText] = useState<string>();

  /**
   * Render
   */
  const t = (prop: string, time: t.Msecs = 50) => `${prop} ${time}ms`;
  const transition = [t('opacity')].join(', ');
  const theme = Color.theme(props.theme);
  const styles = {
    base: css({
      display: 'grid',
      placeItems: 'center',
    }),
    inner: css({
      display: 'grid',
      gridTemplateColumns: doc ? `auto 1fr` : '1fr',
      columnGap: '15px',
    }),
    icon: css({
      opacity: doc && enabled ? 1 : 0.2,
      transition,
    }),
  };

  let Icon = isCopy ? Icons.Copy : Icons.Repo;
  if (copiedText) Icon = Icons.Done;

  return (
    <div {...css(styles.base, props.style)}>
      <div {...styles.inner}>
        {doc && (
          <DocUri
            doc={doc}
            head={0}
            fontSize={20}
            theme={theme.name}
            enabled={enabled}
            copiedText={copiedText}
            onMouse={(e) => setIsCopy(e.is.over)}
            onCopy={(e) => {
              setCopiedText('copied');
              Time.delay(1500, () => setCopiedText(undefined));
            }}
          />
        )}
        <Icon style={styles.icon} color={!!copiedText ? COLORS.GREEN : undefined} />
      </div>
    </div>
  );
};
