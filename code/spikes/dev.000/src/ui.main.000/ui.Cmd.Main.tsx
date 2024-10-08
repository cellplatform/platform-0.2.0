import { useEffect, useState } from 'react';
import { CmdBar } from 'sys.ui.react.common';
import { Monaco, Color, css, type t, Value, Yaml, DocUri } from './common';

export type CmdMainProps = {
  main: t.Shell;
  theme?: t.CommonTheme;
  style?: t.CssValue;
};

export const CmdMain: React.FC<CmdMainProps> = (props) => {
  const { main } = props;
  const cmdbar = main.cmdbar;

  const [isCmdbarFocused, setCmdBarFocused] = useState(false);
  const [argv, setArgv] = useState('');

  /**
   * Invoke monitor.
   */
  useEffect(() => {
    const events = cmdbar?.ctrl.events();

    events?.$.subscribe((e) => {
      // console.log('ctrl.event', e);
    });

    return events?.dispose;
  }, [cmdbar?.ctrl]);

  useEffect(() => {
    const life = cmdbar?.onChange((e) => {
      setCmdBarFocused(e.focused);
      setArgv(e.text);
    });
    return life?.dispose;
  }, [cmdbar]);

  /**
   * Render
   */
  const theme = Color.theme(props.theme);
  const styles = {
    base: css({
      color: theme.fg,
      overflow: 'hidden',
      display: 'grid',
    }),
  };

  const ctrl = cmdbar ? CmdBar.Ctrl.toCtrl(cmdbar) : undefined;
  return (
    <div {...css(styles.base, props.style)}>
      <CmdBar.Dev.Main
        theme={theme.name}
        fields={['Module.Args', 'Module.Run']}
        argsCard={{
          argv,
          ctrl,
          focused: { cmdbar: cmdbar?.current.focused },
        }}
        run={{
          ctrl,
          argv,

          /**
           * CmdBar.Args: changed
           */
          async onArgsChanged(e) {
            const { args } = e;
            const pos = args._;
            const clear = () => e.render(null);

            if (pos[0] === 'cmd') {
              if (pos[1]?.startsWith('crdt:')) {
                const { CrdtView } = await import('./ui.CrdtView');
                const uri = pos[1];
                return e.render(<CrdtView main={main} theme={e.theme} docuri={uri} />);
              }
            }

            clear();
          },

          /**
           * CmdBar: Invoke
           */
          async onInvoke(e) {
            const { args } = e;
            const pos = args._;

            if (pos[0] === 'cmd') {
              if (pos[1] === 'crdt' && pos[2] === 'create') {
                const { CrdtView } = await import('./ui.CrdtView');

                const store = main.repo.tmp.store;
                const doc = await store.doc.getOrCreate(() => null);
                const uri = doc.uri;
                return e.render(<CrdtView main={main} docuri={uri} theme={e.theme} />);
              }
            }
          },
        }}
      />
    </div>
  );
};
