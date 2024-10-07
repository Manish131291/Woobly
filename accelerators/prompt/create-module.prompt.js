/* eslint-disable @typescript-eslint/restrict-template-expressions */
import arg from 'arg';
import chalk from 'chalk';
import inquirer from 'inquirer';

import { createModule } from '../tasks/create-module.task';

function parseArgumentsIntoOptions(rawArgs) {
  const args = arg(
    {
      '--git': Boolean,
      '--skip': Boolean,
      '--install': Boolean,
      '-g': '--git',
      '-s': '--skip',
      '-i': '--install',
    },
    {
      argv: rawArgs.slice(2),
    }
  );
  return {
    skipPrompts: args['--yes'] || false,
    git: args['--git'] || false,
    moduleName: args._[0],
    runInstall: args['--install'] || false,
  };
}

async function promptForMissingOptions(options) {
  const defaultModuleName = 'module';
  if (options.skipPrompts) {
    return {
      ...options,
      template: options.moduleName || defaultModuleName,
    };
  }
  const questions = [];
  if (!options.moduleName) {
    questions.push({
      type: 'input',
      name: 'moduleName',
      message: 'Enter module name',
    });
  }

  const answers = await inquirer.prompt(questions);
  if (answers.moduleName.includes('-') || !answers.moduleName.includes(' ')) {
    return {
      ...options,
      moduleName: answers.moduleName
        .split('-')
        .map((part) => part.toLowerCase())
        .join('-'),
    };
  }
}

export async function cli(args) {
  let options = parseArgumentsIntoOptions(args);
  options = await promptForMissingOptions(options);
  if (options !== undefined) {
    await createModule(options);
  } else {
    console.error(
      `Please enter a valid module name. Allowed name formats are ${chalk.red.bold(
        'modulename'
      )} or ${chalk.red.bold('module-name')}`
    );
  }
}
