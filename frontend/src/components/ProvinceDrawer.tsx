import { useEffect } from 'react'
import type { ProvinceFeature } from '../types/wildfire'
import WildfireHeatMap from './charts/WildfireHeatMap'
import WildfireRisk3D from './charts/WildfireRisk3D'

type ProvinceDrawerProps = {
  province: ProvinceFeature
  year: number
  onYearChange: (year: number) => void
  onClose: () => void
}

const years = Array.from({ length: 2025 - 1980 + 1 }, (_, index) => 2025 - index)

export default function ProvinceDrawer({
  province,
  year,
  onYearChange,
  onClose,
}: ProvinceDrawerProps) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  return (
    <div className="drawer-layer">
      <button
        className="drawer-scrim"
        type="button"
        aria-label="Close province details"
        onClick={onClose}
      />
      <aside className="province-drawer" aria-label={`${province.properties.nombre} wildfire analysis`}>
        <header className="drawer-header">
          <div>
            <p className="eyebrow">Provincial prototype</p>
            <h2>{province.properties.nombre}</h2>
            <p>Simulated wildfire probability · same demo model for every province</p>
          </div>
          <button className="close-button" type="button" aria-label="Close" onClick={onClose}>
            ×
          </button>
        </header>

        <div className="drawer-controls">
          <label htmlFor="risk-year">Analysis year</label>
          <select
            id="risk-year"
            value={year}
            onChange={(event) => onYearChange(Number(event.target.value))}
          >
            {years.map((optionYear) => (
              <option key={optionYear} value={optionYear}>{optionYear}</option>
            ))}
          </select>
        </div>

        <section className="chart-panel">
          <div className="panel-heading">
            <div>
              <p className="panel-kicker">Spatial distribution</p>
              <h3>3D geographic risk</h3>
            </div>
            <span>Drag to rotate</span>
          </div>
          <WildfireRisk3D province={province} year={year} />
        </section>

        <section className="chart-panel">
          <div className="panel-heading">
            <div>
              <p className="panel-kicker">Temporal distribution</p>
              <h3>Annual risk heat map</h3>
            </div>
            <span>{year}</span>
          </div>
          <WildfireHeatMap year={year} />
        </section>

        <p className="data-note">
          Prototype only. Values are deterministic simulated data and do not represent actual wildfire forecasts.
        </p>
      </aside>
    </div>
  )
}
