"use client"

import { useState, useEffect } from "react"
import { ScreenshotUpload } from "@/components/screenshot-upload"
import { ChatInterface } from "@/components/chat-interface"
import { TextDisplay } from "@/components/text-display"
import { useToast } from "@/hooks/use-toast"
import { extractTextWithMistral, generateChatResponse } from "@/lib/mistral-service"
import type { Message } from "@/types/chat"
import { saveSession, loadSession } from "@/lib/session-storage"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ImageIcon, MessageSquareIcon } from "lucide-react"

export default function Home() {
  const [screenshot, setScreenshot] = useState<string | null>(null)
  const [extractedText, setExtractedText] = useState<string>("")
  const [showExtractedText, setShowExtractedText] = useState<boolean>(true)
  const [messages, setMessages] = useState<Message[]>([])
  const [isProcessing, setIsProcessing] = useState<boolean>(false)
  const [isResponding, setIsResponding] = useState<boolean>(false)
  const [activeTab, setActiveTab] = useState<string>("upload")
  const { toast } = useToast()

  // Load session from local storage on initial render
  useEffect(() => {
    const savedSession = loadSession()
    if (savedSession) {
      setScreenshot(savedSession.screenshot)
      setExtractedText(savedSession.extractedText)
      setMessages(savedSession.messages)

      // If we have a screenshot, switch to chat tab
      if (savedSession.screenshot) {
        setActiveTab("chat")
      }
    }
  }, [])

  // Save session to local storage whenever state changes
  useEffect(() => {
    if (screenshot || messages.length > 0) {
      saveSession({
        screenshot,
        extractedText,
        messages,
      })
    }
  }, [screenshot, extractedText, messages])

  const handleScreenshotUpload = async (imageDataUrl: string) => {
    setScreenshot(imageDataUrl)
    setIsProcessing(true)

    try {
      // Use Mistral API to extract text from the screenshot
      const text = await extractTextWithMistral(imageDataUrl)
      setExtractedText(text)
      toast({
        title: "Screenshot processed",
        description: "The text has been extracted successfully using Mistral AI.",
      })

      // Switch to chat tab after processing
      setActiveTab("chat")
    } catch (error) {
      toast({
        title: "Processing failed",
        description: "Failed to extract text from the screenshot.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content,
      timestamp: new Date().toISOString(),
    }

    setMessages((prev) => [...prev, userMessage])
    setIsResponding(true)

    try {
      // Generate response using Mistral AI
      const response = await generateChatResponse(content, extractedText)

      // Add AI response
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response,
        timestamp: new Date().toISOString(),
      }

      setMessages((prev) => [...prev, aiMessage])
    } catch (error) {
      toast({
        title: "Response failed",
        description: "Failed to get a response from the AI.",
        variant: "destructive",
      })
    } finally {
      setIsResponding(false)
    }
  }

  const handleClearSession = () => {
    setScreenshot(null)
    setExtractedText("")
    setMessages([])
    saveSession(null)
    setActiveTab("upload")
    toast({
      title: "Session cleared",
      description: "All data has been cleared from this session.",
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-light/10 to-secondary-light/10">
      <header className="bg-primary shadow-md">
        <div className="container mx-auto py-6">
          <h1 className="text-3xl font-bold text-white text-center">Screenshot Analyzer</h1>
          <p className="text-primary-foreground/80 text-center mt-2">
            Upload screenshots and chat with AI to analyze them
          </p>
        </div>
      </header>

      <main className="container mx-auto p-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
            <TabsTrigger value="upload" className="flex items-center gap-2">
              <ImageIcon size={18} />
              <span>Upload</span>
            </TabsTrigger>
            <TabsTrigger value="chat" className="flex items-center gap-2" disabled={!screenshot}>
              <MessageSquareIcon size={18} />
              <span>Chat</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex flex-col space-y-6">
                <ScreenshotUpload onUpload={handleScreenshotUpload} isProcessing={isProcessing} />

                {screenshot && (
                  <div className="bg-white rounded-lg shadow-elevation-2 overflow-hidden">
                    <div className="p-4 bg-primary/10 border-b border-primary/20">
                      <h3 className="font-medium text-primary-dark">Preview</h3>
                    </div>
                    <div className="relative p-4">
                      <img
                        src={screenshot || "/placeholder.svg"}
                        alt="Uploaded screenshot"
                        className="w-full object-contain max-h-[400px] rounded-md"
                      />
                    </div>
                  </div>
                )}
              </div>

              {screenshot && (
                <div className="flex flex-col space-y-6">
                  <TextDisplay
                    text={extractedText}
                    isLoading={isProcessing}
                    visible={showExtractedText}
                    onToggleVisibility={() => setShowExtractedText(!showExtractedText)}
                  />

                  <div className="flex justify-between">
                    <button
                      onClick={() => setActiveTab("chat")}
                      className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-full shadow-elevation-1 transition-all flex items-center gap-2"
                      disabled={isProcessing}
                    >
                      <MessageSquareIcon size={18} />
                      <span>Start Chatting</span>
                    </button>

                    <button
                      onClick={() => setScreenshot(null)}
                      className="bg-destructive hover:bg-destructive/90 text-white px-6 py-3 rounded-full shadow-elevation-1 transition-all"
                    >
                      Clear Image
                    </button>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="chat" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-1">
                <div className="bg-white rounded-lg shadow-elevation-2 overflow-hidden h-full">
                  <div className="p-4 bg-primary/10 border-b border-primary/20">
                    <h3 className="font-medium text-primary-dark">Screenshot</h3>
                  </div>
                  <div className="p-4">
                    <img
                      src={screenshot || "/placeholder.svg"}
                      alt="Uploaded screenshot"
                      className="w-full object-contain max-h-[300px] rounded-md mb-4"
                    />

                    <TextDisplay
                      text={extractedText}
                      isLoading={isProcessing}
                      visible={showExtractedText}
                      onToggleVisibility={() => setShowExtractedText(!showExtractedText)}
                      compact={true}
                    />
                  </div>
                </div>
              </div>

              <div className="md:col-span-2">
                <ChatInterface
                  messages={messages}
                  onSendMessage={handleSendMessage}
                  isResponding={isResponding}
                  onClearChat={handleClearSession}
                  disabled={!screenshot || isProcessing}
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

