import { Fragment } from 'react';
import { Url } from './Wrangle';
import { Filesize, Hash, css, type t } from './common';

import type { Upload } from 'web3.storage';

export type GridProps = {
  list?: Upload[];
  style?: t.CssValue;
};

export const Grid: React.FC<GridProps> = (props) => {
  const { list = [] } = props;

  /**
   * [Render]
   */
  const styles = {
    base: css({
      position: 'relative',
      Padding: [8, 12],
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
    const bytes = item.dagSize;
    return (
      <Fragment key={i}>
        <div>
          <Link url={Url.cid(cid)}>{`cid:${Hash.shorten(cid, 4)}`}</Link>
        </div>
        <div>
          <Link url={Url.name(cid, item.name)}>{item.name}</Link>
        </div>
        <div>{`${Filesize(bytes)}`}</div>
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
