  /**
   * CRDT: Selection → Keep editor carets in sync.
   */
  const carets = Monaco.Carets.create(editor, { dispose$ });
  identity$.pipe(rx.filter((e) => e.identity !== identity)).subscribe((e) => {
    console.log(identity, e);
    const selections = e.after.selections;
    carets.identity(e.identity).change({ selections });
  });
