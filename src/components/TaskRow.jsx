function TaskRow({ todo, pinned, isSaving, onTogglePinned, onToggleCompleted }) {
  return (
    <li className={pinned ? 'task-item highlighted' : 'task-item'}>
      <div>
        <p>{todo.todo}</p>
        <small>{todo.completed ? 'Completed' : 'Open'}</small>
      </div>

      <div className="task-actions">
        <button type="button" onClick={() => onTogglePinned(todo.id)}>
          {pinned ? 'Unpin' : 'Pin'}
        </button>
        <button
          type="button"
          className="secondary"
          onClick={() => onToggleCompleted(todo.id)}
          disabled={isSaving}
        >
          {isSaving ? 'Saving...' : todo.completed ? 'Mark Open' : 'Mark Done'}
        </button>
      </div>
    </li>
  )
}

export default TaskRow
