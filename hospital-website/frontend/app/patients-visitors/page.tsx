  'use client'
  import { useState, useEffect } from 'react'
  import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
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
          <DialogContent className="max-w-md mx-auto">
          <Card className="w-full max-w-md overflow-hidden">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-center">
                {isLogin ? 'Login' : 'Sign Up'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <AnimatePresence mode="wait">
                <motion.form
                  key={isLogin ? 'login' : 'signup'}
                  initial={{ opacity: 0, x: isLogin ? -100 : 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: isLogin ? 100 : -100 }}
                  transition={{ duration: 0.3 }}
                  onSubmit={handleSubmit}
                  className="space-y-4"
                >
                  {!isLogin && (
                    <div className="space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <Input 
                        id="name" 
                        type="text" 
                        placeholder="Enter your name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                      />
                    </div>
                  )}
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input 
                      id="password" 
                      type="password" 
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    {isLogin ? 'Log in' : 'Sign up'}
                  </Button>
                </motion.form>
              </AnimatePresence>
              <div className="mt-4 text-center">
                <Button variant="link" onClick={toggleForm}>
                  {isLogin ? "Don't have an account? Sign up" : "Already have an account? Log in"}
                </Button>
              </div>
            </CardContent>
          </Card>
          </DialogContent>
        </Dialog>
      </div>
    )
  }