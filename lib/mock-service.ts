export async function mockExtractText(imageDataUrl: string): Promise<string> {
  // Simulate processing delay
  await new Promise((resolve) => setTimeout(resolve, 1500))

  // Return mock extracted text
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
Last Updated: 10:45 AM`
}

// Simulate AI chat response
export async function mockChatResponse(userMessage: string, extractedText: string): Promise<string> {
  // Simulate processing delay
  await new Promise((resolve) => setTimeout(resolve, 2000))

  // Simple keyword-based responses
  const userMessageLower = userMessage.toLowerCase()

  if (userMessageLower.includes("user") || userMessageLower.includes("users")) {
    return "Based on the screenshot, there are 1,245 total users, with 87 currently active sessions. There have been 3 new sign-ups in the last hour."
  }

  if (
    userMessageLower.includes("revenue") ||
    userMessageLower.includes("money") ||
    userMessageLower.includes("income")
  ) {
    return "The screenshot shows a revenue of $12,450. The conversion rate is 3.2%, which suggests there's room for improvement in your sales funnel."
  }

  if (userMessageLower.includes("status") || userMessageLower.includes("system")) {
    return "According to the screenshot, all systems are operational. The dashboard was last updated at 10:45 AM."
  }

  if (userMessageLower.includes("activity") || userMessageLower.includes("recent")) {
    return "Recent activity shown in the screenshot includes 3 new sign-ups in the last hour, 15 completed transactions, and 2 support tickets that have been opened."
  }

  if (userMessageLower.includes("date") || userMessageLower.includes("time")) {
    return "The screenshot shows data from March 15, 2025. The dashboard was last updated at 10:45 AM."
  }

  // Default response
  return "Based on the screenshot, I can see this is a dashboard overview for John Doe showing various metrics including users, revenue, and system status. What specific information would you like to know about the data shown?"
}

