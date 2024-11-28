import Image from 'next/image'

export default function About() {
  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold mb-6">About City General Hospital</h1>
      
      <section className="flex flex-col md:flex-row items-center gap-8">
        <div className="md:w-1/2">
          <Image
            src=""
            alt="City General Hospital Building"
            width={600}
            height={400}
            className="rounded-lg shadow-md"
          />
        </div>
        <div className="md:w-1/2 space-y-4">
          <h2 className="text-2xl font-semibold">Our Mission</h2>
          <p>
            At City General Hospital, our mission is to provide exceptional healthcare services with compassion and expertise. We are committed to improving the health and well-being of our community through innovative medical practices, cutting-edge technology, and a patient-centered approach to care.
          </p>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Our History</h2>
        <p>
          Founded in 1950, City General Hospital has been serving our community for over seven decades. What started as a small clinic has grown into a state-of-the-art medical facility, consistently ranked among the top hospitals in the region. Our growth reflects our unwavering commitment to excellence in healthcare and our ability to adapt to the evolving needs of our patients.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Our Values</h2>
        <ul className="list-disc list-inside space-y-2">
          <li>Compassion: We treat every patient with kindness, empathy, and respect.</li>
          <li>Excellence: We strive for the highest standards in medical care and patient service.</li>
          <li>Innovation: We embrace cutting-edge technologies and procedures to improve patient outcomes.</li>
          <li>Integrity: We uphold the highest ethical standards in all our practices.</li>
          <li>Collaboration: We foster a team-based approach to provide comprehensive care.</li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Our Facilities</h2>
        <p>
          City General Hospital boasts state-of-the-art facilities designed to provide the best possible care for our patients. Our campus includes:
        </p>
        <ul className="list-disc list-inside space-y-2">
          <li>A 24/7 Emergency Department equipped to handle all types of medical emergencies</li>
          <li>Advanced Imaging Center with MRI, CT, and PET scanning capabilities</li>
          <li>Comprehensive Cancer Center offering the latest in oncology treatments</li>
          <li>Modern Surgical Suites for both inpatient and outpatient procedures</li>
          <li>Dedicated Women's Health Center and Maternity Ward</li>
          <li>Pediatric Wing specially designed for the care of our youngest patients</li>
          <li>Cardiac Care Unit with state-of-the-art monitoring and treatment facilities</li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Community Involvement</h2>
        <p>
          We believe in giving back to the community that has supported us for so long. City General Hospital regularly organizes and participates in community health initiatives, free screening programs, and health education workshops. Our staff also volunteers their time and expertise to various local charities and outreach programs.
        </p>
      </section>
    </div>
  )
}