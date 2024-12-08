'use client'
import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { setCookie, getCookie } from 'cookies-next';
import dynamic from 'next/dynamic'
import { Dispatch, SetStateAction } from 'react'

// Properly type the dynamic import
const AuthDialog = dynamic(
  () => import('@/components/auth-dialog'),
  { ssr: false }
) as unknown as React.ComponentType<{
  isOpen: boolean;
  onClose: Dispatch<SetStateAction<boolean>>;
}>;

export default function PatientsVisitors() {
const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
const [isPopupOpen, setIsPopupOpen] = useState(false);
const [isLogin, setIsLogin] = useState(true)
const [email, setEmail] = useState('')
const [password, setPassword] = useState('')
const [name, setName] = useState('')
const [appointmentDate, setAppointmentDate] = useState('')
const [messages, setMessages] = useState<{ role: 'user' | 'assistant', content: string }[]>([])
const [isLoading, setIsLoading] = useState(false)
const [input, setInput] = useState('')

const handleAppointmentSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsLoading(true);

  try {
    const response = await fetch('http://localhost:8000/api/appointments/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getCookie('authToken')}`,
      },
      body: JSON.stringify({
        date: new Date(appointmentDate).toISOString(),
        reason: "Regular checkup",
        status: "pending",
        additional_notes: "",
        user_id: null
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Failed to book appointment');
    }

    const data = await response.json();
    console.log('Appointment booked successfully:', data);
    alert('Appointment booked successfully!');
    // Clear the form
    setAppointmentDate('');
    setName('');
    setEmail('');
  } catch (error) {
    console.error('Error:', error);
    alert(error instanceof Error ? error.message : 'An error occurred while booking the appointment.');
  } finally {
    setIsLoading(false);
  }
};

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsLoading(true);

  try {
    const endpoint = 'http://localhost:8000/api/auth/login';
    const body = new URLSearchParams({
      grant_type: 'password',
      username: email,
      password: password,
      scope: '',
      client_id: '',
      client_secret: ''
    });

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: body.toString(),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response text:', errorText);
      throw new Error('Login failed');
    }

    const data = await response.json();
    console.log('Login successful:', data);

    // Store the token in cookies
    setCookie('authToken', data.access_token, { maxAge: 60 * 60 * 24 }); // 1 day

    setIsAuthenticated(true);
    setIsPopupOpen(false);
  } catch (error: unknown) {
    console.error('Error:', error);
    if (error instanceof Error) {
      alert(error.message);
    } else {
      alert('An unexpected error occurred');
    }
  } finally {
    setIsLoading(false);
  }
};

const handleChatSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  if (!input.trim()) return

  const userMessage = { role: 'user' as const, content: input }
  setMessages(prev => [...prev, userMessage])
  setInput('')
  setIsLoading(true)

  try {
    const response = await fetch('http://localhost:8000/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getCookie('authToken')}`,
      },
      body: JSON.stringify({ messages: [...messages, userMessage] }),
    })

    if (!response.ok) {
      throw new Error('Failed to fetch response')
    }

    const data = await response.json()
    setMessages(prev => [...prev, { role: 'assistant', content: data.message }])
  } catch (error) {
    console.error('Error:', error)
    setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' }])
  } finally {
    setIsLoading(false)
  }
}

const toggleForm = () => setIsLogin(!isLogin)

useEffect(() => {
  const token = getCookie('authToken');
  if (token) {
    setIsAuthenticated(true);
  } else {
    setIsAuthenticated(false);
    setIsPopupOpen(true);
  }
}, []);

