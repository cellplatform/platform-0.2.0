#!/usr/bin/env ts-node
import { Builder } from './common';

const dir = process.cwd();
Builder.build(dir, { syncDeps: true });
