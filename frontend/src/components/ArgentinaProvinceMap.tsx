import { useMemo } from 'react'
import DeckGL from '@deck.gl/react'
import { GeoJsonLayer } from '@deck.gl/layers'
import type { PickingInfo } from '@deck.gl/core'
import type { FeatureCollection, MultiPolygon, Polygon } from 'geojson'
import argentinaProvincesJson from '../data/argentina-provinces.json'
import type { ProvinceFeature, ProvinceProperties } from '../types/wildfire'
import { getPrototypeProvinceGeometry } from '../modules/geo/generateProvinceGrid'

type ArgentinaProvinceMapProps = {
  selectedProvinceId?: string
  onSelectProvince: (province: ProvinceFeature) => void
}

const provinceData = argentinaProvincesJson as FeatureCollection<Polygon | MultiPolygon, ProvinceProperties>
const displayProvinceData: FeatureCollection<Polygon | MultiPolygon, ProvinceProperties> = {
  ...provinceData,
  features: provinceData.features.map((feature) => getPrototypeProvinceGeometry(feature)),
}

function provinceColor(id: string): [number, number, number, number] {
  const seed = [...id].reduce((total, character) => total + character.charCodeAt(0), 0)
  const palette: [number, number, number, number][] = [
    [37, 99, 112, 220],
    [45, 119, 112, 220],
    [54, 136, 128, 220],
    [67, 111, 145, 220],
    [74, 129, 160, 220],
  ]
  return palette[seed % palette.length]
}

export default function ArgentinaProvinceMap({
  selectedProvinceId,
  onSelectProvince,
}: ArgentinaProvinceMapProps) {
  const layers = useMemo(
    () => [
      new GeoJsonLayer<ProvinceProperties>({
        id: 'argentina-provinces',
        data: displayProvinceData,
        pickable: true,
        autoHighlight: true,
        stroked: true,
        filled: true,
        lineWidthUnits: 'pixels',
        lineWidthMinPixels: 1,
        getLineWidth: (feature) =>
          feature.properties.id === selectedProvinceId ? 3 : 1,
        getLineColor: (feature) =>
          feature.properties.id === selectedProvinceId
            ? [255, 214, 102, 255]
            : [203, 231, 232, 190],
        getFillColor: (feature) =>
          feature.properties.id === selectedProvinceId
            ? [241, 169, 62, 235]
            : provinceColor(feature.properties.id),
        highlightColor: [255, 255, 255, 45],
        onClick: (info: PickingInfo<ProvinceFeature>) => {
          if (info.object) onSelectProvince(info.object)
        },
        updateTriggers: {
          getLineWidth: selectedProvinceId,
          getLineColor: selectedProvinceId,
          getFillColor: selectedProvinceId,
        },
      }),
    ],
    [onSelectProvince, selectedProvinceId],
  )

  return (
    <DeckGL
      initialViewState={{
        longitude: -64.2,
        latitude: -38.2,
        zoom: 3.45,
        minZoom: 2.8,
        maxZoom: 9,
      }}
      controller
      layers={layers}
      getTooltip={({ object }) =>
        object
          ? { text: object.properties.nombre, className: 'map-tooltip' }
          : null
      }
    />
  )
}
