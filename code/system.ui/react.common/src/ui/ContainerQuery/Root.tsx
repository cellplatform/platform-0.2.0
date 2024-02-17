import { useEffect, useRef } from 'react';
import { css, slug, type t } from './common';

/**
 * Responsive UI container using the
 * [Container Query](https://developer.mozilla.org/en-US/docs/Web/CSS/@container) CSS feature.
 */
export const ContainerQuery: React.FC<t.ContainerQueryProps> = (props) => {
  const parentIdRef = useRef(slug());
  const parentClass = `sys-container-${parentIdRef.current}`;
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
      .${childClass} { 
        color: blue; 
        font-size: 50px;
      }
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
