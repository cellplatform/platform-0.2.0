import { useState } from 'react';

import { Fragment } from 'react';
import { Wrangle, Url, Storage } from './Wrangle';
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
  const data = files.length === 1 ? files[0] : files;

  /**
   * Handlers
   */
  const handlePull = async (cid: string) => {
    setPulling(cid);
    const store = await Storage.import(apiKey);
    const res = await store.get(cid);
    setFiles(await Wrangle.toFiles(res));
    setPulling('');
  };

  /**
   * [Render]
   */
  const styles = {
    base: css({
      minHeight: 10,
      display: 'grid',
      gridTemplateColumns: '1fr 280px',
    }),
    grid: {
      base: css({
        position: 'relative',
        boxSizing: 'border-box',
        Padding: [8, 12],
        fontSize: 14,
        display: 'grid',
        gridTemplateColumns: 'auto 1fr auto auto',
        columnGap: '15px',
        rowGap: '8px',
      }),
      cid: css({ fontFamily: 'monospace', letterSpacing: -0.5 }),
      pull: css({ Size: 18, display: 'grid', placeItems: 'center' }),
      pullButton: css({ Size: 18, display: 'grid', placeItems: 'center' }),
    },
    file: {
      base: css({
        borderLeft: `solid 1px ${Color.alpha(COLORS.DARK, 0.1)}`,
        boxSizing: 'border-box',
        padding: 8,
        overflow: 'hidden',
      }),
    },
  };

  const elRows = list.map((item, i) => {
    const cid = item.cid;
    const bytes = item.dagSize;
    const isPulling = cid === pulling;
    const isAnyPulling = pulling !== '';

    const elPull = (
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
        <div {...styles.grid.cid}>
          <Link url={Url.cid(cid)}>{`cid:${Hash.shorten(cid, [3, 5])}`}</Link>
        </div>
        <div>
          <Link url={Url.name(cid, item.name)}>{item.name}</Link>
        </div>
        <div>{elPull}</div>
        <div>{`${Filesize(bytes)}`}</div>
      </Fragment>
    );
  });

  return (
    <div {...css(styles.base, props.style)}>
      <div {...styles.grid.base}>{elRows}</div>
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
    base: css({ color: COLORS.BLUE }),
  };

  return (
    <a {...styles.base} href={props.url} target={'_blank'} rel={'noopener noreferrer'}>
      {props.children}
    </a>
  );
}
