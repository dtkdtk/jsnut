# JSNut :: Tool for building native NodeJS modules
What is "JSNut"? JSNut is a NodeJS NUTive module build tool. It is very easy to use: `npx -- @dtkdtk/jsnut build -f ./src/module.cc -o ./dist/ --onlymod` will compile `module.cc` file into a native NodeJS addon (`module.node`), which you can import into your JS code using `require("./module.node")`

# API
- *command* `jsnut`

# Features
- Auto-generation of `package.json` and `binding.gyp` files
- Configurable output directory and output file name
- [`sort_includes`](#about-the-includes-sorting) tool [experimental]

# Usage
Type `npx @dtkdtk/jsnut help` to get command help.

Type `npx -- @dtkdtk/jsnut build <-f filename> <-o outdir> [-n modname] [--clean|--onlymod]` to compile C++ file

# Example
> [!IMPORTANT]\
> `using namespace STH;` in any file causes compilation errors. Please use STH::... instead.

`src/module.cc`
```cpp
#include <nan.h>
#include <iostream>
#include "otherfile.hh"

#define MODULE_NAME some_code

void do_nothing(const Nan::FunctionCallbackInfo<v8::Value>& info)
{
    std::cout   << "nothing and "
                << otherfile_function()
                << std::endl;
}

void MODULE_INIT(v8::Local<v8::Object> exports)
{
	auto context = exports->GetCreationContextChecked();
	exports->Set(
		context,
		Nan::New("do_nothing").ToLocalChecked(),
		Nan::New<v8::FunctionTemplate>(do_nothing)->GetFunction(context).ToLocalChecked()
	);
}

NODE_MODULE(MODULE_NAME, MODULE_INIT)
```
`src/otherfile.hh`
```cpp
int otherfile_function();
```
`src/otherfile.cc`
```cpp
#include "otherfile.hh"
int otherfile_function()
{
    return 7;
}
```
`./build-native-addons.bash`
```bash
#!/usr/bin/env bash
#Warning: it calculates the path to the files from package.json
npx -- @dtkdtk/jsnut build  \
    -f "./src/module.cc"    \
    -f "./src/otherfile.hh" \
    -f "./src/otherfile.cc" \
    -o "./dist"             \
    --clean;
sleep 10s
```
Result: (file tree)
- `src/`
- - `otherfile.cc`
- - `otherfile.hh`
- - `module.cc`
- `dist/`
- - `module.node` (first specified source file name)
- - `module.sln`
- - `module.vcxproj`

# About the '#include's sorting
> [!WARNING]\
> This feature is experimental and uncompleted (and so unperfect). Use at your own risk

To sort, use the `jsnut sort_includes <...src_dirs>` command

`#include` directives are sorted as follows:
1. Your project headers (`"ui/app.h"`)
2. Extern libraries (must contain `/` or `.`) (`<node.h>`)
> [!NOTE]\
> Standard C headers are into this category
3. Your libraries (must be in the "lib" directory) (`"lib/api.h"`)
4. Standart C++ headers (without `.h` extension) (`<iostream>`)
There is an empty line between categories.
The order was borrowed from Google, but with some changes.

> [!WARNING]\
> The tool will remove any not-multiline comments in the '#include's block. Please put them rather (or later) than '#include' directives