import { expect } from 'chai';
import { Subject } from 'rxjs';

import { Dispose } from '.';

describe('Disposable', () => {
  it('create', () => {
    const obj = Dispose.create();
    expect(typeof obj.dispose).to.eql('function');
    expect(typeof obj.dispose$.subscribe).to.eql('function');
  });

  it('event: dispose$', () => {
    const obj = Dispose.create();

    let count = 0;
    obj.dispose$.subscribe(() => count++);

    obj.dispose();
    obj.dispose();
    obj.dispose();
    expect(count).to.eql(1);
  });

  it('until (single)', () => {
    const obj1 = Dispose.create();

    const $ = new Subject<void>();
    const obj2 = Dispose.until(obj1, $);

    let count = 0;
    obj1.dispose$.subscribe(() => count++);

    expect(obj1).to.equal(obj2);

    $.next();
    $.next();
    $.next();
    expect(count).to.eql(1);
  });

  it('done - fires and completes the subject', () => {
    const dispose$ = new Subject<void>();

    let count = 0;
    dispose$.subscribe((e) => count++);

    Dispose.done(dispose$);
    Dispose.done(dispose$);
    Dispose.done(dispose$);

    expect(count).to.eql(1);
  });
});
