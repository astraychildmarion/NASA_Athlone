import booleanPointInPolygon from '@turf/boolean-point-in-polygon'
import type { MultiPolygon, Position } from 'geojson'
import type { ProvinceFeature, ProvinceGrid, SpatialRiskCell } from '../../types/wildfire'
import { mockProbability } from '../../data/mockWildfireData'

type Bounds = [minLng: number, minLat: number, maxLng: number, maxLat: number]

export function getPrototypeProvinceGeometry(province: ProvinceFeature): ProvinceFeature {
  if (
    province.geometry.type !== 'MultiPolygon' ||
    !province.properties.nombre.startsWith('Tierra del Fuego')
  ) {
    return province
  }

  const southAmericanPolygons = province.geometry.coordinates.filter((polygon) => {
    let maxLatitude = Number.NEGATIVE_INFINITY
    let minLongitude = Number.POSITIVE_INFINITY
    visitCoordinates(polygon, ([longitude, latitude]) => {
      maxLatitude = Math.max(maxLatitude, latitude)
      minLongitude = Math.min(minLongitude, longitude)
    })
    return maxLatitude > -56.5 && minLongitude < -63
  })

  if (southAmericanPolygons.length === province.geometry.coordinates.length) return province

  return {
    ...province,
    geometry: {
      type: 'MultiPolygon',
      coordinates: southAmericanPolygons,
    } satisfies MultiPolygon,
  }
}

function visitCoordinates(value: unknown, visit: (position: Position) => void) {
  if (!Array.isArray(value)) return
  if (value.length >= 2 && typeof value[0] === 'number' && typeof value[1] === 'number') {
    visit(value as Position)
    return
  }
  value.forEach((child) => visitCoordinates(child, visit))
}

function getBounds(province: ProvinceFeature): Bounds {
  let minLng = Number.POSITIVE_INFINITY
  let minLat = Number.POSITIVE_INFINITY
  let maxLng = Number.NEGATIVE_INFINITY
  let maxLat = Number.NEGATIVE_INFINITY

  visitCoordinates(province.geometry.coordinates, ([lng, lat]) => {
    minLng = Math.min(minLng, lng)
    minLat = Math.min(minLat, lat)
    maxLng = Math.max(maxLng, lng)
    maxLat = Math.max(maxLat, lat)
  })

  return [minLng, minLat, maxLng, maxLat]
}

function calculateZoom(lngSpan: number, latSpan: number) {
  const span = Math.max(lngSpan, latSpan * 1.25, 0.04)
  return Math.max(3.5, Math.min(10.5, Math.log2(300 / span)))
}

export function generateProvinceGrid(province: ProvinceFeature, year: number): ProvinceGrid {
  const displayProvince = getPrototypeProvinceGeometry(province)
  const [minLng, minLat, maxLng, maxLat] = getBounds(displayProvince)
  const lngSpan = maxLng - minLng
  const latSpan = maxLat - minLat
  const columns = 22
  const rows = Math.max(10, Math.round(columns * (latSpan / Math.max(lngSpan, 0.01))))
  const lngStep = lngSpan / columns
  const latStep = latSpan / rows
  const centerLat = (minLat + maxLat) / 2
  const horizontalMeters = lngStep * 111_320 * Math.cos((centerLat * Math.PI) / 180)
  const verticalMeters = latStep * 110_574
  const cellSizeMeters = Math.max(250, Math.min(horizontalMeters, verticalMeters) * 0.86)
  const cells: SpatialRiskCell[] = []

  for (let row = 0; row < rows; row += 1) {
    const latitude = minLat + (row + 0.5) * latStep
    for (let column = 0; column < columns; column += 1) {
      const longitude = minLng + (column + 0.5) * lngStep
      if (!booleanPointInPolygon([longitude, latitude], displayProvince)) continue

      cells.push({
        position: [longitude, latitude],
        longitude,
        latitude,
        probability: mockProbability(year, column + 1, row + 1),
      })
    }
  }

  return {
    cells,
    center: [(minLng + maxLng) / 2, (minLat + maxLat) / 2],
    cellSizeMeters,
    zoom: calculateZoom(lngSpan, latSpan),
  }
}
