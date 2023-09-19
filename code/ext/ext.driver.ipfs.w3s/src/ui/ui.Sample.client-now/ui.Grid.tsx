import { useState } from 'react';

import { Fragment } from 'react';
import { Storage, Url, Wrangle } from './Wrangle';
import {
  Button,
  COLORS,
  Color,
  Filesize,
  Hash,
  Icons,
  ObjectView,
  Spinner,
  css,
  Path,
  type t,
} from './common';

import type { Upload } from 'web3.storage';

export type GridProps = {
  apiKey?: string;
  list?: Upload[];
  style?: t.CssValue;
};

export const Grid: React.FC<GridProps> = (props) => {
  const { list = [], apiKey = '' } = props;

  const [pulling, setPulling] = useState('');
  const [files, setFiles] = useState<t.SampleFile[]>([]);

  const displayFiles = Wrangle.toDisplayFiles(files);
  const data = files.length === 1 ? displayFiles[0] : displayFiles;

  /**
   * Handlers
   */
  const handlePull = async (cid: string) => {
    setPulling(cid);
    const store = await Storage.import(apiKey);
    const pullResponse = await store.get(cid);
    const files = await Wrangle.toFiles(pullResponse);
    console.info(`pulled files:`, files);
    setFiles(files);
    setPulling('');
  };

  /**
   * [Render]
   */
  const styles = {
    base: css({
      minHeight: 10,
      fontSize: 14,
      display: 'grid',
      gridTemplateColumns: '1fr 280px',
    }),
    mono: css({
      fontFamily: 'monospace',
      letterSpacing: -0.5,
      fontSize: 13,
      fontWeight: 400,
    }),
    grid: {
      base: css({
        position: 'relative',
        boxSizing: 'border-box',
        Padding: [8, 12],
        display: 'grid',
        gridTemplateColumns: 'auto 1fr auto auto',
        columnGap: '15px',
        rowGap: '8px',
      }),
      pull: css({ Size: 18, display: 'grid', placeItems: 'center' }),
      pullButton: css({ Size: 18, display: 'grid', placeItems: 'center' }),
    },
    file: {
      base: css({
        borderLeft: `solid 1px ${Color.alpha(COLORS.DARK, 0.1)}`,
        boxSizing: 'border-box',
        overflow: 'hidden',
        padding: 8,
      }),
    },
    empty: css({
      Absolute: 0,
      pointerEvents: 'none',
      fontSize: 14,
      fontStyle: 'italic',
      opacity: 0.3,
      display: 'grid',
      placeItems: 'center',
    }),
  };

  const elRows = list.map((item, i) => {
    const cid = item.cid;
    const bytes = item.dagSize;
    const isPulling = cid === pulling;
    const isAnyPulling = pulling !== '';
    const filename = Path.parts(item.name).filename;

    const elPullButton = (
      <div {...styles.grid.pull}>
        {isPulling && <Spinner.Bar width={18} />}
        {!isPulling && (
          <Button
            style={styles.grid.pullButton}
            enabled={!isAnyPulling}
            onClick={() => handlePull(cid)}
          >
            <Icons.Arrow.Down size={18} />
          </Button>
        )}
      </div>
    );

    return (
      <Fragment key={i}>
        <div {...styles.mono}>
          <Link url={Url.cid(cid)}>{`cid:${Hash.shorten(cid, [3, 5])}`}</Link>
        </div>
        <div {...styles.mono}>
          <Link url={Url.name(cid, filename)}>{item.name}</Link>
        </div>
        <div>{`${Filesize(bytes)}`}</div>
        <div>{elPullButton}</div>
      </Fragment>
    );
  });

  const elEmpty = elRows.length === 0 && <div {...styles.empty}>Nothing to display.</div>;

  return (
    <div {...css(styles.base, props.style)}>
      <div {...styles.grid.base}>{elEmpty || elRows}</div>
      <div {...styles.file.base}>
        <ObjectView data={data} expand={1} fontSize={12} />
      </div>
    </div>
  );
};

/**
 * Helpers
 */

function Link(props: { children?: React.ReactNode; url?: string }) {
  const styles = {
    a: css({
      color: COLORS.BLUE,
      textDecoration: 'none',
      ':hover': { textDecoration: 'underline' },
    }),
  };

  return (
    <a {...styles.a} href={props.url} target={'_blank'} rel={'noopener noreferrer'}>
      {props.children}
    </a>
  );
}
