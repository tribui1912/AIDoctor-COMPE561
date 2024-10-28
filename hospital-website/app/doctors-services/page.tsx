'use client'; // Mark this file as a client component

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

export default function DoctorsServices() {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [currentService, setCurrentService] = useState(null);
  
  const handleButtonClick = (service) => {
    setCurrentService(service);
    setIsPopupOpen(true);
  };

  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold mb-4">Doctors & Services</h1>
      <p className="mb-6">Here you can find information about our doctors and the services we offer.</p>
      
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[
          { title: 'Cardiology', description: 'Advanced heart care with cutting-edge technology.' },
          { title: 'Neurology', description: 'Expert neurological care for a range of conditions.' },
          { title: 'Orthopedics', description: 'Comprehensive bone and joint care solutions.' },
          { title: 'Pediatrics', description: 'Dedicated care for children’s health and wellness.' },
          { title: 'Oncology', description: 'Innovative cancer treatment with personalized plans.' },
          { title: 'Radiology', description: 'State-of-the-art imaging for accurate diagnostics.' },
        ].map((service) => (
          <Button
            key={service.title}
            className="bg-white shadow-lg rounded-lg p-12 text-black hover:bg-blue-300 transition-all duration-300 flex flex-col items-start"
            onClick={() => handleButtonClick(service)}
          >
            <h2 className="text-xl justify-center font-bold mb-2">{service.title}</h2>
            <p className="text-sm">{service.description}</p>
          </Button>
        ))}
      </section>

      {/* Dialog Popup */}
      <Dialog open={isPopupOpen} onOpenChange={setIsPopupOpen}>
        <DialogContent className="max-w-md mx-auto">
          <DialogHeader>
            <DialogTitle>{currentService ? currentService.title : ''}</DialogTitle>
            <DialogDescription>{currentService ? currentService.description : ''}</DialogDescription>
          </DialogHeader>
          <div className="flex justify-end mt-4">
            <Button className="bg-gray-300 text-black px-4 py-2 rounded" onClick={() => setIsPopupOpen(false)}>
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

