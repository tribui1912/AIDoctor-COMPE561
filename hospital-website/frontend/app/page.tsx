import Link from 'next/link'
import { Bot, Clipboard, Stethoscope } from 'lucide-react'

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <div className="py-12 grid lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl lg:text-6xl font-bold leading-tight text-blue-600 dark:text-blue-400">
              24/7 AI<br />Healthcare<br />Assistant
            </h1>
            <p className="text-xl text-muted-foreground">
              Get instant answers to your medical questions, schedule appointments, and access patient resources through our advanced AI chat system.
            </p>
          </div>
          <Link 
            href="/patients-visitors"
            className="bg-blue-600/20 text-blue-600 dark:text-blue-400 hover:bg-blue-600/30 
              px-8 py-4 rounded-full border border-blue-600/20 inline-block
              transition-all duration-300 text-lg font-semibold
              hover:scale-105 hover:shadow-lg"
          >
            Chat with Our AI Assistant Now
          </Link>
        </div>

        <div className="relative">
          <div className="relative bg-background rounded-full p-8 shadow-xl w-64 h-64 mx-auto border border-blue-600/20">
            <div className="absolute inset-0 bg-gradient-to-b from-blue-100 dark:from-blue-950 to-transparent rounded-full"></div>
            <Bot className="w-full h-full text-blue-600 dark:text-blue-400" />
            <div className="absolute -right-2 -top-2 bg-background p-2 rounded-full shadow-lg border border-blue-600/20">
              <Stethoscope className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>

          <div className="absolute top-0 right-0">
            <Clipboard className="w-12 h-12 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="absolute bottom-0 left-0">
            <div className="bg-background p-2 rounded-full shadow-lg border border-blue-600/20">
              <span className="text-blue-600 dark:text-blue-400 text-2xl font-bold">+</span>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="pb-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              title: "Emergency Services",
              desc: "24/7 emergency care for all your urgent medical needs.",
              link: "/location"
            },
            {
              title: "Specialized Care",
              desc: "Expert doctors and advanced treatments in various specialties.",
              link: "/doctors-services"
            },
            {
              title: "Patient Resources",
              desc: "Information for patients and visitors to make your stay comfortable.",
              link: "/patients-visitors"
            }
          ].map((feature, index) => (
            <div key={index} className="bg-background/80 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-blue-600/20">
              <h3 className="text-xl font-semibold mb-4 text-blue-600 dark:text-blue-400">{feature.title}</h3>
              <p className="text-muted-foreground mb-4">{feature.desc}</p>
              <Link 
                href={feature.link}
                className="bg-blue-600/20 text-blue-600 dark:text-blue-400 hover:bg-blue-600/30 
                  px-6 py-2 rounded-lg border border-blue-600/20 inline-block
                  transition-colors duration-300"
              >
                Learn More
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}