# sys.fs.spec
Functional Filesystem Specifications.  
Types:

- `sys.fs / FsDriver`

<p>&nbsp;</p>


### About
An executable set of specifications to run against `sys.fs` driver implementations 
to certify that they comply with the intended behavior of the 
filesystem `<Type>` abstraction.

<p>&nbsp;</p>

---

<p>&nbsp;</p>

### Usage
See [`Spec.TEST.mts`](/src/Spec.TEST.mts) for usage example of running within a test-runner.


```ts

  describe('Run (against MemoryMock)', () => {
    const factory: t.FsDriverFactory = async (dir?: string) => MemoryMock.create(dir).driver;
    Spec.every({ describe, it, factory });
  });

```

<p>&nbsp;</p>

To see the specification run (with verbose output) against a `MemoryMock` run:


    yarn spec
