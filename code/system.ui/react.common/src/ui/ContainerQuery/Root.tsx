import { useEffect, useRef, useState } from 'react';
import { Color, COLORS, css, DEFAULTS, FC, rx, type t, slug, Style } from './common';

/**
 * Responsive UI container using the
 * [Container Query](https://developer.mozilla.org/en-US/docs/Web/CSS/@container) CSS feature.
 */
export const ContainerQuery: React.FC<t.ContainerQueryProps> = (props) => {
  const idRef = useRef(slug());
  const parentClass = `sys-container-${idRef.current}`;
  const childClass = `${parentClass}-child`;

  /**
   * Lifecycle
   */
  useEffect(() => {
    const style = document.createElement('style');
    style.setAttribute('data-kind', Wrangle.kindAttr(props));
    document.head.appendChild(style);
    const insert = (rule: string) => style.sheet?.insertRule(rule, 0);
    const withinClass = (className: string, rule: string) => insert(`.${className} ${rule}`);

    /**
     * TODO 🐷
     */
    withinClass(parentClass, `{ container-type: inline-size; }`);
    insert(`@container (width < 500px) {
      .${childClass} { color: blue; }
    }`);

    return () => {
      document.head.removeChild(style);
    };
  }, [parentClass]);

  /**
   * [Render]
   */
  const styles = {
    base: css({ position: 'relative' }),
  };

  return (
    <div id={'myElement'} {...css(styles.base, props.style)} className={parentClass}>
      <div className={childClass}>child</div>
    </div>
  );
};

/**
 * Helpers
 */
const Wrangle = {
  kindAttr(props: t.ContainerQueryProps) {
    const kind = 'sys.ContainerQuery';
    return props.displayName ? `${kind}:${props.displayName}` : kind;
  },
};
