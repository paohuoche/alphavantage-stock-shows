import { useStore } from "@/store/StoreProvider"
import { useQuery } from "@tanstack/react-query"
import { observer } from "mobx-react-lite"
import React, { useMemo } from "react"
import ReactApexChart from "react-apexcharts"

import { Spin, notification } from "antd"

import {
  ETimeSeriesFunction,
  GetStockDataResponse,
  StockDataItem,
  getStockData,
} from "@/lib/api"

const CandleStick = observer(() => {
  const store = useStore()
  const fn = store.function
  const symbol = store.symbol
  const interval = store.interval

  // fetch stock data
  const { data: rawData, isLoading: isStockDataLoading } = useQuery({
    queryKey: ["getStockData", fn, symbol, interval],
    queryFn: () =>
      getStockData({
        function: fn,
        symbol,
        interval,
      }),
  })

  const { series } = useMemo(() => {
    if (!rawData) return { series: [] }

    if (rawData["Information"]) {
      notification.warning({
        message: "Warning",
        description: rawData["Information"],
        key: "reach-limit",
      })
      return { series: [] }
    }

    let key = "Time Series (Daily)" as keyof typeof rawData
    if (fn === ETimeSeriesFunction.WEEKLY) {
      key = "Weekly Time Series"
    } else if (fn === ETimeSeriesFunction.MONTHLY) {
      key = "Monthly Time Series"
    } else if (fn === ETimeSeriesFunction.INTRADAY) {
      key = `Time Series (${store.interval})`
    }

    const stockData = (rawData as GetStockDataResponse)[key] as Record<
      string,
      StockDataItem
    >

    let data = []
    for (let date in stockData) {
      data.unshift({
        x: date,
        y: [
          parseFloat(stockData[date]["1. open"]),
          parseFloat(stockData[date]["2. high"]),
          parseFloat(stockData[date]["3. low"]),
          parseFloat(stockData[date]["4. close"]),
        ],
      })
    }

    return {
      series: [{ data }],
    }
  }, [rawData])

  const options: ApexCharts.ApexOptions = {
    chart: {
      type: "candlestick",
      height: 350,
    },
    xaxis: {
      type: "category",
    },
    yaxis: {
      tooltip: {
        enabled: true,
      },
    },
  }

  return (
    <div className="relative">
      {isStockDataLoading && (
        <div className="absolute left-0 right-0 top-0 h-[350px]">
          <div className="absolute bottom-0 left-0 right-0 top-0 flex items-center justify-center bg-black bg-opacity-5">
            <Spin />
          </div>
        </div>
      )}
      <ReactApexChart
        options={options}
        series={series}
        type="candlestick"
        height={350}
        width={"100%"}
      />
    </div>
  )
})

export default CandleStick
