'use client'
import { useState, useEffect } from 'react'
import { Dialog, DialogContent} from '@/components/ui/dialog';
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function PatientsVisitors() {
const [isPopupOpen, setIsPopupOpen] = useState(false);
const [isLogin, setIsLogin] = useState(true)
const [email, setEmail] = useState('')
const [password, setPassword] = useState('')
const [name, setName] = useState('')
const [appointmentDate, setAppointmentDate] = useState('')
const [chatMessage, setChatMessage] = useState('')
const [chatMessages, setChatMessages] = useState<string[]>([])
const [messages, setMessages] = useState<{ role: 'user' | 'assistant', content: string }[]>([])
const [isLoading, setIsLoading] = useState(false)
const [input, setInput] = useState('')

const handleAppointmentSubmit = (e: React.FormEvent) => {
  e.preventDefault()
  console.log('Appointment booked for:', appointmentDate)
}

const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault()
  if (isLogin) {
    console.log('Login attempted with:', email, password)
  } else {
    console.log('Sign up attempted with:', name, email, password)
  }
}

const handleChatSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  if (!input.trim()) return

  const userMessage = { role: 'user' as const, content: input }
  setMessages(prev => [...prev, userMessage])
  setInput('')
  setIsLoading(true)

  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
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
  setIsPopupOpen(true);
}, []); // Empty dependency array means it runs once when the component mounts

return (
  <div className="flex flex-col items-center min-h-screen">
    <div className="mb-8">
      <h1 className="text-3xl font-bold mb-4">Patients & Visitors</h1>
      <p>Information for patients and visitors to make your hospital experience as comfortable as possible.</p>
    </div>

  <div className="w-full max-w-6xl flex flex-col md:flex-row gap-4">
    <div className="flex-1 p-4 bg-white shadow-md rounded-lg order-2 md:order-1">
      <h2 className="text-2xl font-semibold mb-4">Book Appointment</h2>
      <form onSubmit={handleAppointmentSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="appointment-name">Name</Label>
          <Input id="appointment-name" placeholder="Enter your name" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="appointment-email">Email</Label>
          <Input id="appointment-email" type="email" placeholder="Enter your email" required />
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

    <div className="flex-1 p-4 bg-white shadow-md rounded-lg order-1 md:order-2">
      <h2 className="text-2xl font-semibold mb-4">Chat with Us</h2>
      <div className="h-[400px] overflow-y-auto mb-4 p-2 border rounded-md">
      {messages.map((message, index) => (
          <div key={index} className={`mb-4 ${message.role === 'user' ? 'text-right' : 'text-left'}`}>
            <span className={`inline-block p-2 rounded-lg ${message.role === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}`}>
              {message.content}
            </span>
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

  </div>



    <Dialog open={isPopupOpen} onOpenChange={setIsPopupOpen}>
      <DialogContent className="sm:max-w-md">
        <div className="px-6 py-4">
          <h2 className="text-2xl font-semibold text-center mb-6">
            {isLogin ? 'Login' : 'Sign Up'}
          </h2>
          
          <AnimatePresence mode="wait">
            <motion.form
              key={isLogin ? 'login' : 'signup'}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              onSubmit={handleSubmit}
              className="space-y-4"
            >
              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium">
                    Name
                  </Label>
                  <Input 
                    id="name" 
                    type="text" 
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full"
                    required
                  />
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email
                </Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">
                  Password
                </Label>
                <Input 
                  id="password" 
                  type="password" 
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full"
                  required
                />
              </div>

              <Button type="submit" className="w-full mt-6">
                {isLogin ? 'Log in' : 'Sign up'}
              </Button>
            </motion.form>
          </AnimatePresence>

          <div className="mt-6 text-center">
            <Button 
              variant="link" 
              onClick={toggleForm}
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              {isLogin 
                ? "Don't have an account? Sign up" 
                : "Already have an account? Log in"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  </div>
)
}