import { useEffect, useState } from 'react';
import { Doc, CmdBar, Color, Pkg, css, type t } from './common';
import { DSL } from './-SPEC.dsl';

import { CmdHost } from 'sys.ui.react.common';
import { Specs } from '../../test.ui/entry.Specs';

export type FooterProps = {
  cmd: { fc: t.Cmd<t.FarcasterCmd> };
  network: t.NetworkStore;
  style?: t.CssValue;
  // onLoad?: (e: { name: string }) => void;
  // onUnload?: (e: {}) => void;
  onOverlay?: (e: { el?: JSX.Element }) => void;
};

export const Footer: React.FC<FooterProps> = (props) => {
  const { network, cmd } = props;
  const [lens, setLens] = useState<t.Lens>();

  /**
   * Lifecycle
   */
  useEffect(() => {
    const doc = network.shared.doc;
    if (doc) setLens(network.shared.ns.lens('dev.cmdbar', {}));
  }, [network.shared.doc.instance]);

  /**
   * Render
   */
  return (
    <CmdBar
      doc={lens}
      style={props.style}
      onReady={(e) => console.info(`⚡️ cmdbar.onReady:`, e)}
      onText={(e, ctx) => {
        const text = (e.text || '').trim();
        const parts = text.split(' ').map((part) => part.trim());

        if (parts[0] === 'load') {
          const theme = Color.theme('Dark');
          const styles = {
            base: css({
              Absolute: 0,
              backgroundColor: theme.bg,
              display: 'grid',
            }),
          };

          const el = (
            <div {...styles.base}>
              <CmdHost
                pkg={Pkg}
                imports={Specs}
                filter={() => CmdHost.Filter.imports(Specs, parts.slice(1).join(' '))}
                theme={theme.name}
                style={styles.base}
                showParamDev={false}
                showCommandbar={false}
                onItemInvoke={(e) => {
                  if (e.uri && lens) {
                    const resolver = CmdBar.Path.resolver();
                    const path = CmdBar.Path.default.text;
                    lens.change((d) => {
                      const from = resolver.text(d);
                      const to = `load ${e.uri}`;
                      Doc.Text.splice(d, path, 0, from.length, to);
                    });
                  }
                }}
              />
            </div>
          );

          props.onOverlay?.({ el });
        } else {
          props.onOverlay?.({ el: undefined });
        }
      }}
      onInvoke={async (e) => {
        /**
         * TODO 🐷
         * Extract a principled DSL.
         */

        const text = e.params.text;
        const parts = text.split(' ').map((part) => part.trim());
        const first = (parts[0] || '').trim();

        if (first === 'cast') {
          const text = parts[1];
          console.log('cast:', text);
          const send = cmd.fc.method('send:cast', 'send:cast:res');
          const res = await send({ text }).promise();
          console.log('cast:response:', res);
        }

        if (first === 'load') {
          const { Specs } = await import('../../test.ui/entry.Specs');
          const ns = parts.slice(1).join(' ').trim();
          const el = DSL.findAndRender(Specs, ns, { silent: false });
          props.onOverlay?.({ el });
        }
      }}
    />
  );
};
