// Configuration settings for the application

export const config = {
  mistral: {
    apiKey: process.env.NEXT_PUBLIC_MISTRAL_API_KEY,
    apiUrl: "https://api.mistral.ai/v1/chat/completions",
    model: "pixtral-12b-2409", // Mistral's vision model
    maxTokens: 1000,
  },
  app: {
    name: "Screenshot Analyzer",
    description: "Upload screenshots and chat with AI to analyze them",
  }
} 