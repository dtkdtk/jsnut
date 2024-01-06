//line before includes
#include <iostream>
#include "app.hh" /* entry point */
#include <cstdlib>
#include <node.h> //NodeJS v20 API
#include <boost/algorithm.h>
#include "ui.hpp"
#include "lib/helpers.h"
#include <cstdint>

#ifdef PLATFORM_WIN32
    #include <windows.h>
#endif

#ifdef DEBUG
#include "debug.h"
#endif
//line after includes

//<code...>
//missing endl