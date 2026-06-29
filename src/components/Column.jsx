// src/components/Column.jsx
import React from 'react';
import TaskCard from './TaskCard';

const Column = ({ title, columnType, tasks, search, onDelete, onMove, onUpdate }) => {
  const filteredTasks = tasks.filter((item) =>
    item.text.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="column">
      <h2>{title} ({filteredTasks.length})</h2>
      <div className="task-list">
        {filteredTasks.map((item) => (
          <TaskCard
            key={item.id}
            task={item}
            columnType={columnType}
            onDelete={onDelete}
            onMove={onMove}
            onUpdate={onUpdate}
          />
        ))}
      </div>
    </div>
  );
};

export default Column;
