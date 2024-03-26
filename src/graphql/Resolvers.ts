const fs = require("fs");

const resolvers = {
  Query: {
    columns: () => {
      const Columns = getColumns();
      const Tasks = getTasks();
      const columns = Columns.map((column: any) => {
        column.tasks = Tasks.filter((task: any) => task.columnId == column.id);
        return column;
      });
      return columns;
    },

    tasks: () => {
      const tasks = getTasks();
      return tasks;
    },
  },

  Mutation: {
    createColumn: (_: any, data: any) => {
      const Columns = getColumns();
      const { columnName } = data;
      const newColumn = {
        name: columnName,
        id: `${Columns.length + 1}${Math.random() * 100}`,
        tasks: [],
      };

      Columns.push(newColumn);
      writeColumns(Columns);
      return newColumn;
    },

    renameColumn: (_: any, data: any) => {
      const { newName, columnId } = data;
      const columns = getColumns();
      const columnIndex = columns.findIndex((col: any) => col.id == columnId);
      if (columnIndex > -1) {
        columns[columnIndex].name = newName;
      }
      writeColumns(columns);
      return columns[columnIndex];
    },

    clearColumn: (_: any, data: any) => {
      const { columnId } = data;
      const tasks = getTasks();
      const newTasks = tasks.filter((task: any) => task.columnId != columnId);
      writeTasks(newTasks);

      return "Column cleared success";
    },

    deleteColumn: (_: any, data: any) => {
      const { columnId } = data;
      const columns = getColumns();
      const newColumns = columns.filter((col: any) => col.id != columnId);
      writeColumns(newColumns);
      return "Column deleted success";
    },

    createTask: (_: any, data: any) => {
      const { columnId, taskName } = data;
      const tasks = getTasks();
      const newTask = {
        name: taskName,
        id: `${tasks.length + 1}${Math.random() * 100}`,
        columnId: columnId,
      };
      tasks.push(newTask);

      writeTasks(tasks);
      return newTask;
    },

    deleteTask: (_: any, data: any) => {
      const { taskId } = data;
      const tasks = getTasks();
      const newTasks = tasks.filter((task: any) => task.id != taskId);
      writeTasks(newTasks);
      return "Task deleted success";
    },

    moveTask: (_: any, data: any) => {
      const { newColumnId, taskId } = data;
      const tasks = getTasks();
      const taskToMoveIndx = tasks.findIndex((task: any) => task.id == taskId);

      tasks[taskToMoveIndx].columnId = newColumnId;
      writeTasks(tasks);

      return tasks[taskToMoveIndx];
    },
  },
};

const getColumns = () => {
  const columnsJSONString = fs.readFileSync(
    `${process.cwd()}/src/data/Columns.json`
  );
  const Columns = JSON.parse(columnsJSONString || "[]");
  return Columns;
};

const getTasks = () => {
  const tasksJSONString = fs.readFileSync(
    `${process.cwd()}/src/data/Tasks.json`
  );
  const Tasks = JSON.parse(tasksJSONString || "[]");
  return Tasks;
};

const writeColumns = (Columns: []) => {
  fs.writeFileSync(
    `${process.cwd()}/src/data/Columns.json`,
    JSON.stringify(Columns),
    "utf8"
  );
};

const writeTasks = (Tasks: []) => {
  fs.writeFileSync(
    `${process.cwd()}/src/data/Tasks.json`,
    JSON.stringify(Tasks),
    "utf8"
  );
};

export default resolvers;