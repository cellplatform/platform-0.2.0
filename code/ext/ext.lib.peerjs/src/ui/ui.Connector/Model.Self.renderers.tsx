import { COLORS, Icons, type t } from './common';
import { Data } from './Model.Data';

export const renderers: t.ConnectorItemRenderers = {
  label(e) {
    const data = Data.self(e.item);
    const label = data.copied ? 'copied' : `me:${e.item.label}`;
    return <>{label}</>;
  },

  action(kind, helpers) {
    if (kind === 'local:left') {
      return (e) => {
        const color = e.selected ? e.color : COLORS.BLUE;
        return <Icons.Person {...helpers.icon(e, 17)} color={color} />;
      };
    }

    if (kind === 'local:copy') {
      return (e) => {
        const data = Data.self(e.item);
        if (data.copied) {
          return <Icons.Done {...helpers.icon(e, 18)} tooltip={'Copied'} offset={[0, -1]} />;
        } else {
          return <Icons.Copy {...helpers.icon(e, 16)} tooltip={'Copy to clipboard'} />;
        }
      };
    }

    return;
  },
} as const;
