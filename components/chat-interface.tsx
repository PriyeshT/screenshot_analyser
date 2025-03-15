"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Send, Trash2, Copy, Check, RefreshCw, MessageSquareIcon } from "lucide-react"
import type { Message } from "@/types/chat"
import { ScrollArea } from "@/components/ui/scroll-area"

interface ChatInterfaceProps {
  messages: Message[]
  onSendMessage: (content: string) => void
  isResponding: boolean
  onClearChat: () => void
  disabled: boolean
}

export function ChatInterface({ messages, onSendMessage, isResponding, onClearChat, disabled }: ChatInterfaceProps) {
  const [input, setInput] = useState("")
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const [ripple, setRipple] = useState({ show: false, x: 0, y: 0 })

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim() && !disabled && !isResponding) {
      onSendMessage(input)
      setInput("")
    }
  }

  const handleCopy = (id: string, content: string) => {
    navigator.clipboard.writeText(content)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  const handleButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    // Create ripple effect
    const button = e.currentTarget
    const rect = button.getBoundingClientRect()
    setRipple({
      show: true,
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    })

    // Hide ripple after animation completes
    setTimeout(() => {
      setRipple({ show: false, x: 0, y: 0 })
    }, 600)

    handleSubmit(e)
  }

  return (
    <div className="bg-white rounded-lg shadow-elevation-2 overflow-hidden h-full flex flex-col">
      <div className="p-4 bg-primary/10 border-b border-primary/20 flex justify-between items-center">
        <h3 className="font-medium text-primary-dark">Chat with AI</h3>
        <button
          onClick={onClearChat}
          disabled={messages.length === 0}
          className={`p-2 rounded-full ${
            messages.length === 0
              ? "text-muted-foreground/50 cursor-not-allowed"
              : "text-destructive hover:bg-destructive/10"
          } transition-colors`}
          title="Clear chat"
        >
          <Trash2 size={18} />
        </button>
      </div>

      <ScrollArea className="flex-grow p-4 h-[calc(70vh-180px)]">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-muted-foreground p-6">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <MessageSquareIcon className="h-8 w-8 text-primary" />
            </div>
            <p className="text-center mb-2">No messages yet</p>
            <p className="text-center text-sm">Ask questions about the screenshot to get insights</p>
          </div>
        ) : (
          <div className="space-y-6">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[85%] rounded-2xl p-4 shadow-elevation-1 ${
                    message.role === "user"
                      ? "bg-primary text-primary-foreground rounded-tr-none"
                      : "bg-surface-variant text-on-surface-variant rounded-tl-none"
                  }`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-medium text-xs">{message.role === "user" ? "You" : "AI Assistant"}</span>
                    <span className="text-xs opacity-70 ml-4">{formatTimestamp(message.timestamp)}</span>
                  </div>
                  <div className="whitespace-pre-wrap">{message.content}</div>
                  {message.role === "assistant" && (
                    <div className="flex justify-end mt-2">
                      <button
                        className={`p-1.5 rounded-full ${
                          copiedId === message.id
                            ? "bg-secondary/20 text-secondary-dark"
                            : "hover:bg-on-surface/10 text-on-surface-variant"
                        } transition-colors`}
                        onClick={() => handleCopy(message.id, message.content)}
                      >
                        {copiedId === message.id ? <Check size={16} /> : <Copy size={16} />}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {isResponding && (
              <div className="flex justify-start">
                <div className="max-w-[85%] rounded-2xl p-4 bg-surface-variant text-on-surface-variant rounded-tl-none shadow-elevation-1">
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-medium text-xs">AI Assistant</span>
                  </div>
                  <div className="flex space-x-2 items-center">
                    <RefreshCw size={16} className="animate-spin" />
                    <span>Thinking...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </ScrollArea>

      <div className="p-4 border-t border-outline/20">
        <form onSubmit={handleSubmit} className="flex items-end gap-2">
          <div className="flex-grow relative">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={disabled ? "Upload a screenshot first" : "Ask about the screenshot..."}
              disabled={disabled || isResponding}
              className="w-full p-3 pr-12 rounded-2xl border border-outline/30 focus:border-primary focus:ring-1 focus:ring-primary outline-none resize-none min-h-[60px] max-h-[120px] placeholder:text-muted-foreground/70"
              rows={1}
            />
            <div className="absolute right-3 bottom-3">
              {input.length > 0 && <span className="text-xs text-muted-foreground mr-2">{input.length} chars</span>}
            </div>
          </div>

          <button
            type="submit"
            disabled={!input.trim() || disabled || isResponding}
            className={`relative overflow-hidden p-3 rounded-full ${
              !input.trim() || disabled || isResponding
                ? "bg-muted text-muted-foreground cursor-not-allowed"
                : "bg-primary text-white hover:bg-primary-dark"
            } transition-colors shadow-elevation-1`}
            onClick={handleButtonClick}
          >
            {/* Ripple effect */}
            {ripple.show && (
              <span
                className="absolute rounded-full bg-white/20 animate-ripple"
                style={{
                  left: ripple.x,
                  top: ripple.y,
                  width: "5px",
                  height: "5px",
                  marginLeft: "-2.5px",
                  marginTop: "-2.5px",
                }}
              />
            )}
            <Send size={20} />
          </button>
        </form>
      </div>
    </div>
  )
}

