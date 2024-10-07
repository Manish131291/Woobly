/* eslint-disable @typescript-eslint/restrict-template-expressions */
import arg from 'arg';
import chalk from 'chalk';
import { FontAssetType, generateFonts, OtherAssetType } from 'fantasticon';
import fs from 'fs';

import { logError } from '../src/core-utils/logger.util';

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

async function createFolder(dir) {
  try {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  } catch (error) {
    console.error('%s Output dir not created', chalk.red.bold('ERROR'));
    process.exit(1);
  }
}

async function generateIconFont(options) {
  try {
    await createFolder(options.outputDir);
    let existCodepoints = {};
    if (fs.existsSync(`${options.outputDir}/icons.json`)) {
      existCodepoints = require('../../fonts/icons.json');
    }
    const fonts = await generateFonts({
      name: 'icons',
      inputDir: options.inputDir, // (required)
      outputDir: options.outputDir, // (required)
      fontTypes: [
        FontAssetType.TTF,
        FontAssetType.EOT,
        FontAssetType.WOFF2,
        FontAssetType.WOFF,
      ],
      assetTypes: [
        OtherAssetType.CSS,
        OtherAssetType.HTML,
        OtherAssetType.JSON,
      ],
      formatOptions: { json: { indent: 2 } },
      templates: {},
      pathOptions: {},
      codepoints: existCodepoints,
      fontHeight: 600,
      round: undefined, // --
      descent: undefined, // Will use `svgicons2svgfont` defaults
      normalize: true, // --
      selector: null,
      tag: 'i',
      prefix: 'icon',
    });
    logError(fonts);
    // copy font files
    const fontFiles = ['icons.ttf', 'icons.eot', 'icons.woff', 'icons.woff2'];
    for (const file of fontFiles) {
      fs.copyFileSync(
        `${options.outputDir}/${file}`,
        `${options.destFontDir}/fonts/${file}`
      );
    }
    // copy css content
    fs.copyFileSync(
      `${options.outputDir}/icons.css`,
      `${options.destFontDir}/_fonts.scss`
    );

    // update font file location in css
    const content = fs.readFileSync(
      `${options.destFontDir}/_fonts.scss`,
      'utf8'
    );
    let newContent = '';
    newContent = content.replaceAll('./icons', './fonts/icons');

    fs.writeFileSync(
      `${options.destFontDir}/_fonts.scss`,
      newContent,
      function (err) {
        if (err) {
          throw err;
        }
      }
    );
  } catch (err) {
    logError(err);
  }
}

export async function cli(args) {
  const options = parseArgumentsIntoOptions(args);
  options.inputDir = `${process.cwd()}/src/assets/icons`;
  options.outputDir = `${process.cwd()}/fonts`;
  options.destFontDir = `${process.cwd()}/src/styles/base`;
  await generateIconFont(options);
}
