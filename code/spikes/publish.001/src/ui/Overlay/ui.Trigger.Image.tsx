import { css, State, t } from '../common';
import { DocImage } from '../Markdown.Doc.Components/Doc.Image';

export type OverlayTriggerImageProps = {
  instance: t.Instance;
  def: t.OverlayDef;
  style?: t.CssValue;
};

export const OverlayTriggerImage: React.FC<OverlayTriggerImageProps> = (props) => {
  const { instance, def } = props;
  const { margin = {} } = def;

  if (!def.image) return null;

  const handleClick: React.MouseEventHandler = (e) => {
    let path = def?.image?.link ?? '';
    path = path.replace(/^\./, '');
    path = path.replace(/^\//, '');
    path = path.trim();
    if (path) {
      e.preventDefault();
      State.withEvents(instance, (events) => events.overlay.def(def, path));
    }
  };

  /**
   * [Render]
   */
  const styles = {
    base: css({
      marginTop: margin.top,
      marginBottom: margin.bottom,
      cursor: 'pointer',
    }),
  };

  return (
    <div {...css(styles.base, props.style)} title={def.title}>
      <DocImage def={def.image} onLinkClick={handleClick} />
    </div>
  );
};
