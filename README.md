![banner](https://user-images.githubusercontent.com/185555/208599983-cfb3aba5-b8c2-44bd-b0b0-4115bfc0bd0f.png)

[![ci(esm)](https://github.com/cellplatform/platform-0.2.0/actions/workflows/node.esm.yml/badge.svg)](https://github.com/cellplatform/platform-0.2.0/actions/workflows/node.esm.yml)
[![FOSSA Status](https://app.fossa.com/api/projects/custom%2B8499%2Fgithub.com%2Fcellplatform%2Fplatform-0.2.0.svg?type=shield)](https://app.fossa.com/projects/custom%2B8499%2Fgithub.com%2Fcellplatform%2Fplatform-0.2.0?ref=badge_shield)
[![license: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](https://opensource.org/licenses/MIT)





[Monorepo](https://en.wikipedia.org/wiki/Monorepo) comprising the core set of shared `system` modules that flexibly compose into varying arrangements of   
(1) extremely-late-bound, (2) strongly typed, (3) decentralised, "cell like" functional processes.

- [compilation](/code/compiler/) toolchain
- [system](/code/system/) modules

---

<p>&nbsp;</p>

![pre-release](https://img.shields.io/badge/status-pre--release-orange.svg)  
Sustained long range R&D.  
Architecture, API's, and other conceptual primmitives will change (probably radically 🐷) prior to any `1.x` release.


|     | repo                   | status
| --- | :---                   | :---
|  ●  | platform-0.2.0-alpha   | __current__
|  ○  | platform-0.1.0         | [previous](https://github.com/cellplatform/platform-0.1.0)



<p>&nbsp;</p>
<p>&nbsp;</p>

# Philosophy: Dev

>> Open Systems.  
   Open Commons.  

---

[Doug McIlroy's](https://en.wikipedia.org/wiki/Douglas_McIlroy) as quoted by [Salus](https://en.wikipedia.org/wiki/Peter_H._Salus) in "[A Quarter Century of Unix](https://www.google.co.nz/books/edition/_/ULBQAAAAMAAJ?hl=en&gbpv=0)" ([ref](https://blog.izs.me/2013/04/unix-philosophy-and-nodejs/)):

- Write programs that do one thing and do it well.
- Write programs to work together.
- Write programs to handle text streams, because that is a universal interface.

<p>&nbsp;</p>

[Doug McIlroy's](https://en.wikipedia.org/wiki/Douglas_McIlroy) 4-point formulation of the [Unix Philosophy](http://www.catb.org/esr/writings/taoup/html/ch01s06.html):

1. **Make each program do one thing well.**  
   To do a new job, build afresh rather than complicate old programs by adding new features.

2. **Expect the output of every program to become the input to another, as yet unknown, program.**  
   Don’t clutter output with extraneous information. Avoid stringently columnar or binary input formats. Don’t insist on interactive input.

3. **Design and build software, even operating systems, to be tried early, ideally within weeks.**  
   Don’t hesitate to throw away the clumsy parts and rebuild them.

4. **Use tools in preference to unskilled help to lighten a programming task**,  
   Even if you have to detour to build the tools and expect to throw some of them out after you’ve finished using them.

<p>&nbsp;</p>

#### Subjective Measures of Quality (Design / System Engineering):

- [Modularity](https://en.wikipedia.org/wiki/Modularity)
- [Cohesion](https://en.wikipedia.org/wiki/Cohesion_(computer_science))
- Good [Seperation of Concerns](https://en.wikipedia.org/wiki/Separation_of_concerns)
- Good lines of [Abstraction](https://en.wikipedia.org/wiki/Abstraction_(computer_science))  ([information hiding](https://en.wikipedia.org/wiki/Information_hiding))
- [Loose Coupling](https://en.wikipedia.org/wiki/Loose_coupling)

<p>&nbsp;</p>


>> **"libraries not frameworks"**  
>> An orientation toward framework agnosticism (which is the choise **default** in most circumstances). 
>> Then levered by a simple/strict extensino pattern, (eg. "drivers") as appropriate to the module's domain, technology, and constraints.

<p>&nbsp;</p>

# Philosophy: Design

![kay-pure-relationships](https://user-images.githubusercontent.com/185555/186360463-cfd81f46-3429-4741-bbb3-b32015a388ac.png)
![func](https://user-images.githubusercontent.com/185555/185738258-68e54981-0eb8-49b8-b8a8-a64b1ac45023.png)

<p>&nbsp;</p>
<p>&nbsp;</p>

---

Ideas, history, context:

- [video](https://www.youtube.com/watch?v=Ud8WRAdihPg) Alan Kay, Learning and Computer Science, 1970s, [video](https://www.youtube.com/watch?v=YyIQKBzIuBY) Alan Kay, 2011, Programming and Scaling
- [video](https://www.youtube.com/watch?v=cmi-AXKvx30&t=323s) David Clark (1960's vs. 1970/80's)  
  "But what's interesting, is once the engineers got a hold, the visionaries went away ([timestamp](https://www.youtube.com/watch?v=cmi-AXKvx30&t=253s))"
- [video](https://www.youtube.com/watch?v=-C-JoyNuQJs) Crockford (2011) - "JSON [as the] intersection of all modern programming languages ([timestamp](https://youtu.be/-C-JoyNuQJs?t=741))"
- [video](https://youtu.be/0fpDlAEQio4?t=2641) SmallTalk (1976, 1980), only three primitive concepts. Everything is an object*, everything is a "message", be as extremely late-bound as possible. Build everything else up and out of that (aka. LISP-ey).


*NB: "object" meaning the original SmallTalk conception of "object," not the following "OOP" notions that emerged later ([ref.related](https://youtu.be/o4Xgx7bg3Lg?t=118)).

---

<p>&nbsp;</p>

## Human Systems 
(aka. "all of us"). Social/relational networks and people, across scales. "People" not "users." 

<p>&nbsp;</p>

![group-scape](https://user-images.githubusercontent.com/185555/208217954-0427e91d-fcb3-4e9a-b5f1-1f86ed3500bf.png)

<p>&nbsp;</p>

Identity is not a simple reductive thing...we, each of us, inhabit many contexturally dependent and diverse identities.  
“I am large, I contain multitudes” - [1892, Walt Whitman](https://en.wikipedia.org/wiki/Song_of_Myself)  


<p>&nbsp;</p>

### Gall's Law

>> A ***complex*** system that *works* is invariably found to have evolved from a ***simple*** system that *worked*. - [ref](https://en.wikipedia.org/wiki/John_Gall_(author))

The inverse proposition also appears to be true:

>> A complex system designed from scratch *never works* ***and cannot be made to work.***  You have to start over, beginning with a *simple system that works.*

<p>&nbsp;</p>



![smor-sys crdt-cell](https://user-images.githubusercontent.com/185555/211253293-ff5af003-3176-4fbc-93f5-f7d80eee536f.png)




<p>&nbsp;</p>
<p>&nbsp;</p>
<p>&nbsp;</p>

# Development

[![ci(esm)](https://github.com/cellplatform/platform-0.2.0/actions/workflows/node.esm.yml/badge.svg)](https://github.com/cellplatform/platform-0.2.0/actions/workflows/node.esm.yml)

### Primary Global Commands (All Modules)

The following global commands run from the root of the project and operate on all nested
sub-modules of the system within this [monorepo](https://en.wikipedia.org/wiki/Monorepo).

These commands constitute the primary CI (continuous integration) pipeline.
See [github action](https://github.com/cellplatform/platform-0.2.0/actions/workflows/node.esm.yml)
which protects the `main` branch when merging in PRs (pull-requests). 
A security audit on the up-stream dependencies is performed on each CI cycle.


```bash

$ yarn audit     <= security checks
$ yarn build
$ yarn test

```

To run all of these locally within a single command:
```bash
$ yarn ci
```

To see the layout of the module namespace, and related meta-data, run the `list` command:
```bash
$ yarn ls         <= Sorted alphabetically
$ yarn ls --topo  <= Topologically sorted on the module dependency graph (depth-first)
                        
```

The topologically sorted option (`--topo`) shows the build order used when running the compiler over each module (global `yarn build`).

Here the usage of the term "compiler" flexibly maps to any kind of code transpiling activity, from module bundling through to binary compilation (eg, rust/wasm).


![cmd:ls](https://user-images.githubusercontent.com/185555/192442837-debd2c41-b1e8-4c1a-a4d6-1dcbf83173fd.png)





<p>&nbsp;</p>

**NOTES:** the system currently uses [`node.js`](https://nodejs.org/) for build tool-chain bootstrapping only. Once the Typescript compiler 
and ESM module bundler is bootstrapped into existence, the dependency on `node.js` falls away.  Put another way, `node.js` is intentionally not a fundamental dependency (although `node.js` is not going away anytime soon of course). It bootstraps us into the W3C/JS runtimes standard.

There is much healthy innovation emerging around the eco-system of Web standards runtimes outside of the browser (ref [WinterCG](https://wintercg.org/))). Particularly around runtime security properties, and isolated/safe code execution (with pathways to being able to make auditable claims about the security of what code ran, and where, under what contexts).


In the arena of remote code-module execution on either user-controlled machines, or in cloud-like environments, within the runtime context of [Web Standards](https://www.w3.org/standards/) JavaScript/WASM, `deno` has some interesting and important security characteristics that makes it preferable to `node.js`.  In any event, the [module](https://en.wikipedia.org/wiki/Modular_programming)/packaging structure of the system conforms with the open-commons [ECMAScript](https://en.wikipedia.org/wiki/ECMAScript) "ESM [Module](https://hacks.mozilla.org/2018/03/es-modules-a-cartoon-deep-dive/)" standard keeping it flexible to any and all future runtimes that may proliferate around web-standards (eg. [WinterCG](https://wintercg.org/))).


**UI Framework Agnostic:** In the arena of user-interface, particular attention is placed on maintaining a loose coupling with any one UI rendering library.  And UI modules (`system.ui`) are partitioned clearly as distinct to the `pure functional` "logic only" libraries (`system`).  This is because UI invariably tends towards a much higher volatility in technical architecutre over time, and is generally swapped out more frequently over the software lifecycle. Any form of "interface" (the `I` in `API`) tends toward messiness, noise, and complexity - the one involving the "humans" (UI) is especially prone. And down at the straight forward engineering level, much hidden complexity is often lurking in and around UI code.

Organizing for all this is expressed within the distinct folders `/system/` and `/system.ui/` in the code root. The purpose of the `system.ui`'s child-folder structure is to isolate and callout by name each core UI rendering technology of the libraries contained within: `<technology-name>.<lib-name>`, for example:


```
/code/
  |- system/
  |- system.ui/
              |- <type>.*/  <== prefix calls out the particular tech/lib being "ring fenced."
              |- react.*/   <== (libs)
              |- svelte.*/  <== (libs)
```



#### Evolution and Architectural Strategy

This is a general theme of the system, to think of commitments to technology choices in as abstract and forward looking a way as possible.
Obviously to pragamaitcally achieve anything, committments to certain technologies do need to be made in any given moment.  But careful, and sustained
attention while making these kinds of calls can also ensure the long-term time runway, where the "idea" itself remains consistent, but the implementation
choices can be swapped out and evolved over time.  This is the ideal at least; `AND` "reality is a bitch!" and engineering tends to throw up "gnarly problems" on an all too regular basis.  Yet, "evolution" is a messy process, and we find spontaneosly emerging self-cleaning, self-maintaing creative ecosystems right across nature - so this is a feature of reality that can totally be coaxed (encouraged) into stable forms of existence.


<p>&nbsp;</p>

### Development Machine Setup

Development machine [environment setup](docs/env.setup.md) suggestions.

<p>&nbsp;</p>

### Licence Analysis

[![FOSSA Status](https://app.fossa.com/api/projects/custom%2B8499%2Fgithub.com%2Fcellplatform%2Fplatform-0.2.0.svg?type=shield)](https://app.fossa.com/projects/custom%2B8499%2Fgithub.com%2Fcellplatform%2Fplatform-0.2.0?ref=badge_shield)
[![license: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](https://opensource.org/licenses/MIT)

The system (platform) lives as an "open commons" shared resource for the world. As such the core modules of the system are [open source](https://en.wikipedia.org/wiki/Open-source_software) (OSS) and all up-stream dependencies conform with transitively equivalent OSS licences.

In the case of this repo the baseline is the [MIT Licence](LICENSE), and when evolving the licencing strategy through considered refinement over time, will move toward the attractor of "more free" as in individual freedoms ("[libre](https://en.wiktionary.org/wiki/libre)") kind of free.

To run a "licence analysis" and validate the module depenency graph against this principle run:

```bash
$ yarn mit
```

ref: [fossa](https://docs.fossa.com/docs/importing-a-project) configuration docs

[![FOSSA Status](https://app.fossa.com/api/projects/custom%2B8499%2Fgithub.com%2Fcellplatform%2Fplatform-0.2.0.svg?type=large)](https://app.fossa.com/projects/custom%2B8499%2Fgithub.com%2Fcellplatform%2Fplatform-0.2.0?ref=badge_large)

<p>&nbsp;</p>
<p>&nbsp;</p>

# License - [MIT](LICENSE)

For a scintillating break down of this open-source classic, treat yourself to **Kyle E. Mitchell's**  
"[The MIT License line-by-line.](https://writing.kemitchell.com/2016/09/21/MIT-License-Line-by-Line.html) 171 words every programmer should understand."

<p>&nbsp;</p>
