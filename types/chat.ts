export interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: string
}

export interface Session {
  screenshot: string | null
  extractedText: string
  messages: Message[]
}

