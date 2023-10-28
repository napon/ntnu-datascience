import * as React from "react"
import Particles from "react-particles";
import { loadLinksPreset } from "tsparticles-preset-links";
import {
  GeoJSON,
  MapContainer,
  Marker,
  TileLayer
} from "react-leaflet"

import DEFAULT_MAP_GEOJSON from "../data/thailand.json"
import PREDICTION_DATA from "../data/output.json"

const DEFAULT_COORDS = [13.47, 104.9925]

const DISPLAY_MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

const getMonthCode = selectedMonth => {
  return DISPLAY_MONTHS[selectedMonth].toLowerCase().substring(0,3)
}

const getColor = (feature) => {
  const score = feature.properties.score
  return score > 0.95 ? "#980043"
    : score > 0.90 ? "#ce1256"
    : score > 0.85 ? "#e7298a"
    : score > 0.80 ? "#df65b0"
    : score > 0.7 ? "#c994c7"
    : score > 0.6 ? "#d4b9da"
    : score > 0.5 ? "#e7e1ef"
    : "#f7f4f9"
}

const style = (feature) => ({
  fillColor: getColor(feature),
  weight: 2,
  opacity: 1,
  color: 'white',
  dashArray: '3',
  fillOpacity: 0.7
})

const clip1 = {
  clipPath: "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)"
}

const clip2 = {
  clipPath: "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)"
}

const MapView = ({setShowMap}) => {
  const [showDropdown, setShowDropdown] = React.useState(false)
  const [selectedMonth, setSelectedMonth] = React.useState((new Date()).getMonth())
  const [hoverProvince, setHoverProvince] = React.useState(null)

  const mapData = React.useMemo(() => {
    const output = {...DEFAULT_MAP_GEOJSON}
    const monthCode = getMonthCode(selectedMonth)
    for (let i = 0; i < DEFAULT_MAP_GEOJSON.features.length; i++) {
      const feature = DEFAULT_MAP_GEOJSON.features[i]
      const provinceId = feature.properties['CHA_NE']
      output.features[i].properties = Object.assign({}, feature.properties, PREDICTION_DATA[monthCode][provinceId])
    }
    return output
  }, [selectedMonth])

  const bestProvince = React.useMemo(() => {
    const best = DEFAULT_MAP_GEOJSON.features.reduce((max, f) => {
      return f.properties.score >= max.properties.score ? f : max;
    }, { properties: { score: Number.MIN_SAFE_INTEGER }});
    return {...best.properties}
  }, [mapData])

  const provinceLocationMap = React.useRef({});

  const highlightFeature = (e => {
    let layer = e.target;
    const feature = e.target.feature.properties;
    layer.setStyle({
      fillOpacity: 1
    })
    setHoverProvince(feature)
  })

  const resetHighlight = (e =>{
    e.target.setStyle(style(e.target.feature));
    setHoverProvince(null)
  })

  const onEachFeature = (feature, layer) => {
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight
    });
    provinceLocationMap.current[feature.properties.CHA_NE] = layer.getBounds().getCenter()
  }

  if (typeof window !== 'undefined') {
    const selectedProvinceName = bestProvince?.CHA_NE?.replace(/([A-Z])/g, ' $1').trim()
    const selectedProvince = bestProvince.CHA_NE
    return (
      <>
        <MapContainer
          id="map"
          style={{ height: "100vh" }}
          center={DEFAULT_COORDS}
          zoom={6}
          scrollWheelZoom={false}
        >
          <div style={{zIndex: 999}} className="absolute top-4 right-4 ml-4">
            <div className="flex content-end mb-4 place-content-end">
              <div onMouseOver={() => setShowDropdown(true)} onMouseLeave={() => setShowDropdown(false)}>
                <button
                  id="dropdownDefaultButton"
                  className="text-sky-600 bg-white border-slate-400 shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center mr-4" type="button">{DISPLAY_MONTHS[selectedMonth]}
                    <svg className="w-2.5 h-2.5 ml-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                      <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 4 4 4-4"
                    />
                </svg>
                </button>

                <div style={{zIndex: 999}} className={`z-10 shadow-lg place-content-start ${showDropdown ? "absolute" : "hidden"} bg-white divide-y divide-gray-100 rounded-lg shadow w-44 top-10`}>
                    <ul className="py-2 text-sm text-sky-600" aria-labelledby="dropdownDefaultButton">
                      { DISPLAY_MONTHS.map((month, idx) =>
                        <li key={month} onClick={(e) => {setSelectedMonth(idx); setShowDropdown(false)}}>
                          <a className="block px-4 py-2 hover:bg-gray-100">{month}</a>
                        </li>)
                      }
                    </ul>
                </div>
              </div>
              <a
                href=""
                style={{color: "white"}}
                onClick={(e) => { e.preventDefault(); setShowMap(false); setShowDropdown(false);}}
                className="rounded-md bg-red-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
              >
                Exit
              </a>
            </div>
            <div className="bg-slate-100 leaflet-control leaflet-bar p-4 shadow-md max-w-md text-sm">
              <strong>Discover the best places to visit</strong>
              <p className="mb-8">Select the desired month from the dropdown above, or hover on each province for more details.</p>
              {
                hoverProvince ?
                  <>
                    <p className="mb-1">Data for <b>{hoverProvince.CHA_NE?.replace(/([A-Z])/g, ' $1').trim()}</b>:</p>
                    <p>Rainfall: {Math.round(hoverProvince.max_rainfall_mm, 2)}mm</p>
                    <p>Tourism Ratio: {Math.round(hoverProvince.tourism_ratio, 2)}%</p>
                    <p>Overall Score: {Math.round(hoverProvince.score * 100, 2)}%</p>
                  </>
                :
                  <>
                    <p className="mb-1">The best province to visit in <b>{DISPLAY_MONTHS[selectedMonth]}</b> is {selectedProvinceName}.</p>
                    <p>Rainfall: {Math.round(bestProvince.max_rainfall_mm, 2)}mm</p>
                    <p>Tourism Ratio: {Math.round(bestProvince.tourism_ratio, 2)}%</p>
                    <p>Overall Score: {Math.round(bestProvince.score * 100, 2)}%</p>
                  </>
              }
            </div>
          </div>

          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <GeoJSON data={mapData}
            onEachFeature={onEachFeature}
            style={style}
          />
          {provinceLocationMap.current[selectedProvince] && <Marker position={provinceLocationMap.current[selectedProvince]}/>}
        </MapContainer>
      </>
    )
  }
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
            showMap && <MapView setShowMap={setShowMap} />
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
                    <a href="" onClick={(e) => { e.preventDefault(); setShowMap(true); }} className="rounded-md bg-sky-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-sky-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600">Get started</a>
                    <a href="https://github.com/napon/ntnu-datascience" className="text-sm font-semibold hover:text-sky-600">View GitHub →</a>
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
