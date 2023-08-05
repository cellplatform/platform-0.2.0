import { useEffect, useRef, useState } from 'react';
import { rx, slug, type t } from '../common';
import { View } from './ui';
import { Wrangle } from './Wrangle.mjs';

export const Stateful: React.FC<t.ScreenLayoutStatefulProps> = (props) => {
  const { slugs = [] } = props;

  const busRef = useRef(rx.bus());
  const [vimeo, setVimeo] = useState<t.VimeoInstance>();
  const [selected, setSelected] = useState(0);
  const [focused, setFocused] = useState<t.ScreenLayoutFocused>('index');
  const updateFocus = (status: t.VimeoStatus) => {
    setFocused(status.playing ? 'player.footer' : 'index');
  };

  /**
   * Lifecycle
   */
  useEffect(() => {
    const bus = busRef.current;
    const vimeo: t.VimeoInstance = { bus, id: `foo.${slug()}` };
    setVimeo(vimeo);
    props.onReady?.({ vimeo });
  }, []);

  /**
   * Render
   */
  return (
    <View
      slugs={slugs}
      selected={selected}
      focused={focused}
      onSelect={(e) => {
        setSelected(e.index);
      }}
      onPlayToggle={(e) => updateFocus(e.status)}
      onPlayComplete={(e) => {
        updateFocus(e.status);
        setSelected((current) => {
          // ACTION: Move to next slug.
          const { exists, index } = Wrangle.nextSlug(slugs, current);
          return exists ? index : current;
        });
      }}
    />
  );
};
