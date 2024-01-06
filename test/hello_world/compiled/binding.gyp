{
    "variables": {
        "module_name%": "some_code",
        "module_path%": "./test/hello_world/some_code.cc"
    },
    "targets": [{
        "target_name": "some_code",
        "sources": [ "some_code.cc", "otherfile.cc", "otherfile.hh" ],
        "include_dirs": [ "<!(node -e \"require('nan').include\")" ]
    }]
}