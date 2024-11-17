import Link from 'next/link'
import Image from 'next/image'

export default function Home() {
  return (
    <div className="space-y-8">
      <section className="text-center">
        <h1 className="text-4xl font-bold mb-4">Welcome to City General Hospital</h1>
        <p className="text-xl">Providing quality healthcare for our community since 1950</p>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-blue-100 p-6 rounded-lg">
          <h2 className="text-2xl font-bold mb-4">Emergency Services</h2>
          <p>24/7 emergency care for all your urgent medical needs.</p>
          <Link href="/doctors-services" className="mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded">Learn More</Link>
        </div>
        <div className="bg-green-100 p-6 rounded-lg">
          <h2 className="text-2xl font-bold mb-4">Specialized Care</h2>
          <p>Expert doctors and advanced treatments in various specialties.</p>
          <Link href="/doctors-services" className="mt-4 inline-block bg-green-600 text-white px-4 py-2 rounded">Our Services</Link>
        </div>
        <div className="bg-yellow-100 p-6 rounded-lg">
          <h2 className="text-2xl font-bold mb-4">Patient Resources</h2>
          <p>Information for patients and visitors to make your stay comfortable.</p>
          <Link href="/patients-visitors" className="mt-4 inline-block bg-yellow-600 text-white px-4 py-2 rounded">Patient Info</Link>
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-3xl font-bold mb-4">Latest News</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="border p-4 rounded-lg">
            <h3 className="text-xl font-bold mb-2">New MRI Machine Installed</h3>
            <p>Our hospital has recently acquired a state-of-the-art MRI machine, enhancing our diagnostic capabilities.</p>
            <Link href="/news" className="text-blue-600 hover:underline">Read more</Link>
          </div>
          <div className="border p-4 rounded-lg">
            <h3 className="text-xl font-bold mb-2">COVID-19 Vaccination Drive</h3>
            <p>Join our ongoing COVID-19 vaccination drive. Protect yourself and your community.</p>
            <Link href="/news" className="text-blue-600 hover:underline">Read more</Link>
          </div>
        </div>
      </section>

      <section className="mt-8 text-center">
        <h2 className="text-3xl font-bold mb-4">Have a Question?</h2>
        <p className="mb-4">Our AI assistant is here to help you 24/7.</p>
        <Link href="/ask" className="bg-blue-600 text-white px-6 py-3 rounded-lg text-lg">Ask Now</Link>
      </section>
    </div>
  )
}