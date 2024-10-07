/* eslint-disable @typescript-eslint/restrict-template-expressions */
import chalk from 'chalk';
import fs from 'fs';
import insertLine from 'insert-line';
import Listr from 'listr';
import ncp from 'ncp';
import path from 'path';
import { promisify } from 'util';

import { logError } from '@core-utils';

// const modulePath = '/src/modules';
const modulePath = '/src/modules';
const templatePath = '/accelerators/templates/modules';

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
      fs.renameSync(safeJoin, safeJoin.replace('template', name));
    }
  });
}

async function createFolder(options) {
  try {
    if (!fs.existsSync(options.targetDirectory)) {
      fs.mkdirSync(options.targetDirectory);
    }
    fs.mkdirSync(`${options.targetDirectory}/${options.moduleName}`);
  } catch (error) {
    console.error('%s Duplicate Module Name', chalk.red.bold('ERROR'));
    process.exit(1);
  }
}

async function copyTemplateFiles(options) {
  return copy(
    options.templateDirectory,
    options.targetDirectory + '/' + options.moduleName,
    {
      clobber: false,
    }
  );
}

async function addToIndexFile(options) {
  const { targetDirectory, moduleName } = options;
  const module = toPascalCase(capitalizeFirstLetter(moduleName));
  try {
    const indexPath = `${targetDirectory}/index.ts`;
    const indexFileExists = fs.existsSync(indexPath);
    if (!indexFileExists) {
      fs.closeSync(fs.openSync(indexPath, 'w'));
    }
    insertLine(indexPath)
      .prepend(
        `import { ${module}Routes } from '@modules/${moduleName}/navigations/${moduleName}.navigation';`
      )
      .then(function () {
        const content = fs.readFileSync(indexPath, 'utf8');
        let newContent = '';
        if (indexFileExists) {
          newContent = content.replace('};', `  ${module}Routes,\n};`);
        } else {
          newContent = content.concat(`export { ${module}Routes };`);
        }
        fs.writeFile(indexPath, newContent, function (err) {
          if (err) {
            throw err;
          }
        });
      });
  } catch (error) {
    console.error('%s Add Index File Error', chalk.red.bold('ERROR'));
    process.exit(1);
  }
}

async function renameTemplateFiles(options) {
  const { targetDirectory, moduleName } = options;
  const modulePathDir = `${targetDirectory}/${moduleName}`;
  try {
    await renameDirectoryFilesRecursively(modulePathDir, moduleName);
  } catch (error) {
    console.error('%s Rename template File Error', chalk.red.bold('ERROR'));
    process.exit(1);
  }
}

async function addScreenTemplateData(options) {
  const { targetDirectory, moduleName } = options;
  const module = toPascalCase(capitalizeFirstLetter(moduleName));
  const screenFilePath = `${targetDirectory}/${moduleName}/screens/${moduleName}.screen.tsx`;
  try {
    const content = fs.readFileSync(screenFilePath, 'utf8');
    let newContent = '';
    newContent = content
      .replaceAll('ModuleTemplate', `${module}`)
      .replaceAll('template', `${moduleName}`);

    fs.writeFile(screenFilePath, newContent, function (err) {
      if (err) {
        throw err;
      }
    });
  } catch (error) {
    console.error('%s Add template data error', chalk.red.bold('ERROR'));
    process.exit(1);
  }
}

export async function createModule(options) {
  options = {
    ...options,
    targetDirectory: process.cwd() + modulePath,
    templateDirectory: process.cwd() + templatePath,
  };
  try {
    await access(options.templateDirectory, fs.constants.R_OK);
  } catch (err) {
    console.error('%s Invalid template name', chalk.red.bold('ERROR'));
    process.exit(1);
  }
  const moduleCreationTasks = [
    {
      title: 'Creating Module folder',
      task: () => createFolder(options),
    },
    {
      title: 'Copy template files',
      task: () => copyTemplateFiles(options),
    },
    {
      title: 'Inserting into index file',
      task: () => addToIndexFile(options),
    },
    {
      title: 'Rename Template Files',
      task: () => renameTemplateFiles(options),
    },
    {
      title: 'Add Screen Template Data',
      task: () => addScreenTemplateData(options),
    },
  ];
  const tasks = new Listr(moduleCreationTasks, {
    exitOnError: false,
  });
  logError(options);
  await tasks.run();
  logError('%s Module created successfully', chalk.green.bold('DONE'));
  return true;
}
