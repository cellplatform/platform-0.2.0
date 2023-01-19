import { useEffect, useRef, useState } from 'react';
import { Color, COLORS, css, t, rx } from '../common';
import { Header } from './ui.Header';
import { Footer } from './ui.Footer';
import { Body } from './ui.Body';

type Url = string;

export type PlaylistProps = {
  title?: string;
  previewImage?: Url;
  previewTitle?: string;
  footerRight?: string | JSX.Element;
  style?: t.CssValue;
};

export const Playlist: React.FC<PlaylistProps> = (props) => {
  const { title = 'Untitled Playlist' } = props;

  /**
   * [Render]
   */
  const styles = {
    base: css({
      borderLeft: `solid 5px ${COLORS.CYAN}`,
      borderRight: `solid 5px ${COLORS.CYAN}`,
      color: COLORS.DARK,
    }),
  };
  return (
    <div {...css(styles.base, props.style)}>
      <Header title={title} previewTitle={props.previewTitle} previewImage={props.previewImage} />
      <Body />
      <Footer footerRight={props.footerRight} />
    </div>
  );
};
