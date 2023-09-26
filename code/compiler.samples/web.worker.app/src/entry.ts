(async () => {
  /**
   * UI
   */
  const elRoot = document.getElementById('root')!;
  elRoot.innerHTML = '<h1>See console.</h1>';

  /**
   * Start worker.
   */
  import('./workers/worker.main');
  //   const bus = rx.bus();
  //   const store = await Filesystem.client({ bus });
  //   const fs = store.fs;
  //
  //   await fs.write('dist/index.md', '# Hello World!\n');
  //   console.log('manifest:', await fs.manifest());
  //   console.log('info - /dist:', await fs.info('/dist'));
})();
