import type { Feature, MultiPolygon, Polygon } from 'geojson'

export type ProvinceProperties = {
  id: string
  nombre: string
  nombre_completo: string
  iso_id: string
  iso_nombre: string
  categoria: string
  fuente: string
  centroide?: { lat: number; lon: number }
}

export type ProvinceFeature = Feature<Polygon | MultiPolygon, ProvinceProperties>

export type TemporalRiskPoint = {
  date: string
  month: number
  day: number
  probability: number
}

export type SpatialRiskCell = {
  position: [number, number]
  probability: number
  longitude: number
  latitude: number
}

export type ProvinceGrid = {
  cells: SpatialRiskCell[]
  center: [number, number]
  cellSizeMeters: number
  zoom: number
}
