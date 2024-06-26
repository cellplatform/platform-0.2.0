import { Dev } from '../test.ui';
import { Args, CmdBar, Doc, Time, type t } from './common';
import { LoadList } from './ui.CmdBar.List';

export async function loaderView(args: t.ParsedArgs, main: t.Main) {
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
        const next = `load ${e.uri}`;
        main.lens.cmdbar.change((d) => Doc.Text.replace(d, path, next));

        // Move state back to the command bar.
        Time.delay(0, () => {
          const cmdbar = CmdBar.Ctrl.methods(main.cmd.cmdbar);
          cmdbar.caretToEnd({});
          cmdbar.focus({});
        });
      }}
    />
  );
}

export async function loadModule(args: t.ParsedArgs, main: t.Main) {
  const { Specs } = await import('../test.ui/entry.Specs');
  const pos = Args.positional(args);
  const spec = Specs[pos[1]];

  if (!spec) return;
  return <Dev.Harness spec={spec} style={{ Absolute: 0 }} />;
}
