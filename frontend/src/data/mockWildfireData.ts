import type { TemporalRiskPoint } from '../types/wildfire'

function seededNoise(seed: number) {
  const value = Math.sin(seed * 12.9898) * 43758.5453
  return value - Math.floor(value)
}

function clampProbability(value: number) {
  return Math.max(0, Math.min(100, Math.round(value)))
}

export function mockProbability(year: number, x: number, y: number) {
  const seasonalWave = (Math.cos(((y - 1) / 12) * Math.PI * 2) + 1) / 2
  const noise = seededNoise(year * 101 + x * 37 + y * 71)
  return clampProbability(10 + seasonalWave * 58 + noise * 30)
}

export function generateTemporalRisk(year: number): TemporalRiskPoint[] {
  const points: TemporalRiskPoint[] = []

  for (let month = 1; month <= 12; month += 1) {
    const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate()

    for (let day = 1; day <= daysInMonth; day += 1) {
      points.push({
        date: `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
        month,
        day,
        probability: mockProbability(year, day, month),
      })
    }
  }

  return points
}
