# syntax=docker/dockerfile:1
FROM python:3.11-slim
WORKDIR /app
RUN apt-get update && apt-get install -y postgresql-client
COPY task_runner.sh /app/task_runner.sh
RUN chmod +x /app/task_runner.sh
CMD ["/app/task_runner.sh"]
