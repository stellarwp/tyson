import yargs from 'yargs/yargs';
import {hideBin} from 'yargs/helpers';
import fs from 'fs';
import path from 'path';
import {terminalWidth} from 'yargs';

const packageJsonPath = path.join(__dirname, '../../package.json');
const {name, version, description} = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));

// Hard-coded available presets
const availablePresets = ['TEC'];

// Function to initialize webpack.config.js with a preset
function initWebpackConfig(preset: string | null, force: boolean): void {
    if (!preset) {
        preset = 'Example';
    } else if (!availablePresets.includes(preset)) {
        console.error(`Preset ${preset} is not available. Available presets: ${availablePresets.join(', ')}`);
        process.exit(1);
    }

    const templatePath = path.join(__dirname, `../templates/${preset}.webpack.config.js`);
    const webpackConfigPath = path.join(process.cwd(), 'webpack.config.js');
    const generatedFileContents = fs.readFileSync(templatePath, 'utf-8');

    if (fs.existsSync(webpackConfigPath) && !force) {
        console.warn('A webpack.config.js file already exists in the current directory, and --force was not specified.');
        console.log('Here are the generated contents:\n');
        console.log(generatedFileContents);
        return;
    }

    fs.writeFileSync('webpack.config.js', generatedFileContents);
    console.log(`Custom webpack.config.js created with preset: ${preset || 'Example'}`);
}

console.log(`${name} v${version}\n${description}\n`);

const argv = yargs(hideBin(process.argv)).command(
    'init [--preset|-p <preset>] [--force]',
    'Initialize a custom webpack.config.js file.',
    yargs => {
        return yargs.option('preset', {
            alias: 'p',
            describe: 'Configuration preset to use',
            type: 'string',
            choices: availablePresets,
        }).option('force', {
            alias: 'f',
            describe: 'Force overwrite of existing webpack.config.js file.',
            type: 'boolean',
            default: false,
        });
    },
    argv => initWebpackConfig(argv.preset, argv.force),
).command(
    'preset-list',
    'List available configuration presets.',
    yargs => {
    },
    () => console.log(`Available presets: ${availablePresets.join(', ')}`),
).option('help', {
    alias: 'h',
    describe: 'Show help',
    type: 'boolean',
}).wrap(terminalWidth()).demandCommand(1, 'You need to specify a command. Use --help for more information.').argv;
