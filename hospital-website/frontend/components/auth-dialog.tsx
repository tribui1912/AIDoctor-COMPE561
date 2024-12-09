'use client'

import { useState } from 'react';
import { Dispatch, SetStateAction } from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { setCookie } from 'cookies-next';
interface AuthDialogProps {
  isOpen: boolean;
  onClose: Dispatch<SetStateAction<boolean>>;
  onAuthSuccess?: () => void;
}

export default function AuthDialog({ isOpen, onClose, onAuthSuccess }: AuthDialogProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const endpoint = isLogin 
        ? 'http://localhost:8000/api/auth/login'
        : 'http://localhost:8000/api/auth/signup';

      const body = isLogin 
        ? new URLSearchParams({
            grant_type: 'password',
            username: email,
            password: password,
            scope: '',
            client_id: '',
            client_secret: ''
          })
        : JSON.stringify({
            name: email.split('@')[0], // Using email username as name for now
            email: email,
            password: password,
            phone: ''
          });

      const headers = {
        'Content-Type': isLogin 
          ? 'application/x-www-form-urlencoded'
          : 'application/json',
      };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: headers,
        body: isLogin ? body.toString() : body,
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response text:', errorText);
        throw new Error(isLogin ? 'Login failed' : 'Registration failed');
      }

      const data = await response.json();

      if (isLogin) {
        setCookie('authToken', data.access_token, { maxAge: 60 * 60 * 24 });
        onClose(false);
        onAuthSuccess?.();
      } else {
        // After successful registration, automatically log in
        const loginResponse = await fetch('http://localhost:8000/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            grant_type: 'password',
            username: email,
            password: password,
            scope: '',
            client_id: '',
            client_secret: ''
          }).toString(),
        });

        if (!loginResponse.ok) {
          throw new Error('Auto-login after registration failed');
        }

        const loginData = await loginResponse.json();
        setCookie('authToken', loginData.access_token, { maxAge: 60 * 60 * 24 });
        onClose(false);
        onAuthSuccess?.();
      }
    } catch (error) {
      console.error('Error:', error);
      alert(error instanceof Error ? error.message : 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-white dark:bg-zinc-950 border border-blue-600/20">
        <DialogTitle className="text-xl font-semibold text-blue-600 dark:text-blue-400">
          {isLogin ? 'Login to Your Account' : 'Create an Account'}
        </DialogTitle>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="border-blue-600/20"
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
              className="border-blue-600/20"
            />
          </div>

          <Button 
            type="submit" 
            className="w-full bg-blue-600/20 text-blue-600 dark:text-blue-400 hover:bg-blue-600/30 border border-blue-600/20"
            disabled={isLoading}
          >
            {isLoading ? 'Processing...' : (isLogin ? 'Login' : 'Sign Up')}
          </Button>
        </form>

        <div className="text-center mt-4">
          <Button
            variant="link"
            onClick={() => setIsLogin(!isLogin)}
            type="button"
            className="text-blue-600 dark:text-blue-400"
          >
            {isLogin ? "Don't have an account? Sign up" : "Already have an account? Login"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
} 