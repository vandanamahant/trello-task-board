// src/components/TaskCard.jsx
import React, { useState } from 'react';

const TaskCard = ({ task, columnType, onDelete, onMove, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(task.text);

  const handleSave = () => {
    if (editText.trim() === "") return;
    onUpdate(task.id, columnType, editText);
    setIsEditing(false);
  };

  return (
    <div className={`task-card priority-${task.priority.toLowerCase()}`}>
      <div className="task-header">
        <span className="priority-tag">{task.priority}</span>
        <button className="delete-btn" onClick={() => onDelete(task.id, columnType)}>×</button>
      </div>

      <div className="task-body">
        {isEditing ? (
          <div className="edit-mode">
            <input 
              type="text" 
              value={editText} 
              onChange={(e) => setEditText(e.target.value)} 
              autoFocus
            />
            <button onClick={handleSave}>Save</button>
          </div>
        ) : (
          <h4 onClick={() => setIsEditing(true)} title="Click to edit task">
            {task.text}
          </h4>
        )}
      </div>

      <div className="task-actions">
        {columnType !== 'todo' && (
          <button onClick={() => onMove(task.id, columnType, 'back')}>◀ Move Back</button>
        )}
        {columnType !== 'done' && (
          <button onClick={() => onMove(task.id, columnType, 'forward')}>Move ▶</button>
        )}
      </div>
    </div>
  );
};

export default TaskCard;
