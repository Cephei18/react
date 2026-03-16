function Filters({ query, onQueryChange, showCompleted, onShowCompletedChange }) {
  return (
    <section className="controls">
      <input
        type="text"
        value={query}
        onChange={(event) => onQueryChange(event.target.value)}
        placeholder="Filter task text..."
      />
      <label>
        <input
          type="checkbox"
          checked={showCompleted}
          onChange={(event) => onShowCompletedChange(event.target.checked)}
        />
        Show completed
      </label>
    </section>
  )
}

export default Filters
