cmake_minimum_required(VERSION 3.16)
project(LovableApp)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

find_package(Qt6 REQUIRED COMPONENTS Core Widgets Network)

set(SOURCES
    src/main.cpp
    src/chat/Chat.cpp
    src/dashboard/Dashboard.cpp
    src/signin/SignIn.cpp
)

add_executable(LovableApp ${SOURCES})

target_include_directories(LovableApp PRIVATE include)
target_link_libraries(LovableApp PRIVATE
    Qt6::Core
    Qt6::Widgets
    Qt6::Network
)