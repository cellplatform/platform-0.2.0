#!/usr/bin/env ts-node

import * as fs from 'fs';
import * as fsPath from 'path';

const renameMtsToTs = (dir: string): void => {
  // Exclude directories
  const excludeDirs = ['node_modules', 'dist', '_archive'];

  // Get all files and directories in the current directory
  const items = fs.readdirSync(dir);

  for (const item of items) {
    const fullPath = fsPath.join(dir, item);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      // If item is a directory and not in the exclude list, recurse
      if (!excludeDirs.includes(item)) {
        renameMtsToTs(fullPath);
      }
    } else if (stat.isFile() && fsPath.extname(item) === '.mts') {
      // If item is a file with .mts extension, rename it to .ts
      const newFilePath = fullPath.replace(/\.mts$/, '.ts');

      const localpath = (path: string) => path.substring(dir.length);
      // fs.renameSync(fullPath, newFilePath);
      console.log(`RENAMED: ${localpath(fullPath)}    TO    ${localpath(newFilePath)}`);
    }
  }
};

// Usage: Call the function with the path of the monorepo
renameMtsToTs(fsPath.resolve('.'));
