import React, { useState, useEffect } from "react";
import "./App.css";

const TodoApp = () => {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState("");
  const [filter, setFilter] = useState("all");
  const [sortBy, setSortBy] = useState("default");
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem("darkMode") === "true");
  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState("");

  useEffect(() => {
    const savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
    setTasks(savedTasks);
  }, []);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem("darkMode", darkMode);
    document.documentElement.setAttribute("data-theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  const handleAddTask = () => {
    const trimmed = input.trim();
    if (!trimmed) return alert("Task cannot be empty!");
    if (tasks.some(t => t.text === trimmed)) return alert("Task already exists!");
    const newTask = {
      id: Date.now(),
      text: trimmed,
      completed: false
    };
    setTasks([...tasks, newTask]);
    setInput("");
  };

  const toggleComplete = (id) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const startEdit = (id, text) => {
    setEditId(id);
    setEditText(text);
  };

  const saveEdit = (id) => {
    const trimmed = editText.trim();
    if (!trimmed) return alert("Task cannot be empty!");
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, text: trimmed } : task
    ));
    setEditId(null);
    setEditText("");
  };

  const handleKeyDown = (e, id) => {
    if (e.key === "Enter") saveEdit(id);
    if (e.key === "Escape") {
      setEditId(null);
      setEditText("");
    }
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === "active") return !task.completed;
    if (filter === "completed") return task.completed;
    return true;
  });

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sortBy === "name") return a.text.localeCompare(b.text);
    if (sortBy === "status") return a.completed - b.completed;
    return 0;
  });

  return (
    <div className={`app-container ${darkMode ? "dark" : "light"}`}>
      <div className="todo-card">
        <header className="header">
          <h1>📝 To-Do List</h1>
          <button className="theme-toggle" onClick={() => setDarkMode(prev => !prev)}>
            {darkMode ? "☀ Light" : "🌙 Dark"}
          </button>
        </header>

        <div className="input-row">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Add a task..."
          />
          <button onClick={handleAddTask}>Add</button>
        </div>

        <div className="filters">
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">All</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
          </select>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="default">Default</option>
            <option value="name">Sort by Name</option>
            <option value="status">Sort by Status</option>
          </select>
        </div>

        <ul className="task-list">
          {sortedTasks.map(task => (
            <li key={task.id} className={`task ${task.completed ? "completed" : ""}`}>
              {editId === task.id ? (
                <input
                  type="text"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  onBlur={() => saveEdit(task.id)}
                  onKeyDown={(e) => handleKeyDown(e, task.id)}
                  autoFocus
                />
              ) : (
                <span onClick={() => toggleComplete(task.id)} onDoubleClick={() => startEdit(task.id, task.text)}>
                  {task.text}
                </span>
              )}
              <button onClick={() => deleteTask(task.id)}>❌</button>
            </li>
          ))}
        </ul>

        {sortedTasks.length === 0 && <p className="no-tasks">No tasks to show.</p>}
      </div>
    </div>
  );
};

export default TodoApp;
