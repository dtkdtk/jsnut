//line before includes
#include "app.hh" /* entry point */
#include "ui.hpp"

#include "lib/helpers.h"

#include <boost/algorithm.h>
#include <node.h> //NodeJS v20 API

#include <cstdint>
#include <cstdlib>
#include <iostream>

#ifdef PLATFORM_WIN32
    #include <windows.h>
#endif

#ifdef DEBUG
#include "debug.h"
#endif
//line after includes

//<code...>
//missing endl
