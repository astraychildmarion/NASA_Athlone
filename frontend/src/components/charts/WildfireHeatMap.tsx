import { useEffect, useRef } from 'react'
import embed, { type Result, type VisualizationSpec } from 'vega-embed'
import { generateTemporalRisk } from '../../data/mockWildfireData'

type WildfireHeatMapProps = { year: number }

const monthOrder = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

export default function WildfireHeatMap({ year }: WildfireHeatMapProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    let result: Result | undefined
    let cancelled = false
    const spec: VisualizationSpec = {
      $schema: 'https://vega.github.io/schema/vega-lite/v6.json',
      width: 'container',
      height: 250,
      background: 'transparent',
      data: { values: generateTemporalRisk(year) },
      mark: { type: 'rect', cornerRadius: 1 },
      encoding: {
        x: {
          field: 'day',
          type: 'ordinal',
          title: 'Day',
          axis: { labelAngle: 0, labelOverlap: 'greedy', tickMinStep: 2 },
        },
        y: {
          field: 'month',
          type: 'ordinal',
          title: 'Month',
          sort: 'ascending',
          axis: { labelExpr: `${JSON.stringify(monthOrder)}[datum.value - 1]` },
        },
        color: {
          field: 'probability',
          type: 'quantitative',
          title: 'Risk (%)',
          scale: {
            domain: [0, 100],
            range: ['#0c3344', '#2d847d', '#e3b341', '#df5a3f'],
          },
        },
        tooltip: [
          { field: 'date', type: 'temporal', title: 'Date', format: '%d %b %Y' },
          { field: 'probability', type: 'quantitative', title: 'Risk', format: '.0f' },
        ],
      },
      config: {
        view: { stroke: null },
        axis: {
          domainColor: '#587283',
          grid: false,
          labelColor: '#b7c9d4',
          titleColor: '#dbe7ed',
          tickColor: '#587283',
        },
        legend: {
          gradientLength: 120,
          labelColor: '#b7c9d4',
          titleColor: '#dbe7ed',
        },
      },
    }

    embed(containerRef.current, spec, {
      actions: false,
      renderer: 'canvas',
      tooltip: true,
    }).then((embedResult) => {
      if (cancelled) embedResult.view.finalize()
      else result = embedResult
    })

    return () => {
      cancelled = true
      result?.view.finalize()
    }
  }, [year])

  return <div ref={containerRef} className="heatmap-chart" aria-label="Annual wildfire risk heat map" />
}
