import { NextResponse } from 'next/server';
import { config } from '@/lib/config';

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

export async function POST(request: Request) {
  try {
    const { imageDataUrl } = await request.json();
    
    // Check if we have an API key
    const apiKey = process.env.MISTRAL_API_KEY;
    
    if (!apiKey) {
      console.warn("No Mistral API key found. Using mock data instead.");
      // Fall back to mock data if no API key
      return NextResponse.json({ text: mockExtractText() });
    }

    const response = await fetch("https://api.mistral.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "pixtral-12b-2409",
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
        max_tokens: 1000
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("Mistral API error:", errorData);
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json({ text: data.choices[0].message.content });
  } catch (error) {
    console.error("Error calling Mistral API:", error);
    // Fall back to mock data if API call fails
    return NextResponse.json({ text: mockExtractText() }, { status: 500 });
  }
} 