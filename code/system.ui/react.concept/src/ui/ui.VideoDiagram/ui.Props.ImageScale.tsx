import { useEffect, useRef, useState } from 'react';
import { Color, COLORS, css, DEFAULTS, FC, rx, type t, Slider } from './common';

export type ImageScaleProps = {
  title?: string;
  props?: t.VideoDiagramProps;
  style?: t.CssValue;
  onChange?: t.SliderChangeHandler;
};

export const ImageScale: React.FC<ImageScaleProps> = (input) => {
  const { props = {}, title = 'image scale' } = input;

  /**
   * TODO 🐷
   * - delete
   */
  return null;

  //   const scale = props.image?.scale ?? DEFAULTS.image.scale;
  //   const percent = scale / 2;
  //
  //   /**
  //    * [Render]
  //    */
  //   const styles = {
  //     base: css({ marginBottom: 10 }),
  //     title: css({ fontSize: 12, marginBottom: 5 }),
  //     slider: css({}),
  //   };
  //
  //   return (
  //     <div {...css(styles.base, input.style)}>
  //       <div {...styles.title}>{title}</div>
  //       <Slider
  //         track={{ height: 10 }}
  //         thumb={{ size: 15 }}
  //         ticks={{ items: [0.5] }}
  //         percent={percent}
  //         onChange={input.onChange}
  //       />
  //     </div>
  // );
};
