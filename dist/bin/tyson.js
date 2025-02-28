"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTemplateFiles = getTemplateFiles;
exports.getAvailablePresets = getAvailablePresets;
exports.askUser = askUser;
const yargs_1 = __importDefault(require("yargs/yargs"));
const helpers_1 = require("yargs/helpers");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const readline = __importStar(require("node:readline/promises"));
const node_process_1 = require("node:process");
const packageJsonPath = path_1.default.join(__dirname, "../../package.json");
const { name, version, description } = JSON.parse(fs_1.default.readFileSync(packageJsonPath, "utf-8"));
function getTemplateFiles(directory) {
    const files = fs_1.default.readdirSync(directory);
    return files
        .filter((file) => path_1.default.extname(file).toLowerCase() === ".template")
        .map((file) => path_1.default.join(directory, file));
}
function getAvailablePresets(presetsDirectory = null) {
    presetsDirectory =
        presetsDirectory || path_1.default.join(__dirname, "../../", "presets");
    const files = fs_1.default.readdirSync(presetsDirectory);
    if (!files.length) {
        throw new Error(`No preset directories found in ${presetsDirectory}`);
    }
    return files
        .filter((file) => fs_1.default.statSync(path_1.default.join(presetsDirectory, file)).isDirectory())
        .reduce((acc, file) => {
        const fullPath = path_1.default.join(presetsDirectory, file);
        acc[file] = getTemplateFiles(fullPath);
        return acc;
    }, {});
}
async function askUser(question, defaultValue = "") {
    const rl = readline.createInterface({ input: node_process_1.stdin, output: node_process_1.stdout });
    const answer = await rl.question(question.trim() + " ");
    return answer.trim() || defaultValue;
}
async function initWebpackConfig(preset, force) {
    const availablePresets = getAvailablePresets();
    const availablePresetNames = Object.keys(availablePresets);
    if (!preset) {
        preset = "example";
    }
    else if (!availablePresetNames.includes(preset)) {
        console.error(`Preset ${preset} is not available. Available presets: ${availablePresetNames.join(", ")}`);
        process.exit(1);
    }
    const currentWorkingDir = process.cwd();
    const templateVars = {
        namespace: await askUser("What is the namespace you would like to use?", path_1.default.basename(currentWorkingDir)),
    };
    console.log(`Scaffolding files for preset ${preset} ...`);
    for (const templateFile of availablePresets[preset]) {
        let compiled = fs_1.default.readFileSync(templateFile)?.toString("utf-8");
        for (const [key, value] of Object.entries(templateVars)) {
            compiled = compiled.replaceAll(`%${key}%`, value);
        }
        const destinationFile = path_1.default.join(process.cwd(), path_1.default.basename(templateFile.replace(/\.template$/, "")));
        // If the file to write already exists, do not overwrite the existing file, but write the content STDOUT.
        if (fs_1.default.existsSync(destinationFile)) {
            console.warn(`Destination file already exists: ${destinationFile}, --force|-f not used: the file will be NOT overwritten.`);
            console.log(`=== ${destinationFile} contents\n${compiled}\n===\n`);
            continue;
        }
        fs_1.default.writeFileSync(destinationFile, compiled);
        console.log(`${destinationFile} written`);
    }
    console.log(`Custom configuration created with preset: ${preset}`);
}
console.log(`${name} v${version}\n${description}\n`);
const argv = (0, yargs_1.default)((0, helpers_1.hideBin)(process.argv))
    .scriptName("tyson")
    .command("init [--preset|-p <preset>] [--force]", "Initialize a custom webpack.config.js file.", (yargs) => {
    return yargs
        .option("preset", {
        alias: "p",
        describe: "Configuration preset to use",
        type: "string",
        choices: Object.keys(getAvailablePresets()),
    })
        .option("force", {
        alias: "f",
        describe: "Force overwrite of existing webpack.config.js file.",
        type: "boolean",
        default: false,
    });
}, (argv) => initWebpackConfig(argv.preset, argv.force).then(() => process.exit(0)))
    .command("preset-list", "List available configuration presets.", (yargs) => { }, () => console.log(`Available presets: ${Object.keys(getAvailablePresets()).join(", ")}`))
    .option("help", {
    alias: "h",
    describe: "Show help",
    type: "boolean",
})
    .demandCommand(1, "You need to specify a command. Use --help for more information.").argv;
