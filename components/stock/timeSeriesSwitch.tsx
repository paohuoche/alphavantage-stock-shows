import { useStore } from "@/store/StoreProvider"
import { observer } from "mobx-react-lite"
import React, { useRef } from "react"

import { Radio, RadioChangeEvent, Select, notification } from "antd"

import { EInterval, ETimeSeriesFunction, getEndpoint } from "@/lib/api"

const Main: React.FC = observer(() => {
  const store = useStore()

  const onFnChange = (e: RadioChangeEvent) => {
    store.setFunction(e.target.value)
  }

  const onIntervalChange = (e: RadioChangeEvent) => {
    store.setInterval(e.target.value)
  }

  return (
    <div className="flex items-center justify-start space-x-6">
      <CompanySearch />

      <Radio.Group
        defaultValue={ETimeSeriesFunction.DAILY}
        buttonStyle="solid"
        onChange={onFnChange}
      >
        <Radio.Button value={ETimeSeriesFunction.DAILY}>Daily</Radio.Button>
        <Radio.Button value={ETimeSeriesFunction.WEEKLY}>Weekly</Radio.Button>
        <Radio.Button value={ETimeSeriesFunction.MONTHLY}>Monthly</Radio.Button>
        <Radio.Button value={ETimeSeriesFunction.INTRADAY}>
          Intraday
        </Radio.Button>
      </Radio.Group>

      {store.function === ETimeSeriesFunction.INTRADAY && (
        <Radio.Group
          defaultValue={EInterval["5min"]}
          onChange={onIntervalChange}
        >
          <Radio value={EInterval["1min"]}>1min</Radio>
          <Radio value={EInterval["5min"]}>5min</Radio>
          <Radio value={EInterval["15min"]}>15min</Radio>
          <Radio value={EInterval["30min"]}>30min</Radio>
          <Radio value={EInterval["60min"]}>60min</Radio>
        </Radio.Group>
      )}
    </div>
  )
})

//
const CompanySearch = observer(() => {
  const store = useStore()

  const [value, setValue] = React.useState<string>("IBM")
  const [loading, setLoading] = React.useState<boolean>(false)
  const [options, setOptions] = React.useState<
    {
      value: string
      text: string
    }[]
  >([])

  const timerRef = useRef<NodeJS.Timeout>()

  /**
   * handle input search
   */
  const handleSearch = async (value: string) => {
    setLoading(false)
    clearTimeout(timerRef.current)

    timerRef.current = setTimeout(() => {
      fetch(value)
    }, 200)

    // fetch potiential companies
    const fetch = async (keywords: string) => {
      try {
        setLoading(true)
        const res = await getEndpoint({
          keywords,
        })

        if (res["Information"]) {
          notification.warning({
            message: "Warning",
            description: res["Information"],
            key: "reach-limit",
          })
          return
        }

        let newOptions = res.bestMatches.map((item) => ({
          value: item["1. symbol"],
          text: item["2. name"],
        }))
        setOptions(newOptions)
        setLoading(false)
      } catch (error) {
        setLoading(false)
      }
    }
  }

  /**
   * handle change
   */
  const handleChange = (name: string) => {
    setValue(name)
    store.setSymbol(name)
  }

  return (
    <Select
      loading={loading}
      showSearch
      value={value}
      placeholder="Search for Company"
      style={{ width: 180 }}
      defaultActiveFirstOption={false}
      suffixIcon={null}
      filterOption={false}
      onSearch={handleSearch}
      onChange={handleChange}
      notFoundContent={null}
      options={(options || []).map((d) => ({
        value: d.value,
        label: d.text,
      }))}
    />
  )
})

export default Main
