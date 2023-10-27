import * as React from "react"
import { 
  GeoJSON,
  MapContainer,
  TileLayer
} from "react-leaflet"

import DEFAULT_MAP_GEOJSON from "../data/thailand.json"
import PREDICTION_DATA from "../data/output.json"

const DEFAULT_COORDS = [15.87, 100.9925]

const mapStyle = {
  height: 600,
}

const buildMap = () => {
  if (typeof window !== 'undefined') {
    return (
      <MapContainer id="map" style={mapStyle} center={DEFAULT_COORDS} zoom={5}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <GeoJSON key={1} data={DEFAULT_MAP_GEOJSON} />
      </MapContainer>  
    )
  }
}

const IndexPage = () => {
  return (
    <main>
      <h1>
        Data Driven Travel
      </h1>
      { buildMap() }
    </main>
  )
}

export default IndexPage

export const Head = () => 
  <>
    <title>Data Driven Travel</title>
  </>
