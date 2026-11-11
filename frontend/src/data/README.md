# Geographic data

`argentina-provinces.json` contains Argentina's 23 provinces and the Autonomous City of Buenos Aires.

- Source: Argentina Georef API, based on Instituto Geográfico Nacional data
- Download: `https://apis.datos.gob.ar/georef/api/v2.0/provincias.geojson`
- Retrieved: 2026-11-11
- Coordinate system: longitude/latitude (GeoJSON)

The prototype keeps a local copy so it works without a runtime dependency on the external API. In display
views, Tierra del Fuego geometry is limited to its South American portion so Antarctic and remote South
Atlantic polygons do not appear as detached map fragments. The original source geometry remains unchanged
in this file.
