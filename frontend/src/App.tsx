import { lazy, Suspense } from 'react'
import { Link, Navigate, Route, Routes } from 'react-router-dom'

const ChartPage = lazy(() => import('./pages/ChartPage'))

function HomePage() {
  return (
    <main className="home-page">
      <section className="home-card">
        <p className="eyebrow">NASA Athlone</p>
        <h1>Wildfire intelligence, made visible.</h1>
        <p>
          Explore an interactive prototype of provincial wildfire risk across
          Argentina.
        </p>
        <Link to="/chart" role="button">
          Open chart prototype
        </Link>
      </section>
    </main>
  )
}

function App() {
  return (
    <Suspense fallback={<div className="route-loading">Loading visualization…</div>}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/chart" element={<ChartPage />} />
        <Route path="*" element={<Navigate to="/chart" replace />} />
      </Routes>
    </Suspense>
  )
}

export default App
