import { useStore } from "@/store/StoreProvider"
import { useQuery } from "@tanstack/react-query"
import { observer } from "mobx-react-lite"
import React, { useMemo } from "react"
import ReactApexChart from "react-apexcharts"

import { notification } from "antd"

import {
  ETimeSeriesFunction,
  GetStockDataResponse,
  StockDataItem,
  getStockData,
} from "@/lib/api"

// import MockData from "./mockData"

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
      }),
  })

  const series = useMemo(() => {
    if (!rawData) return []

    if (rawData["Information"]) {
      notification.warning({
        message: "Warning",
        description: rawData["Information"],
        key: "reach-limit",
      })
      return
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
      data.push({
        x: new Date(date),
        y: [
          parseFloat(stockData[date]["1. open"]),
          parseFloat(stockData[date]["2. high"]),
          parseFloat(stockData[date]["3. low"]),
          parseFloat(stockData[date]["4. close"]),
        ],
      })
    }

    return [{ data }]
  }, [rawData])

  const options: ApexCharts.ApexOptions = {
    chart: {
      type: "candlestick",
      height: 350,
    },
    xaxis: {
      type: "datetime",
    },
    yaxis: {
      tooltip: {
        enabled: true,
      },
    },
  }

  console.log("fff")

  return (
    <ReactApexChart
      options={options}
      series={series}
      type="candlestick"
      height={350}
      width={"100%"}
    />
  )
})

export default CandleStick
