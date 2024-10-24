'use client'; // Mark this file as a client component

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

export default function LoginPopup() {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  // Use useEffect to open the popup when the component mounts
  useEffect(() => {
    setIsPopupOpen(true);
  }, []); // Empty dependency array means it runs once when the component mounts

  return (
    <div className="space-y-8">
      {/* Dialog Popup */}
      <Dialog open={isPopupOpen} onOpenChange={setIsPopupOpen}>
        <DialogContent className="max-w-md mx-auto">
          <DialogHeader>
            <DialogTitle>Login</DialogTitle>
            <DialogDescription>Please enter your username and password.</DialogDescription>
          </DialogHeader>

          <form className="space-y-4 mt-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                Username
              </label>
              <input
                type="text"
                id="username"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter your username"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                id="password"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter your password"
              />
            </div>

            <div className="flex justify-between items-center">
              <Button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded" type="submit">
                Login
              </Button>
              <Button className="mt-4 bg-gray-300 text-black px-4 py-2 rounded" onClick={() => setIsPopupOpen(false)}>
                Forgot Password
              </Button>
            

            <Button className="mt-4 bg-gray-300 text-black px-4 py-2 rounded" onClick={() => setIsPopupOpen(false)}>
              Continue as Guest
            </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
