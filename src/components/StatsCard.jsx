function StatsCard({ title, value }) {
  return (
    <article className="stats-card">
      <h2>{title}</h2>
      <p>{value}</p>
    </article>
  )
}

export default StatsCard
