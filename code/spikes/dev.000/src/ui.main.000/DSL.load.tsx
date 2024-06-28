import { Dev } from '../test.ui';
import { Args, CmdBar, Doc, Time, type t } from './common';
import { LoadList } from './ui.CmdBar.List';

export async function loadSpec(args: t.ParsedArgs, main: t.Shell) {
  const { Specs } = await import('../test.ui/entry.Specs');
  const pos = Args.positional(args);
  const spec = Specs[pos[1]];

  if (!spec) return;
  return <Dev.Harness spec={spec} style={{ Absolute: 0 }} />;
}

export async function loaderView(args: t.ParsedArgs, main: t.Shell) {
  const { Specs } = await import('../test.ui/entry.Specs');
  const pos = Args.positional(args);
  const filter = pos.slice(1).join(' ');
  return (
    <LoadList
      modules={Specs}
      filter={filter}
      onSelect={(e) => {
        // Update the command "argv".
        const path = CmdBar.Path.default.text;
        const cmd: t.CommandAction = 'dev';
        const next = `${cmd} ${e.uri}`;
        main.state.cmdbar.change((d) => Doc.Text.replace(d, path, next));

        // Move state back to the command bar.
        const cmdbar = CmdBar.Ctrl.methods(main.cmd.cmdbar);
        Time.delay(0, () => {
          cmdbar.caretToEnd({});
          cmdbar.focus({});
        });
      }}
    />
  );
}
