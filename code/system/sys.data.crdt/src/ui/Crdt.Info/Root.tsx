import { useEffect, useState } from 'react';

import { Card, css, DEFAULTS, FC, FIELDS, Pkg, PropList, rx, Style, t } from './common';
import { File } from './field.File.mjs';
import { HistoryItem } from './field.History.Item.mjs';
import { History } from './field.History.mjs';

export type CrdtInfoProps = {
  title?: t.PropListTitleInput;
  fields?: t.CrdtInfoFields[];
  width?: number;
  minWidth?: number;
  maxWidth?: number;
  data?: t.CrdtInfoData;
  margin?: t.CssEdgesInput;
  card?: boolean;
  style?: t.CssValue;
};

/**
 * Component
 */
const View: React.FC<CrdtInfoProps> = (props) => {
  const { width, minWidth = 230, maxWidth, fields = DEFAULTS.fields, data = {} } = props;

  type F = { exists: boolean; manifest: t.DirManifest };
  const [file, setFile] = useState<F | undefined>();

  /**
   * [Effects]
   */
  useEffect(() => {
    let isDisposed = false;
    const { dispose, dispose$ } = rx.disposable();
    dispose$.subscribe(() => (isDisposed = true));

    const docFile = data.file?.data;
    if (docFile) {
      const updateState = async () => {
        if (isDisposed) return;
        const info = await docFile.info();
        if (!isDisposed) {
          const { exists, manifest } = info;
          setFile({ exists, manifest });
        }
      };

      updateState();
      docFile?.$.pipe(rx.takeUntil(dispose$)).subscribe(updateState);
    }

    return () => dispose();
  }, [Boolean(data.file?.data)]);

  const items = PropList.builder<t.CrdtInfoFields>()
    .field('Module', { label: 'Module', value: `${Pkg.name}@${Pkg.version}` })
    .field('Driver', { label: 'Driver', value: Wrangle.automerge() })
    .field('History.Total', () => History(data))
    .field('History.Item', () => HistoryItem(data))
    .field('File', () => File(data, file))
    .items(fields);

  /**
   * [Render]
   */
  const styles = {
    base: css({
      position: 'relative',
      boxSizing: 'border-box',
      width,
      minWidth,
      maxWidth,
    }),
    edges: css({
      ...Style.toMargins(props.margin),
    }),
  };

  const elBody = (
    <PropList title={Wrangle.title(props)} items={items} defaults={{ clipboard: false }} />
  );

  if (props.card) {
    return (
      <Card style={css(styles.base, props.style)} padding={[20, 25, 30, 25]} margin={props.margin}>
        {elBody}
      </Card>
    );
  }

  return <div {...css(styles.base, styles.edges, props.style)}>{elBody}</div>;
};

/**
 * Helpers
 */

const Wrangle = {
  automerge() {
    const name = '@automerge/automerge';
    const version = Pkg.dependencies[name] ?? '0.0.0';
    return `${name}@${version}`;
  },

  title(props: CrdtInfoProps) {
    const title = PropList.Wrangle.title(props.title);
    if (!title.margin && props.card) title.margin = [0, 0, 15, 0];
    return title;
  },
};

/**
 * Export
 */
type Fields = {
  DEFAULTS: typeof DEFAULTS;
  FIELDS: typeof FIELDS;
  Wrangle: typeof PropList.Wrangle;
};
export const CrdtInfo = FC.decorate<CrdtInfoProps, Fields>(
  View,
  { DEFAULTS, FIELDS, Wrangle: PropList.Wrangle },
  { displayName: 'CrdtInfo' },
);
