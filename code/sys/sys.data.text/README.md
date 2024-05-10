# sys.data.text

Text processing library.

## Example


```ts
import { Text } from 'sys.data.text'


/**
 * Parse and transform text (via ASTs).
 */

const transform = Text.Processor.markdown();
const md = transform.toHtml(text);

// Produces:
console.info(md.html); //        <== Parsed HTML
console.info(md.markdown); //    <== Formatted Markdown
console.info(md.toString());
console.info(md.info); //        <== Extracted Data-Structures

```


---

![sys.text](https://user-images.githubusercontent.com/185555/196023331-c4a18283-3143-464b-8438-03306a0823e2.png)



---

Standards: 
- [CommonMark](https://commonmark.org/) - common markdown standard
- [GFM: Github Flavored Markdown](https://github.github.com/gfm/) - markdown variant
- [Unified](http://unifiedjs.com/) - text processing ecosystem (aka. a "`stdlib`" baseline)
- [AST: Abstract Syntax Tree](https://en.wikipedia.org/wiki/Abstract_syntax_tree)

---

![doing-images-symbols](https://user-images.githubusercontent.com/185555/196011268-378be479-55e5-4ca6-a25c-5757c58c15b0.png)
[Ref](https://www.youtube.com/watch?v=Ud8WRAdihPg&t=24s): Jerome Bruner ← Alan Kay ([timestamp](https://www.youtube.com/watch?v=Ud8WRAdihPg&t=24s))


---

## Markdown


Grammars:
- [CommonMark](https://commonmark.org/)
- GFM ([Github Flavored Markdown](https://github.github.com/gfm/))

<p>&nbsp;</p>

#### GFM (Github Flavored Markdown)

[via:ref](https://github.com/remarkjs/remark-gfm)

```
# GFM

## Autolink literals

www.example.com, https://example.com, and contact@example.com.

## Footnote

A note[^1]

[^1]: Big note.

## Strikethrough

~one~ or ~~two~~ tildes.

## Table

| a | b  |  c |  d  |
| - | :- | -: | :-: |

## Tasklist

* [ ] to do
* [x] done
```

