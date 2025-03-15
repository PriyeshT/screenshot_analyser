"use client"

import type React from "react"

import { useState, useRef, type DragEvent, type ClipboardEvent } from "react"
import { Upload, Image, Clipboard, FileUp } from "lucide-react"

interface ScreenshotUploadProps {
  onUpload: (imageDataUrl: string) => void
  isProcessing?: boolean
}

export function ScreenshotUpload({ onUpload, isProcessing = false }: ScreenshotUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [ripple, setRipple] = useState({ show: false, x: 0, y: 0 })
  const fileInputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0]
      processImageFile(file)
    }
  }

  const handlePaste = (e: ClipboardEvent<HTMLDivElement>) => {
    const items = e.clipboardData.items

    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf("image") !== -1) {
        const file = items[i].getAsFile()
        if (file) {
          processImageFile(file)
          break
        }
      }
    }
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processImageFile(e.target.files[0])
    }
  }

  const processImageFile = (file: File) => {
    if (!file.type.match("image.*")) {
      alert("Please upload an image file")
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      if (e.target && typeof e.target.result === "string") {
        onUpload(e.target.result)
      }
    }
    reader.readAsDataURL(file)
  }

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (containerRef.current && !isProcessing) {
      // Create ripple effect
      const rect = containerRef.current.getBoundingClientRect()
      setRipple({
        show: true,
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      })

      // Hide ripple after animation completes
      setTimeout(() => {
        setRipple({ show: false, x: 0, y: 0 })
      }, 600)

      fileInputRef.current?.click()
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-elevation-2 overflow-hidden">
      <div className="p-4 bg-primary/10 border-b border-primary/20">
        <h3 className="font-medium text-primary-dark">Upload Screenshot</h3>
      </div>

      <div
        ref={containerRef}
        className={`relative p-8 cursor-pointer transition-all overflow-hidden ${
          isDragging ? "bg-primary/5 border-primary" : "bg-white hover:bg-primary/5"
        } ${isProcessing ? "pointer-events-none opacity-70" : ""}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onPaste={handlePaste}
        onClick={handleClick}
        tabIndex={0}
      >
        {/* Ripple effect */}
        {ripple.show && (
          <span
            className="absolute rounded-full bg-primary/20 animate-ripple"
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

        <div className="flex flex-col items-center justify-center text-center py-8">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6">
            <Upload className="h-10 w-10 text-primary" />
          </div>

          <h3 className="text-xl font-medium text-gray-800 mb-2">
            {isProcessing ? "Processing..." : "Upload Screenshot"}
          </h3>

          <p className="text-muted-foreground mb-6 max-w-md">
            Drag and drop your screenshot here, paste from clipboard, or click to browse
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 text-primary-dark">
              <Image size={18} />
              <span>Drag & Drop</span>
            </div>

            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 text-primary-dark">
              <Clipboard size={18} />
              <span>Paste</span>
            </div>

            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 text-primary-dark">
              <FileUp size={18} />
              <span>Browse</span>
            </div>
          </div>

          <input type="file" ref={fileInputRef} onChange={handleFileInputChange} accept="image/*" className="hidden" />
        </div>
      </div>
    </div>
  )
}

