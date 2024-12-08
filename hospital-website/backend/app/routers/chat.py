from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List
from openai import OpenAI
import os

router = APIRouter()

# Initialize OpenAI client
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

class Message(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    messages: List[Message]

@router.post("/chat")
async def create_chat(request: ChatRequest):
    try:
        # Convert Pydantic models to dictionaries
        messages = [{"role": msg.role, "content": msg.content} for msg in request.messages]
        
        # Add system message
        system_message = {
            "role": "system",
            "content": "You are a helpful assistant for a hospital website. Provide accurate and helpful information about health and medical topics. If asked about specific medical advice, remind the user to consult with a healthcare professional."
        }
        
        # Create completion using the OpenAI client
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[system_message] + messages
        )

        if not response.choices[0].message.content:
            raise HTTPException(status_code=500, detail="No response from OpenAI")

        return {"message": response.choices[0].message.content}

    except Exception as e:
        print(f"OpenAI API error: {str(e)}")  # Add this for debugging
        if "rate limit" in str(e).lower():
            raise HTTPException(
                status_code=429,
                detail="Too many requests, please try again later"
            )
        raise HTTPException(
            status_code=500,
            detail="An error occurred while processing your request"
        )