const formatMessage = (text: string) => {
  // Remove ** markers and convert to proper HTML/CSS classes
  let formatted = text.replace(/\*\*(.*?)\*\*/g, '$1')
  
  // Split into paragraphs
  const paragraphs = formatted.split(/\n{2,}/)
  
  // Process each paragraph
  return paragraphs.map((paragraph) => {
    // Check if it's a numbered point
    const numberedPoint = paragraph.match(/^\d+\.\s+(.+)/)
    if (numberedPoint) {
      return `<div class="ml-4 mb-2">
        <span class="font-bold mr-2">${numberedPoint[0].split('.')[0]}.</span>
        ${numberedPoint[1]}
      </div>`
    }
    
    // Check if it's a heading/title (previously bold text)
    if (paragraph.includes(':')) {
      const [title, content] = paragraph.split(':')
      return `<div class="mb-2">
        <span class="font-bold">${title}:</span>
        ${content || ''}
      </div>`
    }
    
    // Regular paragraph
    return `<div class="mb-2">${paragraph}</div>`
  }).join('')
}

// Don't render anything until we know the authentication state
if (isAuthenticated === null) {
  return null; // or a loading spinner
}

return (
  <div className="flex flex-col items-center min-h-screen">
    {isAuthenticated ? (
      <>
        <div className="mb-8 w-full max-w-6xl text-left">
          <h1 className="text-3xl font-bold mb-4">Patients & Visitors</h1>
          <p>Information for patients and visitors to make your hospital experience as comfortable as possible.</p>
        </div>

        <div className="w-full max-w-6xl flex flex-col gap-4">
          <div className="flex-1 p-4 bg-white shadow-md rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">Chat with Us</h2>
            <div className="h-[500px] overflow-y-auto mb-4 p-2 border rounded-md">
              {messages.map((message, index) => (
                <div 
                  key={index} 
                  className={`mb-4 ${message.role === 'user' ? 'text-right' : 'text-left'}`}
                >
                  <div 
                    className={`inline-block p-4 rounded-lg ${
                      message.role === 'user' 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-gray-200 text-black'
                    }`}
                  >
                    {message.role === 'user' ? (
                      message.content
                    ) : (
                      <div 
                        dangerouslySetInnerHTML={{ __html: formatMessage(message.content) }}
                        className="space-y-2"
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            <form onSubmit={handleChatSubmit} className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message here..."
                className="flex-grow"
              />
              <Button type="submit">Send</Button>
            </form>
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 p-4 bg-white shadow-md rounded-lg">
              <h2 className="text-2xl font-semibold mb-4">Frequently Asked Questions</h2>
              <div className="h-[400px] overflow-y-auto p-2 border rounded-md">
                <div className="space-y-4">
                  <div className="p-4 bg-gray-100 shadow-md rounded-lg">
                    <h3 className="font-semibold">I have a persistent cough. What could be causing it?</h3>
                    <p className="text-sm">A persistent cough could be caused by several things, including a viral infection (like the common cold or flu), allergies, asthma, or even acid reflux. If the cough lasts for more than a couple of weeks or is accompanied by other symptoms like fever, difficulty breathing, or chest pain, your doctor may suggest further tests.</p>
                  </div>
                  <div className="p-4 bg-gray-100 shadow-md rounded-lg">
                    <h3 className="font-semibold">I’m experiencing chest pain. Should I be worried?</h3>
                    <p className="text-sm">Chest pain can be a sign of a heart problem, such as angina or a heart attack, but it could also be caused by less serious issues like muscle strain, acid reflux, or anxiety. It's important to see a doctor immediately if the pain is severe, lasts longer than a few minutes, or is accompanied by shortness of breath, nausea, or sweating.</p>
                  </div>
                  <div className="p-4 bg-gray-100 shadow-md rounded-lg">
                    <h3 className="font-semibold">I have a headache that won’t go away. What could it be?</h3>
                    <p className="text-sm">A persistent headache could be due to tension, migraines, or even sinus issues. However, if the headache is very severe, sudden, or accompanied by other symptoms like vision changes or vomiting, it could be a sign of something more serious like a brain injury or a stroke. Your doctor will help determine the cause based on your symptoms and medical history.</p>
                  </div>
                  <div className="p-4 bg-gray-100 shadow-md rounded-lg">
                    <h3 className="font-semibold">Why am I feeling lightheaded or dizzy?</h3>
                    <p className="text-sm">Dizziness can be caused by a variety of factors such as dehydration, low blood pressure, ear infections, anxiety, or even a side effect of medications. If you feel dizzy regularly or if it's accompanied by fainting, vision changes, or difficulty walking, you should see a doctor for further evaluation.</p>
                  </div>
                  <div className="p-4 bg-gray-100 shadow-md rounded-lg">
                    <h3 className="font-semibold">I have stomach pain and bloating. What should I do?</h3>
                    <p className="text-sm">Stomach pain and bloating can be caused by digestive issues like gas, constipation, food intolerances (like lactose or gluten), or more serious conditions such as irritable bowel syndrome (IBS), ulcers, or infections. Your doctor may recommend dietary changes or tests like blood work or an ultrasound to determine the cause.</p>
                  </div>
                  <div className="p-4 bg-gray-100 shadow-md rounded-lg">
                    <h3 className="font-semibold">Why do I have frequent urination?</h3>
                    <p className="text-sm">Frequent urination can be a symptom of a urinary tract infection (UTI), diabetes, or prostate issues in men. It can also occur if you’re drinking more fluids than usual or consuming diuretics like caffeine. If it's persistent or accompanied by pain, blood in the urine, or a burning sensation, it’s important to visit a doctor.</p>
                  </div>
                  <div className="p-4 bg-gray-100 shadow-md rounded-lg">
                    <h3 className="font-semibold">I’m having trouble sleeping. What could be the cause?</h3>
                    <p className="text-sm">Excessive thirst can be a sign of dehydration, diabetes, or an electrolyte imbalance. If it’s happening regularly or if you're also experiencing frequent urination, fatigue, or blurry vision, it’s important to consult a doctor to rule out conditions like diabetes.</p>
                  </div>
                  <div className="p-4 bg-gray-100 shadow-md rounded-lg">
                    <h3 className="font-semibold">Why am I always feeling thirsty?</h3>
                    <p className="text-sm">Trouble sleeping, or insomnia, can be caused by stress, anxiety, caffeine intake, sleep apnea, or other underlying health conditions. If poor sleep persists, it can affect your health, so your doctor may ask about your sleep habits, lifestyle, and may recommend a sleep study or relaxation techniques.</p>
                  </div>
                  <div className="p-4 bg-gray-100 shadow-md rounded-lg">
                    <h3 className="font-semibold">I have unexplained weight loss. Should I be concerned?</h3>
                    <p className="text-sm">Unintentional weight loss can be caused by a variety of factors including thyroid issues, diabetes, cancer, or digestive problems. If you're losing weight without trying, it's important to visit a doctor for an evaluation to rule out any serious conditions.</p>
                  </div>
                  <div className="p-4 bg-gray-100 shadow-md rounded-lg">
                    <h3 className="font-semibold">Why do I have joint pain and stiffness?</h3>
                    <p className="text-sm">Joint pain and stiffness can be caused by many factors, such as arthritis, overuse of muscles, or an injury. If the pain is persistent or worsens over time, it could indicate a chronic condition like osteoarthritis or rheumatoid arthritis. Your doctor can recommend treatments, lifestyle changes, or refer you to a specialist.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex-1 p-4 bg-white shadow-md rounded-lg">
              <h2 className="text-2xl font-semibold mb-4">Book Appointment</h2>
              <form onSubmit={handleAppointmentSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="appointment-name">Name</Label>
                  <Input
                    id="appointment-name"
                    placeholder="Enter your name"
                    required
                    value={name} // Bind state
                    onChange={(e) => setName(e.target.value)} // Handle change
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="appointment-email">Email</Label>
                  <Input
                    id="appointment-email"
                    type="email"
                    placeholder="Enter your email"
                    required
                    value={email} // Bind state
                    onChange={(e) => setEmail(e.target.value)} // Handle change
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="appointment-date">Select Date</Label>
                  <Input
                    id="appointment-date"
                    type="date"
                    value={appointmentDate}
                    onChange={(e) => setAppointmentDate(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full">Book Appointment</Button>
              </form>
            </div>
          </div>
        </div>
      </>
    ) : (
      <AuthDialog 
        isOpen={isPopupOpen} 
        onClose={setIsPopupOpen}
      />
    )}
  </div>
)
}