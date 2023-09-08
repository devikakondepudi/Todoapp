
import React, { useState, useEffect } from 'react';
import './Todo.css';

const TodoApplication = () => {
  // State variables with custom names
  const [customTasks, setCustomTasks] = useState([]);
  const [customNewTask, setCustomNewTask] = useState('');
  const [customTaskFilter, setCustomTaskFilter] = useState('all');
  const [customErrorMessage, setCustomErrorMessage] = useState('');

  // Fetch tasks from the API when the component mounts
  useEffect(() => {
    fetchTasks();
  }, []);

  // Fetch tasks from the API endpoint
  const fetchTasks = async () => {
    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/users/1/todos');
      const data = await response.json();
      setCustomTasks(data);
    } catch (error) {
      console.log('Error fetching tasks:', error);
    }
  };

  // Add a new task to the list
  const addTask = () => {
    if (customNewTask.trim() !== '') {
      const newTask = {
        id: Date.now(),
        title: customNewTask,
        completed: false
      };
      setCustomTasks([newTask, ...customTasks]);
      setCustomNewTask('');
      setCustomErrorMessage(''); // Clear the error message
    } else {
      setCustomErrorMessage('Task should not be empty');
    }
  };

  // Toggle the completion status of a task
  const toggleTaskCompletion = (id) => {
    const updatedTasks = customTasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    );
    setCustomTasks(updatedTasks);
  };

  // Edit the title of a task
  const editTask = (id, newTitle) => {
    const updatedTasks = customTasks.map(task =>
      task.id === id ? { ...task, title: newTitle } : task
    );
    setCustomTasks(updatedTasks);
  };

  // Delete a task from the list
  const deleteTask = (id) => {
    const updatedTasks = customTasks.filter(task => task.id !== id);
    setCustomTasks(updatedTasks);
  };

  // Filter the tasks based on the selected filter
  const filteredTasks = customTasks.filter(task =>
    customTaskFilter === 'completed' ? task.completed : true
  );

  // Handle input field change
  const handleInputChange = (e) => {
    setCustomNewTask(e.target.value);
    setCustomErrorMessage(''); // Clear the error message
  };

  // Handle edit task
  const handleEdit = (id, title) => {
    const updatedTitle = prompt('Enter new task title:', title);
    if (updatedTitle && updatedTitle.trim() !== '') {
      editTask(id, updatedTitle);
    }
  };

  return (
    <div className="container">
      <h1>Todo Application</h1>
      <div className="input-field">
        <input
          type="text"
          placeholder="Add a new task"
          value={customNewTask}
          onChange={handleInputChange}
        />
        <button onClick={addTask}>Add Task</button>
      </div>
      {customErrorMessage && (
        <div className="error-message" style={{ color: 'red' }}>
          {customErrorMessage}
        </div>
      )}
      <div className="filter-buttons">
        <button className={customTaskFilter === 'all' ? 'active' : ''} onClick={() => setCustomTaskFilter('all')}>
          All
        </button>
        <button className={customTaskFilter === 'completed' ? 'active' : ''} onClick={() => setCustomTaskFilter('completed')}>
          Completed
        </button>
      </div>
      <ul className="task-list">
        {filteredTasks.map(task => (
          <li key={task.id}>
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => toggleTaskCompletion(task.id)}
            />
            <div className="task-container">
              <div
                className={`task-title ${task.completed ? 'completed' : ''}`}
                onClick={() => handleEdit(task.id, task.title)}
                style={{ width: 323 }}
              >
                {task.title}
              </div>
            </div>
            <div className="button-group">
              <button onClick={() => handleEdit(task.id, task.title)} style={{ backgroundColor: "green" }}>
                Edit
              </button>
              <button onClick={() => deleteTask(task.id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoApplication;

