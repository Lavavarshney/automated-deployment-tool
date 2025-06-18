#!/usr/bin/env node
import { program } from 'commander';
import chalk from 'chalk';
import deploy from './deploy.js'; // make sure deploy.js is also an ES module

program
  .command('start')
  .description('Start automated deployment')
  .action(() => {
    console.log(chalk.blue("🚀 Starting deployment..."));
    deploy();
  });

program.parse(process.argv);

