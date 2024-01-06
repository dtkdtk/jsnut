const ansiColors = require("ansi-colors");

exports.unknown_option = `${ansiColors.red(`JSNut: Unknown command or options. Type 'jsnut help' for command help`)}`;

exports.help = `${ansiColors.cyan("JSNut :: Tool for building native NodeJS modules")}\n${ansiColors.bgCyan("COMMAND HELP:")}:
\n${ansiColors.yellow(`jsnut ${ansiColors.greenBright("help")}
+`)} Get help for commands
\n${ansiColors.yellow(`jsnut ${ansiColors.greenBright("sort_includes <...code_dirs>")}
+`)} (experimental) Sort '#include's in the specified directory (see README.md for more information)
  See 
\n${ansiColors.yellow(`jsnut ${ansiColors.greenBright("build")}
| ${ansiColors.greenBright(`-f`)} ${ansiColors.white("<src_file>")} :: ${ansiColors.blackBright("Source file (.cc/.cpp/...) path. CAN BE USED MULTIPLE TIMES")}
| ${ansiColors.greenBright(`-o`)} ${ansiColors.white(`<out_dir>`)} :: ${ansiColors.blackBright("Build directory (e.g. ./dist/ or ../build/)")}
| ${ansiColors.greenBright(`-n`)} ${ansiColors.white("<module_name>")} :: ${ansiColors.blackBright("(OPTIONAL) Name of the compiled file. If not specified, the name of the first specified source code file will be used")}
| ${ansiColors.greenBright(`-l`)} ${ansiColors.white("<package_name>")} :: ${ansiColors.blackBright(`(OPTIONAL) Native api (npm module) that will be required in the binding.gyp file ('nan' or 'node-addon-api'). Default is 'nan'`)}
| ${ansiColors.greenBright(`--clean`)} or ${ansiColors.greenBright(`--onlymod`)} :: ${ansiColors.blackBright("(OPTIONAL) If '--clean' - delete 'build/' directory, else if '--onlymod' - delete 'build/' dir and .vcxproj & .sln files")}
+`)} Build NodeJS native library from '.cc' file
\n${ansiColors.redBright("Important:")} ${ansiColors.white("please read README.md#Guide for the important information.")}`;

exports.unknown_src_path = ansiColors.red(`JSNut :: Error: source file path does not specified or it is invalid`);

exports.unknown_out_path = ansiColors.red(`JSNut :: Error: outdir path does not specified`);

exports.outdir_is_build = ansiColors.yellowBright(`JSNut :: Warning: do not specify the 'build' folder as 'out_dir'. All compiled files can be deleted along with the 'build' directory (if it is in the source code folder)`);

exports.binding_and_pkgjson_files_created = ansiColors.cyan("JSNut :: binding.gyp & package.json files created successfully");

exports.fixed_vcxproj = ansiColors.cyan("JSNut :: Successful patch of .vcxproj file");

exports.clean_mode = ansiColors.cyan("JSNut :: Running the clean mode...");

exports.onlymod_mode = ansiColors.cyan("JSNut :: Running the onlymod mode...");

exports.success = ansiColors.cyan("JSNut :: Successful build");



//TOOLS:
//sort_includes
exports.sort_includes__proccessing = ansiColors.cyan("JSNut :: Sorting the includes...");

exports.sort_includes__success = ansiColors.cyan("JSNut :: Includes successfully sorted");

exports.sort_includes__comments_warning = file_path => ansiColors.yellowBright("JSNut :: Warning: comments may be cut (because they are in the '#include's block). File:\n") + ansiColors.yellowBright("| ") + ansiColors.blackBright(file_path);