import { useEffect, useMemo, useState } from 'react'
import Snowfall from 'react-snowfall'
import useSWR from 'swr'
import Filters from './components/Filters'
import StatsCard from './components/StatsCard'
import TaskRow from './components/TaskRow'
import StudentRegistry from './components/StudentRegistry'
import { usePinnedTasks } from './hooks/usePinnedTasks'
import './App.css'

const fetcher = async (url) => {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error('Failed to load tasks.')
  }

  return response.json()
}

function App() {
  const [page, setPage] = useState('dashboard')
  const [query, setQuery] = useState('')
  const [showCompleted, setShowCompleted] = useState(true)
  const [savingIds, setSavingIds] = useState([])
  const { pinClicks, pinnedCount, isPinned, togglePinned } = usePinnedTasks()

  const {
    data,
    error,
    isLoading,
    mutate,
    isValidating,
  } = useSWR('https://dummyjson.com/todos?limit=18', fetcher, {
    refreshInterval: 30000,
    revalidateOnFocus: true,
  })

  const todos = useMemo(() => data?.todos ?? [], [data])

  const filteredTodos = useMemo(() => {
    return todos
      .filter((todo) => (showCompleted ? true : !todo.completed))
      .filter((todo) =>
        todo.todo.toLowerCase().includes(query.trim().toLowerCase()),
      )
  }, [todos, query, showCompleted])

  const completedCount = useMemo(() => {
    return todos.filter((todo) => todo.completed).length
  }, [todos])

  useEffect(() => {
    document.title = `Dashboard (${filteredTodos.length})`
  }, [filteredTodos.length])

  const toggleCompleted = async (id) => {
    const selectedTodo = todos.find((todo) => todo.id === id)
    if (!selectedTodo) {
      return
    }

    const nextCompleted = !selectedTodo.completed

    setSavingIds((current) => [...current, id])

    try {
      await mutate(
        async (currentData) => {
          const response = await fetch(`https://dummyjson.com/todos/${id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ completed: nextCompleted }),
          })

          if (!response.ok) {
            throw new Error('Unable to update task.')
          }

          return {
            ...currentData,
            todos: (currentData?.todos ?? []).map((todo) =>
              todo.id === id ? { ...todo, completed: nextCompleted } : todo,
            ),
          }
        },
        {
          optimisticData: (currentData) => ({
            ...currentData,
            todos: (currentData?.todos ?? []).map((todo) =>
              todo.id === id ? { ...todo, completed: nextCompleted } : todo,
            ),
          }),
          rollbackOnError: true,
          revalidate: false,
        },
      )
    } finally {
      setSavingIds((current) => current.filter((item) => item !== id))
    }
  }

  return (
    <div className="app-shell">
      <div className="app-snowfall app-snowfall-back" aria-hidden="true">
        <Snowfall
          color="#d8d4fe"
          snowflakeCount={220}
          speed={[0.5, 1.5]}
          wind={[-0.35, 0.3]}
          radius={[0.8, 4.4]}
        />
      </div>

      <div className="app-snowfall app-snowfall-front" aria-hidden="true">
        <Snowfall
          color="#ffffff"
          snowflakeCount={90}
          speed={[1.2, 2.6]}
          wind={[-0.2, 0.45]}
          radius={[1.8, 7]}
        />
      </div>

      <div className="app-content">
        <nav className="sr-navbar navbar navbar-expand">
          <span className="sr-navbar-brand navbar-brand me-4">📚 Learning Hub</span>
          <ul className="navbar-nav gap-2">
            <li className="nav-item">
              <button
                className={`sr-nav-btn${page === 'dashboard' ? ' active' : ''}`}
                onClick={() => setPage('dashboard')}
              >
                Dashboard
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`sr-nav-btn${page === 'registry' ? ' active' : ''}`}
                onClick={() => setPage('registry')}
              >
                Student Registry
              </button>
            </li>
          </ul>
        </nav>

        {page === 'registry' && <StudentRegistry />}

        {page === 'dashboard' && (
          <main className="dashboard">
            <header className="dashboard-header">
              <div>
                <h1>Learning Dashboard</h1>
                <p>Practice React hooks, state updates, and SWR revalidation.</p>
              </div>
              <button className="refresh-btn" onClick={() => mutate()}>
                {isValidating ? 'Refreshing...' : 'Refresh'}
              </button>
            </header>

            <Filters
              query={query}
              onQueryChange={setQuery}
              showCompleted={showCompleted}
              onShowCompletedChange={setShowCompleted}
            />

            <section className="stats">
              <StatsCard title="Total" value={todos.length} />
              <StatsCard title="Completed" value={completedCount} />
              <StatsCard title="Filtered" value={filteredTodos.length} />
              <StatsCard title="Pin Clicks" value={pinClicks} />
              <StatsCard title="Pinned" value={pinnedCount} />
            </section>

            {isLoading && <p className="status">Loading tasks...</p>}
            {error && <p className="status error">{error.message}</p>}

            {!isLoading && !error && (
              <ul className="task-list">
                {filteredTodos.map((todo) => (
                  <TaskRow
                    key={todo.id}
                    todo={todo}
                    pinned={isPinned(todo.id)}
                    isSaving={savingIds.includes(todo.id)}
                    onTogglePinned={togglePinned}
                    onToggleCompleted={toggleCompleted}
                  />
                ))}
              </ul>
            )}
          </main>
        )}
      </div>
    </div>
  )
}

export default App
