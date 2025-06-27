#!/bin/bash

sleep 10
while true; do
    if [ $(PGPASSWORD="$DATABASE_PASSWORD" psql -tA -h "$DATABASE_HOST" -U "$DATABASE_USERNAME" -d "$DATABASE_NAME" -c "SELECT to_regclass('public.app_task');") = "app_task" ]; then
        PGPASSWORD="$DATABASE_PASSWORD" psql -h "$DATABASE_HOST" -U "$DATABASE_USERNAME" -d "$DATABASE_NAME" -c "
            UPDATE app_task SET \"progressPercentage\"=LEAST(\"progressPercentage\" + floor(random() * 5 + 1), 100) WHERE status=2;
            UPDATE app_task SET status=3, results='These are your results!' WHERE \"progressPercentage\"=100 AND status=2;"
    fi
    sleep 1
done