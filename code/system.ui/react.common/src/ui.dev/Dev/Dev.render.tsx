import { t, DevBase } from '../common';
import { CmdHost } from '../CmdHost';

/**
 * Render a harness with the selected `dev=<namespace>` import
 * or an index list of available specs.
 */
export async function render() {
  // pkg: t.DevEntryPackage,
  // specs: t.SpecImports,
  // options: t.DevEntryRenderOptions = {},
  //
  //   return DevBase.render(pkg, specs, {
  //     ...options,
  //     listRenderer(props) {
  //       // const p: t.SpecListProps = {
  //       //   title: pkg.name,
  //       //   version: pkg.version,
  //       //   imports: specs,
  //       //   badge: options.badge,
  //       //   hrDepth: options.hrDepth,
  //       //   style,
  //       // };
  //       // const pkg  {name: pkg.name, version: pkg.version};
  //
  //       return <CmdHost pkg={pkg} imports={specs} />;
  //     },
  // });
}
