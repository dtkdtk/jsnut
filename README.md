# JSNut :: Tool for building native NodeJS modules
What is "JSNut"? JSNut is a NodeJS NUTive module build tool. It is very easy to use: `npx -- @dtkdtk/jsnut build -f ./src/module.cc -o ./dist/ --onlymod` will compile `module.cc` file into a native NodeJS addon (`module.node`), which you can import into your JS code using `require("./module.node")`

# API
- *command* `jsnut`

# Usage
Type `npx @dtkdtk/jsnut help` to get command help.

Type `npx -- @dtkdtk/jsnut build <-f filename> <-o outdir> [-n modname] [--clean|--onlymod]` to compile C++ file

# Example
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