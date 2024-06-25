import { Args, CmdBar, Doc, type t } from './common';
import { LoadList } from './ui.CmdBar.List';

export async function loaderView(args: t.ParsedArgs, doc: t.Lens) {
  const { Specs } = await import('../test.ui/entry.Specs');
  const pos = Args.positional(args);
  const filter = pos.slice(1).join(' ');
  return (
    <LoadList
      modules={Specs}
      filter={filter}
      onSelect={(e) => {
        doc.change((d) => {
          const path = CmdBar.Path.default.text;
          Doc.Text.replace(d, path, `load ${e.uri}`);
        });
      }}
    />
  );
}
