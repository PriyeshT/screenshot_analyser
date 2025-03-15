"use client"

import { useState } from "react"
import { Eye, EyeOff, Copy, Check, ChevronDown, ChevronUp } from "lucide-react"

interface TextDisplayProps {
  text: string
  isLoading: boolean
  visible: boolean
  onToggleVisibility: () => void
  compact?: boolean
}

export function TextDisplay({ text, isLoading, visible, onToggleVisibility, compact = false }: TextDisplayProps) {
  const [copied, setCopied] = useState(false)
  const [expanded, setExpanded] = useState(!compact)

  const handleCopy = () => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="bg-white rounded-lg shadow-elevation-1 overflow-hidden">
      <div
        className="flex items-center justify-between p-3 bg-primary/5 border-b border-primary/10 cursor-pointer"
        onClick={() => compact && setExpanded(!expanded)}
      >
        <h3 className="font-medium text-primary-dark flex items-center gap-2">
          Extracted Text
          {compact && (expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />)}
        </h3>
        <div className="flex space-x-1">
          <button
            className="p-1.5 rounded-full hover:bg-primary/10 text-primary-dark transition-colors"
            onClick={(e) => {
              e.stopPropagation()
              onToggleVisibility()
            }}
            title={visible ? "Hide text" : "Show text"}
          >
            {visible ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
          <button
            className="p-1.5 rounded-full hover:bg-primary/10 text-primary-dark transition-colors"
            onClick={(e) => {
              e.stopPropagation()
              handleCopy()
            }}
            disabled={!text || isLoading}
            title="Copy text"
          >
            {copied ? <Check size={18} /> : <Copy size={18} />}
          </button>
        </div>
      </div>

      {(expanded || !compact) && (
        <div className="p-4">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-6">
              <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin mb-4"></div>
              <p className="text-muted-foreground">Processing text...</p>
            </div>
          ) : visible ? (
            <div
              className={`${compact ? "max-h-[150px]" : "max-h-[300px]"} overflow-y-auto whitespace-pre-wrap text-sm bg-muted/30 p-3 rounded-md font-mono`}
            >
              {text || "No text extracted yet"}
            </div>
          ) : (
            <div className="py-4 flex items-center justify-center">
              <span className="text-muted-foreground text-sm">Text hidden</span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

