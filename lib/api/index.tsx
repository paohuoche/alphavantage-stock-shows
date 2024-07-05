import { get, jsonResponseHandler } from "./methods"
import withErrorHandler from "./withErrorHandler"

export enum ETimeSeriesFunction {
  INTRADAY = "TIME_SERIES_INTRADAY",
  DAILY = "TIME_SERIES_DAILY",
  WEEKLY = "TIME_SERIES_WEEKLY",
  MONTHLY = "TIME_SERIES_MONTHLY",
}

export enum EInterval {
  "1min" = "1min",
  "5min" = "5min",
  "15min" = "15min",
  "30min" = "30min",
  "60min" = "60min",
}

type GetStockDataParams = {
  function: ETimeSeriesFunction
  symbol: string
  interval?: EInterval
}

const API_KEY = "demo" // 4SG88F2EBUNLZB9R
// const API_KEY = "RIBXT3XYLI69PC0Q" // 4SG88F2EBUNLZB9R

/**
 * Get stock data
 */
export const getStockData = (params: GetStockDataParams) => {
  return withErrorHandler(() =>
    get("https://www.alphavantage.co/query", {
      // get("http://127.0.0.1:4010/query", {
      ...params,
      apikey: API_KEY,
    }).then((res) => jsonResponseHandler<GetStockDataResponse>(res)),
  )
}

export type StockDataItem = {
  "1. open": string
  "2. high": string
  "3. low": string
  "4. close": string
  "5. volume": string
}
export type GetStockDataResponse = {
  "Meta Data": {
    "1. Information": string
    "2. Symbol": string
    "3. Last Refreshed": string
    "4. Output Size": string
    "5. Time Zone": string
  }

  // a little bit wired for the api response, normally the response structure should be the same for different query.
  "Time Series (Daily)"?: Record<string, StockDataItem>
  "Weekly Time Series"?: Record<string, StockDataItem>
  "Monthly Time Series"?: Record<string, StockDataItem>
  "Time Series (1min)"?: Record<string, StockDataItem>
  "Time Series (5min)"?: Record<string, StockDataItem>
  "Time Series (15min)"?: Record<string, StockDataItem>
  "Time Series (30min)"?: Record<string, StockDataItem>
  "Time Series (60min)"?: Record<string, StockDataItem>

  Information?: string // that means the query reach the limit
}

/**
 * Get endpoint
 */
export const getEndpoint = (params: { keywords: string }) => {
  return withErrorHandler(() =>
    get("https://www.alphavantage.co/query", {
      function: "SYMBOL_SEARCH",
      keywords: params.keywords,
      apikey: API_KEY,
    }).then((res) => jsonResponseHandler<EndPointResponse>(res)),
  )
}

type EndPointResponse = {
  bestMatches: Array<{
    "1. symbol": string
    "2. name": string
    "3. type": string
    "4. region": string
    "5. marketOpen": string
    "6. marketClose": string
    "7. timezone": string
    "8. currency": string
    "9. matchScore": string
  }>

  Information?: string // that means the query reach the limit
}
