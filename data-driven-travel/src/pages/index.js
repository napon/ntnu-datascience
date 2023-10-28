import * as React from "react"
import Particles from "react-particles";
import { loadLinksPreset } from "tsparticles-preset-links";
import { 
  GeoJSON,
  MapContainer,
  TileLayer
} from "react-leaflet"

import DEFAULT_MAP_GEOJSON from "../data/thailand.json"
import PREDICTION_DATA from "../data/output.json"

const DEFAULT_COORDS = [13.47, 100.9925]

const mapStyle = {
  height: "100vh",
}


const buildMap = (setShowMap) => {
  if (typeof window !== 'undefined') {
    return (
      <>
        <div id="foo" className="mt-1 absolute items-center justify-center mr-1">
          <a href="" onClick={(e) => { e.preventDefault(); setShowMap(true); }} className="rounded-md bg-sky-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-sky-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600">Exit</a>
        </div>
        <MapContainer id="map" style={mapStyle} center={DEFAULT_COORDS} zoom={6} scrollWheelZoom={false}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <GeoJSON key={1} data={DEFAULT_MAP_GEOJSON} style={{
              fillColor: "#320434",
              weight: 2,
              opacity: 1,
              color: 'white',
              dashArray: '3',
              fillOpacity: 0.7
            }}
          />
        </MapContainer>
      </>
    )
  }
}

const clip1 = {
  clipPath: "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)"
}

const clip2 = {
  clipPath: "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)"
}

const IndexPage = () => {

  const [showMap, setShowMap] = React.useState(false)

  const wrapperStyle = ['relative', 'isolate']
  if (!showMap) {
    wrapperStyle.concat(['px-6','lg:px-8'])
  }

  return (
    <main>
      <div className="bg-white">
        <Particles 
          options={{
            preset: "links",
            background: {
              color: "#FFFFFF"
            },
            particles: {
              line_linked: {
                color: "#4878CD"
              }
            },
            
          }} 
          init={async(engine) => loadLinksPreset(engine)}
        />
        <div className={wrapperStyle.join(' ')}>
          {
            showMap &&
            buildMap(setShowMap)
          }
          { !showMap && 
            <div>
              <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80" aria-hidden="true">
                <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#42a7f5] to-[#42e6f5] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" style={clip1}></div>
              </div>
              <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-62">
                <div className="text-center">
                  <h1 className="text-4xl font-bold tracking-tight text-gray-800 sm:text-6xl">Data Driven Travel</h1>
                  <p className="mt-6 text-lg leading-8 text-gray-700">Discover the best time for your trip to Thailand 🇹🇭</p>
                  <p className="mt-2 text-sm text-gray-600">(NTNU Datascience Project)</p>
                  <div className="mt-6 flex items-center justify-center gap-x-6">
                    <a href="" onClick={(e) => { e.preventDefault(); setShowMap(true); }} className="rounded-md bg-sky-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-sky-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600">Get started →</a>
                  </div>
                </div>
              </div>
              <div className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]" aria-hidden="true">
                <div className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]" style={clip2}></div>
              </div>
            </div>
          }
          
        </div>
      </div>
    </main>
  )
}



export default IndexPage

export const Head = () => 
  <>
    <title>Data Driven Travel</title>
  </>
