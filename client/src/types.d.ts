type Task = {
  id: number;
  todo: string;
};

type TaskState = {
  todos: Task[];
  inProgress: Task[];
  done: Task[];
};
