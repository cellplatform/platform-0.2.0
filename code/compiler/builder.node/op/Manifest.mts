import { Path, Filesystem } from '../../../system/sys.fs.node/src/index.mjs';
import { rx } from '../../../system/sys.util/src/index.mjs';

/**
 * Helpers for building and saving the manifest of a compiled build.
 */
export const BuildManifest = {
  /**
   * Generate a build manifest from the given project/module
   * directory.
   */
  async generate(projectDir: string) {
    //
    // TEMP 🐷
    console.log('🐷🐷🐷 generate manifest', projectDir);

    // console.log('Path', Path);
    // console.log('Filesystem', Filesystem);

    const dist = Path.join(projectDir, 'dist');

    console.log('Generate Manifest:', dist);

    const bus = rx.bus();
    const id = 'fs.build-tools';
    const driver = Filesystem.Driver.Node({ dir: projectDir });
    // console.log('driver://', rx.bus.instance(bus));
    // console.log('driver', driver);

    // Filesystem.b
    const controller = Filesystem.Bus.Controller({ id, bus, driver });
    const fs = controller.fs();
    const m = await fs.manifest({ dir: 'dist' });
    // console.log('m', m);
  },
};
