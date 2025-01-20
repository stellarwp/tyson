"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const yargs_1 = __importDefault(require("yargs/yargs"));
const helpers_1 = require("yargs/helpers");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const yargs_2 = require("yargs");
const packageJsonPath = path_1.default.join(__dirname, '../../package.json');
const { name, version, description } = JSON.parse(fs_1.default.readFileSync(packageJsonPath, 'utf-8'));
// Hard-coded available presets
const availablePresets = ['TEC'];
// Function to initialize webpack.config.js with a preset
function initWebpackConfig(preset, force) {
    if (!preset) {
        preset = 'Example';
    }
    else if (!availablePresets.includes(preset)) {
        console.error(`Preset ${preset} is not available. Available presets: ${availablePresets.join(', ')}`);
        process.exit(1);
    }
    const templatePath = path_1.default.join(__dirname, `../templates/${preset}.webpack.config.js`);
    const webpackConfigPath = path_1.default.join(process.cwd(), 'webpack.config.js');
    const generatedFileContents = fs_1.default.readFileSync(templatePath, 'utf-8');
    if (fs_1.default.existsSync(webpackConfigPath) && !force) {
        console.warn('A webpack.config.js file already exists in the current directory, and --force was not specified.');
        console.log('Here are the generated contents:\n');
        console.log(generatedFileContents);
        return;
    }
    fs_1.default.writeFileSync('webpack.config.js', generatedFileContents);
    console.log(`Custom webpack.config.js created with preset: ${preset || 'Example'}`);
}
console.log(`${name} v${version}\n${description}\n`);
const argv = (0, yargs_1.default)((0, helpers_1.hideBin)(process.argv)).command('init [--preset|-p <preset>] [--force]', 'Initialize a custom webpack.config.js file.', yargs => {
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
}, argv => initWebpackConfig(argv.preset, argv.force)).command('preset-list', 'List available configuration presets.', yargs => {
}, () => console.log(`Available presets: ${availablePresets.join(', ')}`)).option('help', {
    alias: 'h',
    describe: 'Show help',
    type: 'boolean',
}).wrap((0, yargs_2.terminalWidth)()).demandCommand(1, 'You need to specify a command. Use --help for more information.').argv;
