import yargs from "yargs/yargs";
import { hideBin } from "yargs/helpers";
import fs from "fs";
import path from "path";
import { terminalWidth } from "yargs";
import * as readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";

const packageJsonPath = path.join(__dirname, "../../package.json");
const { name, version, description } = JSON.parse(
  fs.readFileSync(packageJsonPath, "utf-8"),
);

export function getTemplateFiles(directory: string): string[] {
  const files = fs.readdirSync(directory);
  return files
    .filter((file) => path.extname(file).toLowerCase() === ".template")
    .map((file) => path.join(directory, file));
}

export function getAvailablePresets(presetsDirectory: string | null = null): {
  [key: string]: string[];
} {
  presetsDirectory =
    presetsDirectory || path.join(__dirname, "../../", "presets");
  const files = fs.readdirSync(presetsDirectory);
  if (!files.length) {
    throw new Error(`No preset directories found in ${presetsDirectory}`);
  }
  return files
    .filter((file) =>
      fs.statSync(path.join(presetsDirectory, file)).isDirectory(),
    )
    .reduce(
      (acc, file) => {
        const fullPath = path.join(presetsDirectory, file);
        acc[file] = getTemplateFiles(fullPath);
        return acc;
      },
      {} as { [key: string]: string[] },
    );
}

export async function askUser(
  question: string,
  defaultValue: string = "",
): Promise<string> {
  const rl = readline.createInterface({ input, output });
  const answer: string = await rl.question(question.trim() + " ");
  return answer.trim() || defaultValue;
}

async function initWebpackConfig(
  preset: string,
  force: boolean,
): Promise<void> {
  const availablePresets = getAvailablePresets();
  const availablePresetNames = Object.keys(availablePresets);

  if (!preset) {
    preset = "example";
  } else if (!availablePresetNames.includes(preset)) {
    console.error(
      `Preset ${preset} is not available. Available presets: ${availablePresetNames.join(", ")}`,
    );
    process.exit(1);
  }

  const currentWorkingDir = process.cwd();

  const templateVars: { [key: string]: string } = {
    namespace: await askUser(
      "What is the namespace you would like to use?",
      path.basename(currentWorkingDir),
    ),
  };

  console.log(`Scaffolding files for preset ${preset} ...`);

  for (const templateFile of availablePresets[preset]) {
    let compiled = fs.readFileSync(templateFile)?.toString("utf-8");
    for (const [key, value] of Object.entries(templateVars)) {
      compiled = compiled.replaceAll(`%${key}%`, value);
    }

    const destinationFile = path.join(
      process.cwd(),
      path.basename(templateFile.replace(/\.template$/, "")),
    );

    // If the file to write already exists, do not overwrite the existing file, but write the content STDOUT.
    if (fs.existsSync(destinationFile)) {
      console.warn(
        `Destination file already exists: ${destinationFile}, --force|-f not used: the file will be NOT overwritten.`,
      );
      console.log(`=== ${destinationFile} contents\n${compiled}\n===\n`);
      continue;
    }

    fs.writeFileSync(destinationFile, compiled);

    console.log(`${destinationFile} written`);
  }

  console.log(`Custom configuration created with preset: ${preset}`);
}

console.log(`${name} v${version}\n${description}\n`);

const argv = yargs(hideBin(process.argv))
  .command(
    "init [--preset|-p <preset>] [--force]",
    "Initialize a custom webpack.config.js file.",
    (yargs) => {
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
    },
    (argv) =>
      initWebpackConfig(argv.preset, argv.force).then(() => process.exit(0)),
  )
  .command(
    "preset-list",
    "List available configuration presets.",
    (yargs) => {},
    () =>
      console.log(
        `Available presets: ${Object.keys(getAvailablePresets()).join(", ")}`,
      ),
  )
  .option("help", {
    alias: "h",
    describe: "Show help",
    type: "boolean",
  })
  .wrap(terminalWidth())
  .demandCommand(
    1,
    "You need to specify a command. Use --help for more information.",
  ).argv;
