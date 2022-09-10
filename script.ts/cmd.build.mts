#!/usr/bin/env ts-node
import { Builder } from './common/index.mjs';

const dir = process.cwd();
Builder.build(dir);
