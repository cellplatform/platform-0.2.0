[![ci](https://github.com/cellplatform/platform-0.0.2/actions/workflows/node.js.yml/badge.svg)](https://github.com/cellplatform/platform-0.0.2/actions/workflows/node.js.yml)
[![FOSSA Status](https://app.fossa.com/api/projects/custom%2B8499%2Fgithub.com%2Fcellplatform%2Fplatform-0.0.2.svg?type=shield)](https://app.fossa.com/projects/custom%2B8499%2Fgithub.com%2Fcellplatform%2Fplatform-0.0.2?ref=badge_shield)
[![license: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](https://opensource.org/licenses/MIT)
![banner](https://user-images.githubusercontent.com/185555/88729229-76ac1280-d187-11ea-81c6-14146ec64848.png)

[Monorepo](https://en.wikipedia.org/wiki/Monorepo) for the set of system modules that compose a "cell" platform.

---

<p>&nbsp;</p>

![pre-release](https://img.shields.io/badge/status-pre--release-orange.svg)  
API's, architecture, and other structures will change (probably radically 🐷) prior to `1.x` release.

- repo: [platform-0.0.2](https://github.com/philcockfield/platform-0.0.2) (**current**)
- repo: [platform-0.0.1](https://github.com/uiharness/platform-0.0.1)

<p>&nbsp;</p>
<p>&nbsp;</p>

# Philosophy

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

[@isaacs](https://www.npmjs.com/~isaacs) variations on the theme [distilled to](https://blog.izs.me/2013/04/unix-philosophy-and-nodejs):

- **Working** is better than perfect.
- **Focus** is better than features.
- **Compatibility** is better than purity.
- **Simplicity** is better than anything.

<p>&nbsp;</p>

---

![kay-pure-relationships](https://user-images.githubusercontent.com/185555/185737245-e82cd372-e253-4fd9-8221-435c001198ed.png)
![func](https://user-images.githubusercontent.com/185555/185738258-68e54981-0eb8-49b8-b8a8-a64b1ac45023.png)

---

References (conceptual context):

- [video](https://www.youtube.com/watch?v=nOrdzDaPYV4&t=1443s) Alan Kay (2019)
- [video](https://www.youtube.com/watch?v=-C-JoyNuQJs) Douglas Crockford (2011) - "The JSON Saga"

<p>&nbsp;</p>
<p>&nbsp;</p>

# Development

[![ci](https://github.com/cellplatform/platform-0.0.2/actions/workflows/node.js.yml/badge.svg)](https://github.com/cellplatform/platform-0.0.2/actions/workflows/node.js.yml)

The following global commands run from the root of the project and operate on all nested sub-modules of the system within this [monorepo](https://en.wikipedia.org/wiki/Monorepo).

These commands also approximate the main [CI](https://github.com/cellplatform/platform-0.0.2/actions/workflows/node.js.yml) behavior covered in this [github action steps](https://github.com/cellplatform/platform-0.0.2/actions/workflows/node.js.yml) when merging a PR into the [`main`](/tree/main) branch.

```bash

yarn
yarn build
yarn test

```

### Development Machine Setup

Development machine [environment setup](docs/setup.environment.md) suggestions.

<p>&nbsp;</p>

### Licence Analysis

[![FOSSA Status](https://app.fossa.com/api/projects/custom%2B8499%2Fgithub.com%2Fcellplatform%2Fplatform-0.0.2.svg?type=shield)](https://app.fossa.com/projects/custom%2B8499%2Fgithub.com%2Fcellplatform%2Fplatform-0.0.2?ref=badge_shield)
[![license: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](https://opensource.org/licenses/MIT)

The system (platform) lives as an "open commons" shared resource of the world. As such the core modules are [open source](https://en.wikipedia.org/wiki/Open-source_software) (OSS) and all up-stream dependencies conform with transitively equivalent OSS licences.  
In the case of this repo the baseline is the [MIT Licence](LICENSE).

To run a "licence analysis" and validate the depenency graph against this principle run:

      $ fossa analyze

ref: [fossa](https://docs.fossa.com/docs/importing-a-project) configuration docs

[![FOSSA Status](https://app.fossa.com/api/projects/custom%2B8499%2Fgithub.com%2Fcellplatform%2Fplatform-0.0.2.svg?type=large)](https://app.fossa.com/projects/custom%2B8499%2Fgithub.com%2Fcellplatform%2Fplatform-0.0.2?ref=badge_large)

<p>&nbsp;</p>
<p>&nbsp;</p>

# License

[MIT](LICENSE)

For a scintillating break down of this open-source classic, treat yourself to **Kyle E. Mitchell's**  
"[The MIT License line-by-line.](https://writing.kemitchell.com/2016/09/21/MIT-License-Line-by-Line.html) 171 words every programmer should understand."

<p>&nbsp;</p>
