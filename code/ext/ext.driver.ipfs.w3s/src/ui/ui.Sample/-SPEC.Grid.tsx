import { useEffect, useRef, useState, Fragment } from 'react';
import { Color, COLORS, css, FC, rx, type t, Hash, Filesize } from './common';
import type { Web3Storage, Upload } from 'web3.storage';
import { Wrangle, Url } from './Wrangle';

export type GridProps = {
  list?: Upload[];
  style?: t.CssValue;
};

export const Grid: React.FC<GridProps> = (props) => {
  console.log('props.list', props.list);
  const { list = [] } = props;

  /**
   * [Render]
   */
  const styles = {
    base: css({
      position: 'relative',
      padding: 8,
      minHeight: 10,
      boxSizing: 'border-box',
      fontSize: 14,

      display: 'grid',
      gridTemplateColumns: 'auto 1fr auto',
      columnGap: '15px',
      rowGap: '8px',
    }),
  };

  const elRows = list.map((item, i) => {
    const cid = item.cid;

    return (
      <Fragment key={i}>
        <div>
          <Link url={Url.cid(cid)}>{`cid:${Hash.shorten(cid, 4)}`}</Link>
        </div>
        <div>
          <Link url={Url.name(cid, item.name)}>{item.name}</Link>
        </div>
        <div>{`${Filesize(item.dagSize)}`}</div>
      </Fragment>
    );
  });

  return <div {...css(styles.base, props.style)}>{elRows}</div>;
};

/**
 * Helpers
 */

function Link(props: { children?: React.ReactNode; url?: string }) {
  return (
    <a href={props.url} target={'_blank'} rel={'noopener noreferrer'}>
      {props.children}
    </a>
  );
}
