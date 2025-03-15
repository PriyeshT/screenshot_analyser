import { NextResponse } from 'next/server';

// Mock function for chat responses
function mockChatResponse(userMessage: string, extractedText: string): string {
  return `Based on the screenshot you shared, I can see this is a dashboard overview showing various metrics.

The dashboard shows:
- 1,245 total users
- 87 active sessions
- 3.2% conversion rate
- $12,450 in revenue

There's also recent activity showing new sign-ups, completed transactions, and support tickets.

Is there anything specific about this dashboard you'd like me to explain?`;
}

export async function POST(request: Request) {
  try {
    const { userMessage, extractedText } = await request.json();
    
    // Check if we have an API key
    const apiKey = process.env.MISTRAL_API_KEY;
    
    if (!apiKey) {
      console.warn("No Mistral API key found. Using mock data instead.");
      // Fall back to mock data if no API key
      return NextResponse.json({ response: mockChatResponse(userMessage, extractedText) });
    }

    const response = await fetch("https://api.mistral.ai/v1/chat/completions", {
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

    const data = await response.json();
    return NextResponse.json({ response: data.choices[0].message.content });
  } catch (error) {
    console.error("Error calling Mistral API for chat:", error);
    // Fall back to mock data if API call fails
    return NextResponse.json({ response: mockChatResponse(userMessage, extractedText) }, { status: 500 });
  }
} 