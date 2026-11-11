import { useMemo } from 'react'
import DeckGL from '@deck.gl/react'
import { GeoJsonLayer, GridCellLayer } from '@deck.gl/layers'
import { MaskExtension, type MaskExtensionProps } from '@deck.gl/extensions'
import type { ProvinceFeature, SpatialRiskCell } from '../../types/wildfire'
import {
  generateProvinceGrid,
  getPrototypeProvinceGeometry,
} from '../../modules/geo/generateProvinceGrid'

type WildfireRisk3DProps = { province: ProvinceFeature; year: number }

function riskColor(probability: number): [number, number, number, number] {
  if (probability >= 75) return [223, 77, 57, 235]
  if (probability >= 50) return [235, 154, 55, 235]
  if (probability >= 25) return [77, 156, 126, 235]
  return [31, 99, 120, 225]
}

export default function WildfireRisk3D({ province, year }: WildfireRisk3DProps) {
  const displayProvince = useMemo(() => getPrototypeProvinceGeometry(province), [province])
  const grid = useMemo(() => generateProvinceGrid(displayProvince, year), [displayProvince, year])
  const layers = useMemo(
    () => [
      new GeoJsonLayer({
        id: 'province-mask',
        data: displayProvince,
        operation: 'mask',
      }),
      new GeoJsonLayer({
        id: 'province-floor',
        data: displayProvince,
        filled: true,
        stroked: true,
        getFillColor: [12, 42, 54, 210],
        getLineColor: [175, 218, 216, 255],
        getLineWidth: 2,
        lineWidthUnits: 'pixels',
      }),
      new GridCellLayer<SpatialRiskCell, MaskExtensionProps>({
        id: 'wildfire-risk-grid',
        data: grid.cells,
        pickable: true,
        extruded: true,
        cellSize: grid.cellSizeMeters,
        coverage: 0.86,
        elevationScale: grid.cellSizeMeters * 0.018,
        getPosition: (cell) => cell.position,
        getElevation: (cell) => cell.probability,
        getFillColor: (cell) => riskColor(cell.probability),
        material: {
          ambient: 0.45,
          diffuse: 0.65,
          shininess: 20,
          specularColor: [80, 80, 80],
        },
        extensions: [new MaskExtension()],
        maskId: 'province-mask',
        maskByInstance: false,
      }),
    ],
    [displayProvince, grid],
  )

  return (
    <div className="risk-3d-canvas">
      <DeckGL
        key={`${province.properties.id}-${year}`}
        initialViewState={{
          longitude: grid.center[0],
          latitude: grid.center[1],
          zoom: grid.zoom,
          pitch: 58,
          bearing: -18,
          minPitch: 0,
          maxPitch: 75,
        }}
        controller
        layers={layers}
        getTooltip={({ object }) => {
          const cell = object as SpatialRiskCell | undefined
          return cell?.probability !== undefined
            ? `Risk ${cell.probability}%\n${cell.latitude.toFixed(3)}, ${cell.longitude.toFixed(3)}`
            : null
        }}
      />
      <div className="risk-scale" aria-hidden="true">
        <span>Low</span><i /><span>High</span>
      </div>
    </div>
  )
}
