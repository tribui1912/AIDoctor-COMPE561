import { NextResponse } from 'next/server'
import OpenAI from 'openai'

if (!process.env.OPENAI_API_KEY) {
  throw new Error('Missing OPENAI_API_KEY environment variable')
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { messages } = body

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Invalid messages format' },
        { status: 400 }
      )
    }

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant for a hospital website. Provide accurate and helpful information about health and medical topics. If asked about specific medical advice, remind the user to consult with a healthcare professional."
        },
        ...messages
      ],
    })

    if (!response.choices[0].message.content) {
      throw new Error('No response from OpenAI')
    }

    return NextResponse.json({ message: response.choices[0].message.content })
  } catch (error) {
    console.error('OpenAI API error:', error)
    
    // Determine if it's a rate limit error
    const isRateLimit = error instanceof Error && 
      error.message.toLowerCase().includes('rate limit')
    
    return NextResponse.json(
      { 
        error: isRateLimit 
          ? 'Too many requests, please try again later'
          : 'An error occurred while processing your request'
      },
      { 
        status: isRateLimit ? 429 : 500 
      }
    )
  }
}