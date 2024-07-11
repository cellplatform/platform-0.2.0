import { useEffect, useState } from 'react';
import { CmdBar } from 'sys.ui.react.common';
import { Color, css, type t } from './common';

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
      console.log('ctrl.event', e);
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
  const theme = Color.theme(props.theme ?? 'Dark');
  const styles = {
    base: css({
      backgroundColor: theme.bg,
      color: theme.fg,
      overflow: 'hidden',
      display: 'grid',
    }),
  };

  return (
    <div {...css(styles.base, props.style)}>
      <CmdBar.Dev.Main
        theme={theme.name}
        fields={['Module.Args', 'Module.Run']}
        argsCard={{
          argv,
          ctrl: cmdbar,
          focused: { cmdbar: cmdbar?.current.focused },
        }}
      />
    </div>
  );
};
