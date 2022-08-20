[![ci](https://github.com/cellplatform/platform-0.0.2/actions/workflows/node.js.yml/badge.svg)](https://github.com/cellplatform/platform-0.0.2/actions/workflows/node.js.yml)
[![FOSSA Status](https://app.fossa.com/api/projects/custom%2B8499%2Fgithub.com%2Fcellplatform%2Fplatform-0.0.2.svg?type=shield)](https://app.fossa.com/projects/custom%2B8499%2Fgithub.com%2Fcellplatform%2Fplatform-0.0.2?ref=badge_shield)
[![license: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](https://opensource.org/licenses/MIT)
![banner](https://user-images.githubusercontent.com/185555/88729229-76ac1280-d187-11ea-81c6-14146ec64848.png)

[Monorepo](https://en.wikipedia.org/wiki/Monorepo) for the set of system modules that make up "cell" platform.

---

<p>&nbsp;</p>

![pre-release](https://img.shields.io/badge/status-pre--release-orange.svg)  
API's, architecture, and other structures will change (probably radically 🐷) prior to `1.x` release.

- repo: [platform-0.0.1](https://github.com/uiharness/platform-0.0.1)
- repo: [platform-0.0.2](https://github.com/philcockfield/platform-0.0.2) (**current**)

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

[@isaacs](https://www.npmjs.com/~isaacs) follows this up with a thoughtful translation into [nodejs](https://nodejs.org) terms. His [whole post](https://blog.izs.me/2013/04/unix-philosophy-and-nodejs) is worth the read, but here's a distillation:

- **Working** is better than perfect.
- **Focus** is better than features.
- **Compatibility** is better than purity.
- **Simplicity** is better than anything.

<p>&nbsp;</p>

---

![start-your-turing-machine-quote-kay](https://user-images.githubusercontent.com/185555/185737245-e82cd372-e253-4fd9-8221-435c001198ed.png)
![alan-kay](https://user-images.githubusercontent.com/185555/185724123-ffd8c0c6-0391-4a1d-ac75-96db74dee914.png)

Conceptual thinking references:

- [video](https://www.youtube.com/watch?v=nOrdzDaPYV4&t=1443s) Alan Kay (2019)

<p>&nbsp;</p>
<p>&nbsp;</p>

# Development

### Development Machine Setup

Development machine [environment install/setup](docs/setup.environment.md) suggestions.

<p>&nbsp;</p>

### Licence Analysis

The system/platform is an "open commons" shared resource for the world. As such it is "[open source](https://en.wikipedia.org/wiki/Open-source_software)" (OSS) and all dependencies must conform with amenable OSS licences as well, in the case of this repo baseline is the [MIT Licence](LICENSE). To run an analysis over the depenency graph run:

      $ fossa analyze

(see [fossa](https://docs.fossa.com/docs/importing-a-project) configuration docs)

<p>&nbsp;</p>
<p>&nbsp;</p>

# License

[MIT](LICENSE) all the way!

For a scintillating break down of this open-source classic, treat yourself to **Kyle E. Mitchell's**  
"[The MIT License line-by-line.](https://writing.kemitchell.com/2016/09/21/MIT-License-Line-by-Line.html) 171 words every programmer should understand."

[![FOSSA Status](https://app.fossa.com/api/projects/custom%2B8499%2Fgithub.com%2Fcellplatform%2Fplatform-0.0.2.svg?type=shield)](https://app.fossa.com/projects/custom%2B8499%2Fgithub.com%2Fcellplatform%2Fplatform-0.0.2?ref=badge_shield)
[![license: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](https://opensource.org/licenses/MIT)

[![FOSSA Status](https://app.fossa.com/api/projects/custom%2B8499%2Fgithub.com%2Fcellplatform%2Fplatform-0.0.2.svg?type=large)](https://app.fossa.com/projects/custom%2B8499%2Fgithub.com%2Fcellplatform%2Fplatform-0.0.2?ref=badge_large)

<p>&nbsp;</p>
