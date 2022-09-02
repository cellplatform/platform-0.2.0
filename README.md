[![ci(esm)](https://github.com/cellplatform/platform-0.2.0/actions/workflows/node.esm.yml/badge.svg)](https://github.com/cellplatform/platform-0.2.0/actions/workflows/node.esm.yml)
[![FOSSA Status](https://app.fossa.com/api/projects/custom%2B8499%2Fgithub.com%2Fcellplatform%2Fplatform-0.2.0.svg?type=shield)](https://app.fossa.com/projects/custom%2B8499%2Fgithub.com%2Fcellplatform%2Fplatform-0.2.0?ref=badge_shield)
[![license: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](https://opensource.org/licenses/MIT)
![banner](https://user-images.githubusercontent.com/185555/88729229-76ac1280-d187-11ea-81c6-14146ec64848.png)

[Monorepo](https://en.wikipedia.org/wiki/Monorepo) comprising the set of core `system` modules that flexibly compose into varying arrangements of (1) extremely-late-bound, (2) strongly typed, (3) decentralised, "cell" processes.

---

<p>&nbsp;</p>

![pre-release](https://img.shields.io/badge/status-pre--release-orange.svg)  
Sustained long range R&D.  
Architecture, API's, and other structures will change (probably radically 🐷) prior to any `1.x` release.

- repo: [platform-0.2.0](https://github.com/cellplatform/platform-0.2.0) (**current**)
- repo: [platform-0.1.0](https://github.com/cellplatform/platform-0.1.0) (previous)

<p>&nbsp;</p>
<p>&nbsp;</p>

# Philosophy: Dev

As quoted on [@isaacs](https://www.npmjs.com/~isaacs) post ["Unix Philosophy and Node.js"](https://blog.izs.me/2013/04/unix-philosophy-and-nodejs),  
[Doug McIlroy's](https://en.wikipedia.org/wiki/Douglas_McIlroy) 4-point formulation of the [Unix Philosophy](http://www.catb.org/esr/writings/taoup/html/ch01s06.html):

<p>&nbsp;</p>

1. **Make each program do one thing well.**  
   To do a new job, build afresh rather than complicate old programs by adding new features.

2. **Expect the output of every program to become the input to another, as yet unknown, program.**  
   Don’t clutter output with extraneous information. Avoid stringently columnar or binary input formats. Don’t insist on interactive input.

3. **Design and build software, even operating systems, to be tried early, ideally within weeks.**  
   Don’t hesitate to throw away the clumsy parts and rebuild them.

4. **Use tools in preference to unskilled help to lighten a programming task**,  
   even if you have to detour to build the tools and expect to throw some of them out after you’ve finished using them.

<p>&nbsp;</p>

# Philosophy: Design

![kay-pure-relationships](https://user-images.githubusercontent.com/185555/186360463-cfd81f46-3429-4741-bbb3-b32015a388ac.png)
![func](https://user-images.githubusercontent.com/185555/185738258-68e54981-0eb8-49b8-b8a8-a64b1ac45023.png)

<p>&nbsp;</p>
<p>&nbsp;</p>

---

References (conceptual context):

- [video](https://www.youtube.com/watch?v=nOrdzDaPYV4&t=1443s) Alan Kay (2019)
- [video](https://www.youtube.com/watch?v=-C-JoyNuQJs) Crockford (2011) - "JSON [as the] intersection of all modern programming languages ([timestamp](https://youtu.be/-C-JoyNuQJs?t=741))"

---

<p>&nbsp;</p>
<p>&nbsp;</p>

# Development

[![ci(esm)](https://github.com/cellplatform/platform-0.2.0/actions/workflows/node.esm.yml/badge.svg)](https://github.com/cellplatform/platform-0.2.0/actions/workflows/node.esm.yml)

### Primary Commands (Global)

The following global commands run from the root of the project and operate on all nested
sub-modules of the system within this [monorepo](https://en.wikipedia.org/wiki/Monorepo).

These commands also approximate the main [CI](https://github.com/cellplatform/platform-0.0.2/actions/workflows/node.esm.yml)
behavior covered in the [github action](https://github.com/cellplatform/platform-0.0.2/actions/workflows/node.js.yml)
when merging a PR into the [`main`](/tree/main) branch.

```bash

$ yarn audit
$ yarn build
$ yarn test

```

<p>&nbsp;</p>

### Development Machine Setup

Development machine [environment setup](docs/setup.environment.md) suggestions.

<p>&nbsp;</p>

### Licence Analysis

[![FOSSA Status](https://app.fossa.com/api/projects/custom%2B8499%2Fgithub.com%2Fcellplatform%2Fplatform-0.2.0.svg?type=shield)](https://app.fossa.com/projects/custom%2B8499%2Fgithub.com%2Fcellplatform%2Fplatform-0.2.0?ref=badge_shield)
[![license: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](https://opensource.org/licenses/MIT)

The system (platform) lives as an "open commons" shared resource of the world's peoples. As such the core modules of the system are [open source](https://en.wikipedia.org/wiki/Open-source_software) (OSS) and all up-stream dependencies conform with transitively equivalent OSS licences.

In the case of this repo the baseline is the [MIT Licence](LICENSE), and when evolving the licencing strategy through reearched refinement over time, will move toward the attractor of "more free" as in "individual freedoms" ([libre](https://en.wiktionary.org/wiki/libre)) free.

To run a "licence analysis" and validate the depenency graph against this principle run:

```bash
$ fossa analyze
```

ref: [fossa](https://docs.fossa.com/docs/importing-a-project) configuration docs

[![FOSSA Status](https://app.fossa.com/api/projects/custom%2B8499%2Fgithub.com%2Fcellplatform%2Fplatform-0.2.0.svg?type=large)](https://app.fossa.com/projects/custom%2B8499%2Fgithub.com%2Fcellplatform%2Fplatform-0.2.0?ref=badge_large)

<p>&nbsp;</p>
<p>&nbsp;</p>

# License - [MIT](LICENSE)

For a scintillating break down of this open-source classic, treat yourself to **Kyle E. Mitchell's**  
"[The MIT License line-by-line.](https://writing.kemitchell.com/2016/09/21/MIT-License-Line-by-Line.html) 171 words every programmer should understand."

<p>&nbsp;</p>
