#!/bin/bash

# If the database table exists, then:
# - Increase all running tasks' progress by 1 to 5 percent (randomly), capped at 100%.
# - Set all tasks that have just reached 100% to have 'completed' status and some fake results.
sleep 10
while true; do
    if [ $(PGPASSWORD="$DATABASE_PASSWORD" psql -tA -h "$DATABASE_HOST" -U "$DATABASE_USERNAME" -d "$DATABASE_NAME" -c "SELECT to_regclass('public.app_task');") = "app_task" ]; then
        PGPASSWORD="$DATABASE_PASSWORD" psql -h "$DATABASE_HOST" -U "$DATABASE_USERNAME" -d "$DATABASE_NAME" -c "
            UPDATE app_task SET \"progressPercentage\"=LEAST(\"progressPercentage\" + floor(random() * 5 + 1), 100) WHERE status=2;
            UPDATE app_task SET status=3, results='These are your results!' WHERE \"progressPercentage\"=100 AND status=2;"
    fi
    sleep 1
done