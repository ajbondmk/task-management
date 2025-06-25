load("@rules_java//java:java_library.bzl", "java_library")
load("@rules_java//java:java_binary.bzl", "java_binary")
load("@protobuf//bazel:proto_library.bzl", "proto_library")
load("@protobuf//bazel:java_proto_library.bzl", "java_proto_library")
load("@rules_proto_grpc_java//:java_grpc_compile.bzl", "java_grpc_compile")
load("@rules_proto_grpc_java//:java_grpc_library.bzl", "java_grpc_library")

proto_library(
    name = "tasks_proto",
    srcs = ["tasks.proto"],
)

java_grpc_library(
    name = "tasks_java_grpc",
    protos = [":tasks_proto"],
)

java_binary(
    name = "task_management_server",
    main_class = "taskmanagement.TaskManagementServer",
    srcs = ["TaskManagementServer.java"],
    deps = [
        "@protobuf//:protobuf_java",
        "@protobuf//:protobuf_java_util",
        "@io_grpc_grpc_java//api",
        "@io_grpc_grpc_java//protobuf",
        "@io_grpc_grpc_java//stub",
        ":tasks_java_grpc",
    ],
)


