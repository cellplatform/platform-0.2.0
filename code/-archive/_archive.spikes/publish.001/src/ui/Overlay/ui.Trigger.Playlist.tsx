import { useEffect, useRef, useState } from 'react';
import { DEFAULTS, Color, COLORS, css, t, rx, State } from '../common';
import { Playlist } from '../Concept.Playlist';

export type OverlayTriggerPlaylistProps = {
  instance: t.Instance;
  def: t.OverlayDef;
  style?: t.CssValue;
};

export const OverlayTriggerPlaylist: React.FC<OverlayTriggerPlaylistProps> = (props) => {
  const { instance, def } = props;
  const { margin = {} } = def;
  const playlist = def.playlist;

  if (!playlist) return null;
  const { items = [] } = playlist;

  /**
   * [Render]
   */
  const styles = {
    base: css({
      marginTop: margin.top,
      marginBottom: margin.bottom,
      MarginX: 50,
    }),
  };
  return (
    <div {...css(styles.base, props.style)}>
      <Playlist
        title={def.title}
        items={items}
        preview={DEFAULTS.PLAYLIST.preview}
        onClick={async (e) => {
          //
          const path = e.data.link;
          if (!path) return;

          const context: t.StateOverlayContext[] = items.map((item) => {
            return {
              title: (item.text ?? '').toString(),
              path: item.link ?? '',
            };
          });

          await State.withEvents(instance, (events) => {
            events.overlay.def(def, path, { context });
          });
        }}
      />
    </div>
  );
};
