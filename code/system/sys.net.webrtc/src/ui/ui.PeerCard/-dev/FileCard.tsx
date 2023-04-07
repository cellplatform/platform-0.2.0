import { CrdtInfo } from 'sys.data.crdt';

import { t } from './common';

export type FileCardProps = {
  title?: t.PropListTitleInput;
  doc: t.CrdtDocRef<any>;
  file?: t.CrdtDocFile<any>;
  filepath?: string;
  shadow?: t.CardProps['shadow'];
  margin?: t.CssEdgesInput;
  style?: t.CssValue;
};

export const FileCard: React.FC<FileCardProps> = (props) => {
  const { doc } = props;
  if (!doc) return null;

  const history = doc.history;
  const latest = history[history.length - 1];
  const data: t.CrdtInfoData = {
    file: { data: props.file, path: props.filepath },
    history: {
      data: history,
      item: { data: latest, title: 'Last Change' },
    },
  };

  /**
   * [Render]
   */
  return (
    <CrdtInfo
      title={Wrangle.title(props)}
      fields={['Module', 'History.Total', 'History.Item', 'File']}
      data={data}
      card={true}
      margin={props.margin}
    />
  );
};

/**
 * Helpers
 */

const Wrangle = {
  title(props: FileCardProps) {
    const title = CrdtInfo.Wrangle.title(props.title || 'CRDT Document');
    return {
      ...title,
      margin: title.margin ?? [0, 0, 15, 0],
    };
  },
};
