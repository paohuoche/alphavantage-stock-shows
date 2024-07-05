// import CandleStick from "./candleStick"
import dynamic from "next/dynamic"

import TimeSeriesSwitch from "./timeSeriesSwitch"

const CandleStick = dynamic(() => import("./candleStick"), { ssr: false })

const index = () => {
  return (
    <div className="rounded-md border bg-white p-8">
      <h1 className="mb-8 text-xl font-bold">
        Alpha Vantage Stock Data Display
      </h1>

      <div className="">
        <TimeSeriesSwitch />
      </div>
      <CandleStick />
    </div>
  )
}

export default index
