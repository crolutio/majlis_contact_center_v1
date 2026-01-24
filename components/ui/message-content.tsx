"use client"

import React from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { MessageChart, parseChartFromContent } from './message-chart'

interface MessageContentProps {
  content: string
  className?: string
}

export function MessageContent({ content, className }: MessageContentProps) {
  const { chartData, remainingContent } = parseChartFromContent(content)

  return (
    <div className={className}>
      {/* Render chart if found */}
      {chartData && (
        <MessageChart chartData={chartData} />
      )}

      {/* Render remaining content as markdown */}
      {remainingContent && (
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          className="text-sm leading-relaxed whitespace-pre-wrap [&_table]:w-full [&_table]:border-collapse [&_th]:border [&_td]:border [&_th]:px-2 [&_td]:px-2 [&_th]:py-1 [&_td]:py-1"
        >
          {remainingContent}
        </ReactMarkdown>
      )}
    </div>
  )
}