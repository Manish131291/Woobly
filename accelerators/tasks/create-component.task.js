/* eslint-disable @typescript-eslint/restrict-template-expressions */
import chalk from 'chalk';
import fs from 'fs';
import Listr from 'listr';
import ncp from 'ncp';
import path from 'path';
import { promisify } from 'util';

import { logError } from '../src/core-utils/logger.util';

const componentPath = 'src/core-components';
const templatePath = '/accelerators/templates/components';

const access = promisify(fs.access);
const copy = promisify(ncp);

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function clearAndUpper(text) {
  return text.replace(/-/, '').toUpperCase();
}

function toPascalCase(text) {
  return text.replace(/(^\w|-\w)/g, clearAndUpper);
}

async function renameDirectoryFilesRecursively(dir, name) {
  fs.readdirSync(dir).forEach((file) => {
    const safeSuffix = path.normalize(file).replace(/^(\.\.(\/|\\|$))+/, '');
    const safeJoin = path.join(dir, safeSuffix);

    if (fs.statSync(safeJoin).isDirectory())
      return renameDirectoryFilesRecursively(safeJoin, name);
    else {
      const templateIndex = safeJoin.lastIndexOf('template');
      const newPath = `${safeJoin.substring(
        0,
        templateIndex
      )}${name}${safeJoin.substring(templateIndex + 8)}`;
      fs.renameSync(safeJoin, newPath);
    }
  });
}

async function createFolder(options) {
  try {
    if (!fs.existsSync(options.targetDirectory)) {
      fs.mkdirSync(options.targetDirectory, { recursive: true });
    } else {
      fs.mkdirSync(options.targetDirectory);
    }
  } catch (error) {
    console.error('%s Duplicate Component Name', chalk.red.bold('ERROR'));
    process.exit(1);
  }
}

async function copyTemplateFiles(options) {
  return copy(options.templateDirectory, `${options.targetDirectory}`, {
    clobber: false,
  });
}

async function renameTemplateFiles(options) {
  const { targetDirectory } = options;
  try {
    await renameDirectoryFilesRecursively(targetDirectory, options.fileName);
  } catch (error) {
    console.error('%s Rename template File Error', chalk.red.bold('ERROR'));
    process.exit(1);
  }
}

async function updateComponentData(options) {
  const { targetDirectory } = options;
  const componentFilePath = `${targetDirectory}/${options.fileName}.component.tsx`;
  try {
    const content = fs.readFileSync(componentFilePath, 'utf8');
    let newContent = '';
    newContent = content.replaceAll('ComponentFile', options.fileName);

    fs.writeFile(componentFilePath, newContent, function (err) {
      if (err) {
        throw err;
      }
    });
  } catch (error) {
    console.error('%s Update Component data error', chalk.red.bold('ERROR'));
    process.exit(1);
  }
}

async function addToIndexFile(options) {
  const { componentName, fileName, componentType } = options;
  const indexDirectoryPath = `${process.cwd()}/${componentPath}`;
  try {
    const indexPath = `${indexDirectoryPath}/index.ts`;
    const indexFileExists = fs.existsSync(indexPath);
    if (!indexFileExists) {
      fs.closeSync(fs.openSync(indexPath, 'w'));
    }

    fs.appendFile(
      indexPath,
      `export * from './${componentType}/${componentName}/${fileName}.component';\n`,
      function (err) {
        if (err) {
          throw err;
        }
      }
    );
  } catch (error) {
    console.error('%s Add Index File Error', chalk.red.bold('ERROR'));
    process.exit(1);
  }
}

export async function createComponent(options) {
  options = {
    ...options,
    targetDirectory: `${process.cwd()}/${componentPath}/${
      options.componentType
    }/${options.componentName}`,
    templateDirectory: process.cwd() + templatePath,
  };
  const fileName = `${options.prefix}_${toPascalCase(
    capitalizeFirstLetter(options.componentName)
  )}`;
  options.fileName = fileName;
  try {
    await access(options.templateDirectory, fs.constants.R_OK);
  } catch (err) {
    console.error('%s Invalid template name', chalk.red.bold('ERROR'));
    process.exit(1);
  }
  const moduleCreationTasks = [
    {
      title: 'Creating Component folder',
      task: () => createFolder(options),
    },
    {
      title: 'Copy template files',
      task: () => copyTemplateFiles(options),
    },
    {
      title: 'Rename Template Files',
      task: () => renameTemplateFiles(options),
    },
    {
      title: 'Update Template Data',
      task: () => updateComponentData(options),
    },
    {
      title: 'Inserting into index file',
      task: () => addToIndexFile(options),
    },
  ];
  const tasks = new Listr(moduleCreationTasks, {
    exitOnError: false,
  });
  await tasks.run();
  logError('%s Component created successfully', chalk.green.bold('DONE'));
  return true;
}
