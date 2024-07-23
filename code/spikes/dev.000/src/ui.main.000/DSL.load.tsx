import { Dev } from '../test.ui';
import { Args, CmdBar, Color, Doc, Time, type t } from './common';
import { DevList } from './ui.CmdBar.List';

export async function loadSpec(args: t.ParsedArgs, main: t.Shell) {
  const { Specs } = await import('../test.ui/entry.Specs');
  const pos = Args.positional(args);
  const spec = Specs[pos[1]];
  if (!spec) return;

  const theme = Color.theme('Light');

  return (
    <Dev.Harness
      spec={spec}
      style={{
        Absolute: 0,
        backgroundColor: Color.alpha(theme.bg, 0.85),
        backdropFilter: `blur(8px)`,
      }}
    />
  );
}

export async function loaderView(args: t.ParsedArgs, main: t.Shell) {
  const { Specs } = await import('../test.ui/entry.Specs');
  const pos = Args.positional(args);
  const filter = pos.slice(1).join(' ');
  return (
    <DevList
      modules={Specs}
      filter={filter}
      onSelect={(e) => {
        // Update the command "argv".
        const path = CmdBar.Path.defaults.text;
        const cmd: t.RootCommands = 'dev';
        const next = `${cmd} ${e.uri}`;
        main.state.cmdbar.change((d) => Doc.Text.replace(d, path, next));

        // Move state back to the command bar.
        const cmdbar = main.cmdbar;
        if (cmdbar) {
          Time.delay(0, () => {
            cmdbar.ctrl.caretToEnd({});
            cmdbar.ctrl.focus({});
          });
        }
      }}
    />
  );
}
