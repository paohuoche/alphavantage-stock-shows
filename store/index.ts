import { makeAutoObservable } from "mobx"

import { EInterval, ETimeSeriesFunction } from "@/lib/api"

export default class Root {
  function: ETimeSeriesFunction = ETimeSeriesFunction.DAILY
  symbol = "IBM"
  interval: EInterval = EInterval["5min"]

  constructor() {
    makeAutoObservable(this)
  }

  setSymbol(symbol: string) {
    this.symbol = symbol
  }

  setFunction(fn: ETimeSeriesFunction) {
    this.function = fn
    this.interval = EInterval["5min"]
  }

  setInterval(interval: EInterval) {
    this.interval = interval
  }
}
