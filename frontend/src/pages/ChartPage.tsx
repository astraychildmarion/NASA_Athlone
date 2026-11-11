import { useCallback, useState } from 'react'
import { Link } from 'react-router-dom'
import ArgentinaProvinceMap from '../components/ArgentinaProvinceMap'
import ProvinceDrawer from '../components/ProvinceDrawer'
import type { ProvinceFeature } from '../types/wildfire'

export default function ChartPage() {
  const [selectedProvince, setSelectedProvince] = useState<ProvinceFeature | null>(null)
  const [year, setYear] = useState(2025)
  const selectProvince = useCallback((province: ProvinceFeature) => setSelectedProvince(province), [])
  const closeDrawer = useCallback(() => setSelectedProvince(null), [])

  return (
    <main className="chart-page">
      <nav className="chart-nav" aria-label="Primary navigation">
        <Link className="brand" to="/">
          <span className="brand-mark">N</span>
          <span>
            <strong>NASA Athlone</strong>
            <small>Wildfire prototype</small>
          </span>
        </Link>
        <span className="prototype-badge">Simulated data</span>
      </nav>

      <section className="map-shell">
        <div className="map-copy">
          <p className="eyebrow">Argentina · Provincial view</p>
          <h1>Select a province to explore wildfire risk.</h1>
          <p>Choose any province to compare the same prototype model across space and time.</p>
          <div className="map-key" aria-label="Map interaction instructions">
            <span><i className="key-swatch" /> Province</span>
            <span><i className="key-swatch selected" /> Selected</span>
          </div>
        </div>

        <div className="province-map" aria-label="Interactive map of Argentina provinces">
          <ArgentinaProvinceMap
            selectedProvinceId={selectedProvince?.properties.id}
            onSelectProvince={selectProvince}
          />
        </div>

        <p className="map-source">Boundaries: Argentina Georef / Instituto Geográfico Nacional</p>
      </section>

      {selectedProvince ? (
        <ProvinceDrawer
          province={selectedProvince}
          year={year}
          onYearChange={setYear}
          onClose={closeDrawer}
        />
      ) : null}
    </main>
  )
}
