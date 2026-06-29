// src/App.jsx
import { useState, useEffect } from "react";
import Column from "./components/Column";
import "./App.css";

function App() {
  const [taskText, setTaskText] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [search, setSearch] = useState("");
  const [tasks, setTasks] = useState([]);

  // Load tasks from localStorage on mount
  useEffect(() => {
    const savedTasks = JSON.parse(localStorage.getItem("kanban_tasks"));
    if (savedTasks && savedTasks.length > 0) {
      setTasks(savedTasks);
    }
  }, []);

  // Sync tasks to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem("kanban_tasks", JSON.stringify(tasks));
  }, [tasks]);

  // Handler to add a new task
  const handleAddTask = () => {
    if (taskText.trim() === "") {
      alert("Please enter a task");
      return;
    }

    const newTask = {
      id: Date.now(),
      text: taskText.trim(),
      priority: priority,
      status: "todo", // Default column status
    };

    setTasks([...tasks, newTask]);
    setTaskText("");
    setPriority("Medium");
  };

  // Handler to delete a task universally
  const handleDeleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  // Handler to move task forward or backward across columns
  const handleMoveTask = (id, currentStatus, direction) => {
    setTasks(
      tasks.map((task) => {
        if (task.id === id) {
          let nextStatus = task.status;
          if (currentStatus === "todo" && direction === "forward") nextStatus = "progress";
          else if (currentStatus === "progress" && direction === "forward") nextStatus = "done";
          else if (currentStatus === "progress" && direction === "back") nextStatus = "todo";
          else if (currentStatus === "done" && direction === "back") nextStatus = "progress";

          return { ...task, status: nextStatus };
        }
        return task;
      })
    );
  };

  // Handler to update inline edited text
  const handleUpdateTaskText = (id, columnType, updatedText) => {
    setTasks(
      tasks.map((task) => {
        if (task.id === id) {
          return { ...task, text: updatedText };
        }
        return task;
      })
    );
  };

  // Filter tasks by column status
  const todoTasks = tasks.filter((t) => t.status === "todo");
  const progressTasks = tasks.filter((t) => t.status === "progress");
  const doneTasks = tasks.filter((t) => t.status === "done");

  return (
    <div className="container">
      <h1>Task Management Board</h1>

      {/* Task Input Section */}
      <div className="top-bar">
        <input
          type="text"
          placeholder="Enter Task..."
          value={taskText}
          onChange={(e) => setTaskText(e.target.value)}
        />

        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
        >
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>

        <button onClick={handleAddTask}>Add Task</button>
      </div>

      {/* Global Filter Search */}
      <input
        className="search"
        type="text"
        placeholder="Search Task by Name..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Kanban Board Grid */}
      <div className="board">
        <Column
          title="📝 To Do"
          columnType="todo"
          tasks={todoTasks}
          search={search}
          onDelete={handleDeleteTask}
          onMove={handleMoveTask}
          onUpdate={handleUpdateTaskText}
        />

        <Column
          title="⚙️ In Progress"
          columnType="progress"
          tasks={progressTasks}
          search={search}
          onDelete={handleDeleteTask}
          onMove={handleMoveTask}
          onUpdate={handleUpdateTaskText}
        />

        <Column
          title="✅ Done"
          columnType="done"
          tasks={doneTasks}
          search={search}
          onDelete={handleDeleteTask}
          onMove={handleMoveTask}
          onUpdate={handleUpdateTaskText}
        />
      </div>
    </div>
  );
}

export default App;
