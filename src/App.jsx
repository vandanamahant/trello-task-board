// src/App.jsx
import { useState, useEffect } from "react";
import Column from "./components/Column";
import "./App.css";

const COLUMNS_CONFIG = [
  { id: "todo", title: "📝 To Do", type: "todo" },
  { id: "progress", title: "⚙️ In Progress", type: "progress" },
  { id: "done", title: "✅ Done", type: "done" }
];

function App() {
  const [taskText, setTaskText] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [search, setSearch] = useState("");
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const savedTasks = JSON.parse(localStorage.getItem("kanban_tasks"));
    if (savedTasks && savedTasks.length > 0) {
      setTasks(savedTasks);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("kanban_tasks", JSON.stringify(tasks));
  }, [tasks]);

  const handleAddTask = () => {
    if (taskText.trim() === "") {
      alert("Please enter a task");
      return;
    }

    const newTask = {
      id: Date.now(),
      text: taskText.trim(),
      priority: priority,
      status: "todo",
    };

    setTasks([...tasks, newTask]);
    setTaskText("");
    setPriority("Medium");
  };

  const handleDeleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

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

  return (
    <div className="container">
      <h1>Task Management Board</h1>

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

      <input
        className="search"
        type="text"
        placeholder="Search Task by Name..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="board">
        {COLUMNS_CONFIG.map((col) => (
          <Column
            key={col.id}
            title={col.title}
            columnType={col.type}
            tasks={tasks.filter((t) => t.status === col.type)}
            search={search}
            onDelete={handleDeleteTask}
            onMove={handleMoveTask}
            onUpdate={handleUpdateTaskText}
          />
        ))}
      </div>
    </div>
  );
}

export default App;
