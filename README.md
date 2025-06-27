# Task Management

## App functionality

This app allows you to manage and execute 'tasks', which simulate long-running operations.

In the UI, you can:

- Create a new task, providing a name (required) and description (optional)
- View a sortable list of all tasks, including their status, progress and results
- Edit a task's name or description
- Start, pause, cancel, resume, or delete a task

## How to run

`docker compose up --build`

Making use of multiple Dockerfiles, this should build the entire project, install all dependencies, initialise the database, and get everything up and running!

## Project structure

- `frontend` - The UI code for this app, written in Typescript with Angular. The app consists of one main page, but split into various components for clarity, reusability, and separation of concerns. The service file is the layer which interacts with the backend via http requests.
- `server` - The backend code for this app, written in Python with Django. The key parts here are: the `models` file, which defines how a task will be represented on the backend and in the database; and the `views` file, which contains the logic for all the get/list/create/update/delete endpoints and how they interract with the database.
- `db` - Very simple code to initialise the database table. The initialised table doesn't need to contain all columns, as there is logic in the `compose` file which takes care of updating the database schema when it first runs.
- `task_runner` - A bash script to simulate the progress of a task. Simple but effective, it runs every second, increasing the progress percentage of all running tasks, and completing tasks which reach 100%, adding fake results upon completion.

## Testing

Unfortunately this project does not yet have tests. Of course, if this were real production code, it would have tests!

## Technical decisions

### Languages and technologies

For the frontend, I used the language and framework that I am most familiar with, to aid the speed and quality of my delivery. For the backend, I initially started out using Java with gRPC, as I'm fairly familiar with that and I was keen to have protos that can be compiled for use in the typescript. However, the setup ended up being too complex, so I switched to Python with Django instead, which I have found to be simple and effective.

### Assumptions and limitations

Apart from the items mentioned already (lack of tests and the duplication of object definitions), these are some of the assumptions made when designing and building this app:

- **Amount/size of data** - This app assumes that there are not many tasks, and that those tasks do not contain huge amounts of data.
  - To keep up-to-date on the latest task progress, the frontend continuously polls the server, once per second. This is fine for the purposes of this demo app, but would not be scalable to large amounts of data. To make it scalable, we would need a streaming connection between the BE and the FE.
  - The list request is not paginated, nor is the table on the UI. To scale this app up, pagination would need to be introduced.
- **Security and permissions** - Currently, anyone can access the app, and anyone can make edits. For a larger system, these would need to be considered.
- **Results size** - This layout assumes that the results of a task are small enough to render in the table, perhaps spilling over a few lines. If the results were any larger than this, we should not show them in the table, and should instead let the user click on a table row to view a 'task details' page, which can include more and richer information.
- **Error handling** - The error handling on the backend has fairly good coverage, but there could be more done to handle error states on the UI, e.g. if the data for the table fails to load, or if a dialog fails to update a task.
