import { FileCallbackArguments } from "./FileCallbackArguments";
import { ExposeCallbackArguments } from "./ExposeCallbackArguments";
import { WebPackConfiguration } from "./WebPackConfiguration";

export interface ConfigurationSchema {
  /**
   * The file extensions to match.
   */
  fileExtensions: string[];

  /**
   * The namespace to use for the schema. If not provided, defaults to "tec".
   */
  namespace?: string | string[];

  /**
   * Function to match specific files.
   */
  fileMatcher: (args: FileCallbackArguments) => boolean;

  /**
   * Function to generate the entry point name based on file path.
   */
  entryPointName: (args: FileCallbackArguments) => string;

  /**
   * Function to dynamically build the window expose path.
   */
  expose?: (args: ExposeCallbackArguments) => string | false;

  /**
   * Function to modify the webpack configuration.
   */
  modifyConfig?: (config: WebPackConfiguration) => void;
}
