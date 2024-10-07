/* eslint-disable @typescript-eslint/restrict-template-expressions */
import arg from 'arg';
import chalk from 'chalk';
import inquirer from 'inquirer';

import { createComponent } from '../tasks/create-component.task';

function parseArgumentsIntoOptions(rawArgs) {
  const args = arg(
    {
      '--git': Boolean,
      '--skip': Boolean,
      '--install': Boolean,
      '-g': '--git',
      '-s': '--skip',
      '-i': '--install',
      '--pre': String,
    },
    {
      argv: rawArgs.slice(2),
    }
  );
  return {
    skipPrompts: args['--yes'] || false,
    git: args['--git'] || false,
    componentName: args._[0],
    runInstall: args['--install'] || false,
    prefix: args['--pre'] || 'IG',
  };
}

async function promptForMissingOptions(options) {
  const defaultComponentName = 'component';
  if (options.skipPrompts) {
    return {
      ...options,
      template: options.componentName || defaultComponentName,
    };
  }
  const questions = [];
  if (!options.componentName) {
    questions.push(
      {
        type: 'input',
        name: 'componentName',
        message: 'Enter component name',
      },
      {
        type: 'list',
        name: 'componentType',
        message: 'What is the type of your component?',
        choices: ['atoms', 'molecules', 'organisms', 'templates'],
      }
    );
  }

  const answers = await inquirer.prompt(questions);
  if (
    answers.componentName.includes('-') ||
    !answers.componentName.includes(' ')
  ) {
    return {
      ...options,
      componentType: answers.componentType,
      componentName: answers.componentName
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
    await createComponent(options);
  } else {
    console.error(
      `Please enter a valid component name. Allowed name formats are ${chalk.red.bold(
        'modulename'
      )} or ${chalk.red.bold('component-name')}`
    );
  }
}
