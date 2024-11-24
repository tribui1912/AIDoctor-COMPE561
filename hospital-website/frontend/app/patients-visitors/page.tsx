  'use client'
  import { useState, useEffect } from 'react'
  import { Dialog, DialogContent} from '@/components/ui/dialog';
  import { motion, AnimatePresence } from 'framer-motion'
  import { Button } from "@/components/ui/button"
  import { Input } from "@/components/ui/input"
  import { Label } from "@/components/ui/label"
  import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
  
  export default function PatientsVisitors() {
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [isLogin, setIsLogin] = useState(true)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [name, setName] = useState('')
    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault()
      if (isLogin) {
        console.log('Login attempted with:', email, password)
      } else {
        console.log('Sign up attempted with:', name, email, password)
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