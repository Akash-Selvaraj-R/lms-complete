"use client"

import { useState } from "react"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"
import { Button } from "@/components/ui/button"

// Mock data for the chart
const generateMockData = (days: number) => {
  const data = []
  const now = new Date()

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date()
    date.setDate(now.getDate() - i)

    // Generate some random data
    const issued = Math.floor(Math.random() * 5) + 1
    const returned = Math.floor(Math.random() * 5)

    data.push({
      date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      issued,
      returned,
    })
  }

  return data
}

export function DashboardChart() {
  const [timeRange, setTimeRange] = useState<"7d" | "14d" | "30d">("7d")
  const [data, setData] = useState(() => generateMockData(7))

  const handleRangeChange = (range: "7d" | "14d" | "30d") => {
    setTimeRange(range)

    const days = range === "7d" ? 7 : range === "14d" ? 14 : 30
    setData(generateMockData(days))
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleRangeChange("7d")}
          className={`${
            timeRange === "7d"
              ? "bg-purple-900/50 text-purple-300 border-purple-500"
              : "border-gray-700 text-gray-400 hover:bg-gray-800 hover:text-white"
          }`}
        >
          7 Days
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleRangeChange("14d")}
          className={`${
            timeRange === "14d"
              ? "bg-purple-900/50 text-purple-300 border-purple-500"
              : "border-gray-700 text-gray-400 hover:bg-gray-800 hover:text-white"
          }`}
        >
          14 Days
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleRangeChange("30d")}
          className={`${
            timeRange === "30d"
              ? "bg-purple-900/50 text-purple-300 border-purple-500"
              : "border-gray-700 text-gray-400 hover:bg-gray-800 hover:text-white"
          }`}
        >
          30 Days
        </Button>
      </div>

      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorIssued" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#9333ea" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#9333ea" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorReturned" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="date"
              tick={{ fill: "#9ca3af" }}
              axisLine={{ stroke: "#374151" }}
              tickLine={{ stroke: "#374151" }}
            />
            <YAxis tick={{ fill: "#9ca3af" }} axisLine={{ stroke: "#374151" }} tickLine={{ stroke: "#374151" }} />
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1f2937",
                borderColor: "#374151",
                color: "#f9fafb",
              }}
              itemStyle={{ color: "#f9fafb" }}
              labelStyle={{ color: "#f9fafb" }}
            />
            <Legend
              verticalAlign="top"
              height={36}
              wrapperStyle={{ paddingTop: "10px" }}
              formatter={(value) => <span style={{ color: "#f9fafb" }}>{value}</span>}
            />
            <Area
              type="monotone"
              dataKey="issued"
              name="Books Issued"
              stroke="#9333ea"
              fillOpacity={1}
              fill="url(#colorIssued)"
            />
            <Area
              type="monotone"
              dataKey="returned"
              name="Books Returned"
              stroke="#06b6d4"
              fillOpacity={1}
              fill="url(#colorReturned)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
