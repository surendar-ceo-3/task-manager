const STORAGE_KEY = 'tasks';

export const getTasks = () => {
  const tasks = localStorage.getItem(STORAGE_KEY);
  return tasks ? JSON.parse(tasks) : [];
};

export const saveTasks = (tasks) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
};

export const addTask = (task) => {
  const tasks = getTasks();
  const newTask = {
    ...task,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    completed: false
  };
  tasks.push(newTask);
  saveTasks(tasks);
  return newTask;
};

export const updateTask = (id, updatedTask) => {
  const tasks = getTasks();
  const index = tasks.findIndex(t => t.id === id);
  if (index !== -1) {
    tasks[index] = { ...tasks[index], ...updatedTask };
    saveTasks(tasks);
    return tasks[index];
  }
  return null;
};

export const deleteTask = (id) => {
  const tasks = getTasks();
  const filtered = tasks.filter(t => t.id !== id);
  saveTasks(filtered);
  return filtered;
};

export const getTaskById = (id) => {
  const tasks = getTasks();
  return tasks.find(t => t.id === id);
};