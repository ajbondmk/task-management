bazel build //:task_management_server_deploy.jar
cp -u bazel-bin/task_management_server_deploy.jar server.jar