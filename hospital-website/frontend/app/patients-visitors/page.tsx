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
    <div className="mb-8 w-full max-w-6xl text-left">
      <h1 className="text-3xl font-bold mb-4">Patients & Visitors</h1>
      <p>Information for patients and visitors to make your hospital experience as comfortable as possible.</p>
    </div>

    <div className="w-full max-w-6xl flex flex-col md:flex-row gap-4">

      <div className="flex-1 p-4 bg-white shadow-md rounded-lg order-1 md:order-1">
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
                <p className="text-sm">Dizziness can be caused by a variety of factors such as dehydration, low blood pressure, ear infections, anxiety, or even a side effect of medications. If you feel dizzy regularly or if it’s accompanied by fainting, vision changes, or difficulty walking, you should see a doctor for further evaluation.</p>
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

      <div className="flex-1 p-4 bg-white shadow-md rounded-lg order-2 md:order-2">
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

    <div className="w-1/2 max-w-6xl mt-8">
        <h2 className="text-2xl font-semibold mb-4">Book Appointment</h2>
        <form onSubmit={(e) => {
          e.preventDefault()
          console.log('Appointment booked for:', appointmentDate)
        }} className="space-y-4">
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