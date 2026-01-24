"use client"

import React from 'react'
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LineChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  Legend
} from 'recharts'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from './chart'

interface ChartData {
  type: 'pie' | 'bar' | 'line'
  data: Array<{
    name: string
    value: number
    [key: string]: any
  }>
  title?: string
}

interface MessageChartProps {
  chartData: ChartData
  className?: string
}

// Color palette for charts
const COLORS = [
  '#0088FE',
  '#00C49F',
  '#FFBB28',
  '#FF8042',
  '#8884d8',
  '#82ca9d',
  '#ffc658',
  '#ff7c7c',
  '#8dd1e1',
  '#d084d0'
]

export function MessageChart({ chartData, className }: MessageChartProps) {
  const { type, data, title } = chartData

  // Create chart config for the ChartContainer
  const chartConfig = data.reduce((config, item, index) => {
    config[item.name.toLowerCase().replace(/\s+/g, '')] = {
      label: item.name,
      color: COLORS[index % COLORS.length],
    }
    return config
  }, {} as any)

  const renderChart = () => {
    switch (type) {
      case 'pie':
        return (
          <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[250px]">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <ChartTooltip content={<ChartTooltipContent />} />
            </PieChart>
          </ChartContainer>
        )

      case 'bar':
        return (
          <ChartContainer config={chartConfig} className="h-[300px]">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </ChartContainer>
        )

      case 'line':
        return (
          <ChartContainer config={chartConfig} className="h-[300px]">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#8884d8"
                strokeWidth={2}
                dot={{ fill: '#8884d8' }}
              />
            </LineChart>
          </ChartContainer>
        )

      default:
        return <div className="text-sm text-muted-foreground">Unsupported chart type: {type}</div>
    }
  }

  return (
    <div className={`my-4 ${className || ''}`}>
      {title && (
        <h4 className="text-sm font-medium mb-2 text-center">{title}</h4>
      )}
      {renderChart()}
    </div>
  )
}

// Function to parse chart data from message content
export function parseChartFromContent(content: string): { chartData: ChartData | null; remainingContent: string } {
  // Look for chart blocks in the content - more robust regex for multiline JSON
  const chartRegex = /chart\s*(\{[\s\S]*?\n\})/i
  const match = content.match(chartRegex)

  if (!match) {
    // Try alternative format without the "chart" prefix (just JSON)
    const jsonRegex = /(\{[\s\S]*?"type"\s*:\s*"pie"[\s\S]*?\n\})/i
    const jsonMatch = content.match(jsonRegex)
    if (jsonMatch) {
      try {
        const chartData: ChartData = JSON.parse(jsonMatch[1])
        const remainingContent = content.replace(jsonRegex, '').trim()
        return { chartData, remainingContent }
      } catch (error) {
        console.error('Failed to parse JSON chart data:', error)
      }
    }
    return { chartData: null, remainingContent: content }
  }

  try {
    const chartJson = match[1]
    const chartData: ChartData = JSON.parse(chartJson)

    // Remove the chart block from content
    const remainingContent = content.replace(chartRegex, '').trim()

    return { chartData, remainingContent }
  } catch (error) {
    console.error('Failed to parse chart data:', error)
    return { chartData: null, remainingContent: content }
  }
}