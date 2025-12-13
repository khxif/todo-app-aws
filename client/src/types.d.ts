type Task = {
  id: number;
  todo: string;
};

type TaskState = {
  todos: Task[];
  inProgress: Task[];
  done: Task[];
};

interface User {
  name: string;
  email: string;
  picture: string;
}
