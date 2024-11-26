import { MapPin, Phone, Mail, Clock } from 'lucide-react'

export default function Contact() {
  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold mb-6">Contact Us</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <section className="space-y-6">
          <div>
            <h2 className="text-2xl font-semibold mb-4">Get in Touch</h2>
            <p className="mb-4">
              We're here to help and answer any question you might have. Feel free to reach out to us using the contact information below.
            </p>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <MapPin className="text-blue-600 w-5 h-5" />
              <span>123 Hospital Street, Cityville, State 12345</span>
            </div>
            <div className="flex items-center space-x-3">
              <Phone className="text-blue-600 w-5 h-5" />
              <span>(123) 456-7890</span>
            </div>
            <div className="flex items-center space-x-3">
              <Mail className="text-blue-600 w-5 h-5" />
              <span>info@citygeneralhospital.com</span>
            </div>
            <div className="flex items-start space-x-3">
              <Clock className="text-blue-600 w-5 h-5 mt-1" />
              <div>
                <p className="font-semibold">Hours of Operation:</p>
                <p>Monday - Friday: 8:00 AM - 8:00 PM</p>
                <p>Saturday - Sunday: 9:00 AM - 5:00 PM</p>
                <p>Emergency Services: 24/7</p>
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-6">
          <div>
            <h2 className="text-2xl font-semibold mb-4">Departments</h2>
            <ul className="space-y-2">
              <li><strong>Emergency Room:</strong> (123) 456-7891</li>
              <li><strong>Outpatient Services:</strong> (123) 456-7892</li>
              <li><strong>Radiology:</strong> (123) 456-7893</li>
              <li><strong>Laboratory:</strong> (123) 456-7894</li>
              <li><strong>Physical Therapy:</strong> (123) 456-7895</li>
              <li><strong>Billing Inquiries:</strong> (123) 456-7896</li>
            </ul>
          </div>
          
          <div>
            <h2 className="text-2xl font-semibold mb-4">Patient Relations</h2>
            <p>
              For any concerns or feedback about your experience at City General Hospital, please contact our Patient Relations department:
            </p>
            <p className="mt-2">
              <strong>Phone:</strong> (123) 456-7897<br />
              <strong>Email:</strong> patientrelations@citygeneralhospital.com
            </p>
          </div>
        </section>
      </div>

      <section className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Find Us </h2>
        <div className="aspect-w-16 aspect-h-9">
          <iframe 
            src="https://www.google.com/maps/embed/v1/place?q=San+diego+state+university&key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8" 
            width="600" 
            height="450" 
            style={{border:0}} 
            allowFullScreen 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
            className="w-full rounded-lg shadow-md"
          ></iframe>
        </div>
      </section>
    </div>
  )
}