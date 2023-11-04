#include <nan.h>
#include <iostream>
#include "otherfile.hh"

#define MODULE_NAME some_code

unsigned short __call_index = 0;

void native_fragments(const Nan::FunctionCallbackInfo<v8::Value>& info)
{
	if (false) {}
    else if (__call_index == 0)
    {
        std::cout << "nothing and " << otherfile_function() << std::endl;
        __call_index++;
    }
}

void MODULE_INIT(v8::Local<v8::Object> exports)
{
	auto context = exports->GetCreationContextChecked();
	exports->Set(
		context,
		Nan::New("__call_native").ToLocalChecked(),
		Nan::New<v8::FunctionTemplate>(native_fragments)->GetFunction(context).ToLocalChecked()
	);
}

NODE_MODULE(MODULE_NAME, MODULE_INIT)