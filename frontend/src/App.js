// App.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css'; // Import your stylesheet

const App = () => {
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showCompleted, setShowCompleted] = useState(false);

  const base_url = "https://todo-list-wbyp.onrender.com"

  useEffect(() => {
    // Fetch Todos from Backend
    console.log("yes")
    axios.get(base_url + '/todos')
      .then(response => setTodos(response.data))
      .catch(error => console.error('Error fetching todos:', error));
  }, []);

  const addTodo = () => {
    if (!text.trim()) {
      setErrorMessage('Please enter a task');
      return;
    }

    // Add Todo to Backend
    axios.post(base_url + '/todos', { text, completed: false })
      .then(response => {
        setTodos([...todos, response.data]);
        setText('');
        setErrorMessage('');
      })
      .catch(error => console.error('Error adding todo:', error));
  };

  const deleteTodo = (id) => {
    // Delete Todo from Backend
    axios.delete(base_url + `/todos/${id}`)
      .then(response => {
        setTodos(todos.filter(todo => todo._id !== id));
      })
      .catch(error => console.error('Error deleting todo:', error));
  };

  const updateCompletionStatus = (id, completed) => {
    // Update Completion Status to Backend
    axios.put(base_url + `/todos/${id}`, { completed })
      .then(response => {
        const updatedTodos = todos.map(todo =>
          todo._id === id ? { ...todo, completed: response.data.completed } : todo
        );
        setTodos(updatedTodos);
      })
      .catch(error => console.error('Error updating completion status:', error));
  };

  const filteredTodos = showCompleted
    ? todos.filter(todo => todo.completed)
    : todos.filter(todo => !todo.completed);

  return (
    <div className="container">
      <h1 className="app-heading">Todo App</h1>
      <div className="toggle-container">
        <label>
          Show Completed Tasks
          <input
            type="checkbox"
            checked={showCompleted}
            onChange={() => setShowCompleted(!showCompleted)}
          />
        </label>
      </div>
      <div className="todo-list-container">
        <ul className="todo-list">
          {filteredTodos.map(todo => (
            <li key={todo._id} className="todo-item">
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => updateCompletionStatus(todo._id, !todo.completed)}
                className="todo-checkbox"
              />
              <span className={`todo-text ${todo.completed ? 'completed' : ''}`}>
                {todo.text}
              </span>
              <span
                className="todo-delete"
                onClick={() => deleteTodo(todo._id)}
              >
                🗑️
              </span>
            </li>
          ))}
        </ul>
      </div>
      <div className="input-container">
        <input
          type="text"
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            setErrorMessage('');
          }}
          className="input-text"
          placeholder="Add a new task"
        />
        <button onClick={addTodo} className="add-todo-button">
          Add Todo
        </button>
      </div>
      {errorMessage && (
        <p style={{ color: 'red', margin: '0' }}>{errorMessage}</p>
      )}
    </div>
  );
};

export default App;
