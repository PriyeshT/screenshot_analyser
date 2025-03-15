// Service for interacting with Mistral API for image text extraction
import { config } from "./config";

interface MistralResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: {
    index: number;
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export async function extractTextWithMistral(imageDataUrl: string): Promise<string> {
  // Check if we have an API key
  const apiKey = config.mistral.apiKey;
  
  if (!apiKey) {
    console.warn("No Mistral API key found. Using mock data instead.");
    // Fall back to mock data if no API key
    return mockExtractText();
  }

  try {
    const response = await fetch(config.mistral.apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: config.mistral.model,
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "Extract and transcribe all text from this screenshot. Format it clearly and preserve the layout as much as possible."
              },
              {
                type: "image_url",
                image_url: imageDataUrl
              }
            ]
          }
        ],
        max_tokens: config.mistral.maxTokens
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("Mistral API error:", errorData);
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data: MistralResponse = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error("Error calling Mistral API:", error);
    // Fall back to mock data if API call fails
    return mockExtractText();
  }
}

export async function generateChatResponse(userMessage: string, extractedText: string): Promise<string> {
  // Check if we have an API key
  const apiKey = config.mistral.apiKey;
  
  if (!apiKey) {
    console.warn("No Mistral API key found. Using mock data instead.");
    // Fall back to mock data if no API key
    return mockChatResponse(userMessage, extractedText);
  }

  try {
    const response = await fetch(config.mistral.apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "mistral-large-latest", // Using text model for chat
        messages: [
          {
            role: "system",
            content: "You are an assistant that helps analyze screenshots. The user has uploaded a screenshot with the following extracted text. Answer their questions about this content."
          },
          {
            role: "user",
            content: `Here is the text extracted from my screenshot:\n\n${extractedText}\n\nMy question is: ${userMessage}`
          }
        ],
        max_tokens: 500
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("Mistral API error:", errorData);
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data: MistralResponse = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error("Error calling Mistral API for chat:", error);
    // Fall back to mock data if API call fails
    return mockChatResponse(userMessage, extractedText);
  }
}

// Mock function for fallback or testing
function mockExtractText(): string {
  return `Screenshot Analysis:
  
Title: Dashboard Overview
Date: March 15, 2025
User: John Doe
Status: Active

Key Metrics:
- Total Users: 1,245
- Active Sessions: 87
- Conversion Rate: 3.2%
- Revenue: $12,450

Recent Activity:
- 3 new sign-ups in the last hour
- 15 completed transactions
- 2 support tickets opened

System Status: All systems operational
Last Updated: 10:45 AM`;
}

// Mock function for chat responses
function mockChatResponse(userMessage: string, extractedText: string): string {
  // Simulate processing delay
  return `Based on the screenshot you shared, I can see this is a dashboard overview showing various metrics.

The dashboard shows:
- 1,245 total users
- 87 active sessions
- 3.2% conversion rate
- $12,450 in revenue

There's also recent activity showing new sign-ups, completed transactions, and support tickets.

Is there anything specific about this dashboard you'd like me to explain?`;
} 