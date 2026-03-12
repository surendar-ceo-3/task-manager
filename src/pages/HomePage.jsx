import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const TaskTable = ({ tasks, onDelete }) => {
  // Function to check if a task is overdue
  const isOverdue = (dueDate, status) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const taskDate = new Date(dueDate);
    taskDate.setHours(0, 0, 0, 0);
    return taskDate < today && status !== 'completed';
  };

  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow">
      <table className="min-w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Priority</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Due Date</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {tasks.map((task) => {
            const overdue = isOverdue(task.dueDate, task.status);
            
            return (
              <tr key={task.id} className={`hover:bg-gray-50 ${overdue ? 'bg-red-50' : ''}`}>
                <td className={`px-6 py-4 font-medium ${overdue ? 'text-red-600' : ''}`}>
                  {task.title}
                  {overdue && (
                    <span className="ml-2 text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full">
                      ⚠️ Overdue
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 text-gray-600">{task.description}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    task.priority === 'high' ? 'bg-red-100 text-red-600' :
                    task.priority === 'medium' ? 'bg-yellow-100 text-yellow-600' :
                    'bg-green-100 text-green-600'
                  }`}>
                    {task.priority}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={overdue ? 'text-red-600 font-medium' : ''}>
                    {new Date(task.dueDate).toLocaleDateString()}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    task.status === 'completed' ? 'bg-green-100 text-green-600' :
                    task.status === 'in_progress' ? 'bg-blue-100 text-blue-600' :
                    'bg-gray-100 text-gray-600'
                  }`}>
                    {task.status.replace('_', ' ')}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm">
                  <Link 
                    to={`/edit/${task.id}`} 
                    className="text-blue-600 hover:text-blue-800 mr-4 font-medium"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => onDelete(task.id)}
                    className="text-red-600 hover:text-red-800 font-medium"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

const getTasks = () => {
  const tasks = localStorage.getItem('tasks');
  return tasks ? JSON.parse(tasks) : [];
};

const deleteTask = (id) => {
  const tasks = getTasks();
  const filtered = tasks.filter(t => t.id !== id);
  localStorage.setItem('tasks', JSON.stringify(filtered));
};

const HomePage = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    setTasks(getTasks());
  }, []);

  const handleDelete = (id) => {
    if (window.confirm('Are you sure?')) {
      deleteTask(id);
      setTasks(getTasks());
    }
  };

  // Sort tasks: overdue first, then by date
  const sortTasks = (taskArray) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return [...taskArray].sort((a, b) => {
      const aOverdue = new Date(a.dueDate) < today && a.status !== 'completed';
      const bOverdue = new Date(b.dueDate) < today && b.status !== 'completed';
      
      if (aOverdue && !bOverdue) return -1;
      if (!aOverdue && bOverdue) return 1;
      
      return new Date(a.dueDate) - new Date(b.dueDate);
    });
  };

  const filteredTasks = tasks.filter(task =>
    task.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    task.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedAndFilteredTasks = sortTasks(filteredTasks);

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-800 mb-2">📋 Task Manager</h1>
              <p className="text-gray-600">Organize your tasks efficiently</p>
            </div>
            <div className="bg-yellow-100 text-yellow-700 px-4 py-2 rounded-lg text-sm">
              ⚠️ Overdue tasks highlighted in red
            </div>
          </div>
          
          {/* Search + Add Button */}
          <div className="flex gap-4 mb-6">
            <input
              type="text"
              placeholder="🔍 Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button 
              onClick={() => navigate('/create')}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition flex items-center gap-2 whitespace-nowrap"
            >
              <span className="text-xl">+</span> Add Task
            </button>
          </div>

          {/* Tasks or Empty State */}
          {sortedAndFilteredTasks.length > 0 ? (
            <TaskTable tasks={sortedAndFilteredTasks} onDelete={handleDelete} />
          ) : (
            <div className="text-center py-16 bg-gray-50 rounded-lg">
              <p className="text-gray-500 text-2xl mb-4">📭 No tasks found</p>
              <p className="text-gray-400 mb-6">Create your first task to get started!</p>
              <button 
                onClick={() => navigate('/create')}
                className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition flex items-center gap-2 mx-auto"
              >
                <span className="text-xl">+</span> Create First Task
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;