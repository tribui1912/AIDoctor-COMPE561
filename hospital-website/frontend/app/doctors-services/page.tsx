import Image from 'next/image'
import { Card, CardContent } from "@/components/ui/card"

export default function DoctorsServices() {
  const doctors = [
    {
      name: "Dr. Richard Webber",
      title: "Chief of Surgery",
      specialty: "Cardiothoracic Surgery",
      image: "/placeholder.svg?height=300&width=300"
    },
    {
      name: "Dr. Meredith Grey",
      title: "Head of Neurology",
      specialty: "Neurological Surgery",
      image: "/placeholder.svg?height=300&width=300"
    },
    {
      name: "Dr. Derek Shepherd",
      title: "Director of Oncology",
      specialty: "Surgical Oncology",
      image: "/placeholder.svg?height=300&width=300"
    },
    {
      name: "Dr. Alex Karev",
      title: "Chief of Orthopedics",
      specialty: "Orthopedic Surgery",
      image: "/placeholder.svg?height=300&width=300"
    },
    {
      name: "Dr. Christina Yang",
      title: "Chief of Pediatrics",
      specialty: "Pediatric Surgery",
      image: "/placeholder.svg?height=300&width=300"
    },
    {
      name: "Dr. Miranda Bailey",
      title: "Head of Ophthalmology",
      specialty: "Ophthalmology",
      image: "/placeholder.svg?height=300&width=300"
    },
    {
      name: "Dr. Mark Sloan",
      title: "Director of Radiology",
      specialty: "Radiology",
      image: "/placeholder.svg?height=300&width=300"
    },
    {
      name: "Dr. Addison Montgomery",
      title: "Chief of Anesthesiology",
      specialty: "Anesthesiology",
      image: "/placeholder.svg?height=300&width=300"
    },
  ]

  const specialties = [
    {
      name: "Cardiothoracic Surgery",
      description: "24/7 emergency care with advanced trauma services. Our emergency department is equipped to handle all types of medical emergencies with rapid response times."
    },
    {
      name: "Neurological Surgery",
      description: "Comprehensive care for adults including preventive services, chronic disease management, and complex diagnostic evaluations. Our team focuses on holistic patient care."
    },
    {
      name: "Surgical Oncology",
      description: "Experienced surgeons provide comprehensive surgical care for a wide range of conditions, including hernias, gallstones, and thyroid disorders."
    },
    {
      name: "Orthopedic Surgery",
      description: "Comprehensive women's health services including obstetrics, gynecology, and breast health. We provide personalized care for women at every stage of life."
    },
    {
      name: "Pediatric Surgery",
      description: "Comprehensive care for children from birth to age 18, including routine check-ups, vaccinations, and treatment for acute illnesses."
    },
    {
      name: "Ophthalmology",
      description: "Comprehensive heart care including diagnostic testing, interventional procedures, and cardiac rehabilitation programs. Our team specializes in treating complex cardiovascular conditions with state-of-the-art technology."
    },
    {
      name: "Radiology",
      description: "Expert care for bone and joint conditions, sports injuries, and spine disorders. We offer both surgical and non-surgical treatments, including minimally invasive procedures."
    },
    {
      name: "Anesthesiology",
      description: "State-of-the-art imaging services, including X-ray, CT, MRI, and ultrasound. We also offer interventional radiology services."
    },
    {
      name: "Psychology",
      description: "Comprehensive mental health services, including counseling, therapy, and support groups. Our team of licensed therapists provides personalized care for all mental health conditions."
    }
  ]

  return (
    <div className="container mx-auto px-4 py-8 space-y-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Our Medical Team</h1>
        <p className="text-muted-foreground text-lg">
          Meet our experienced team of healthcare professionals dedicated to providing exceptional care.
        </p>
      </div>

      {/* Doctors Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {doctors.map((doctor, index) => (
          <div key={index} className="flex flex-col items-center text-center">
            <div className="relative w-full aspect-square mb-4">
              <Image
                src={doctor.image}
                alt={`Portrait of ${doctor.name}`}
                fill
                className="object-cover rounded-lg shadow-md"
              />
            </div>
            <h2 className="text-xl font-bold">{doctor.name}</h2>
            <h3 className="text-lg text-primary mb-2">{doctor.title}</h3>
            <p className="text-muted-foreground">{doctor.specialty}</p>
          </div>
        ))}
      </div>

      {/* Specialties Section */}
      <div className="mt-16">
        <h2 className="text-3xl font-bold text-center mb-8">Our Specialties</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {specialties.map((specialty, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-3">{specialty.name}</h3>
                <p className="text-muted-foreground">{specialty.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Additional Services Information */}
      <div className="mt-12 text-center">
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Our hospital is equipped with state-of-the-art facilities and technology to support our medical team in providing the highest quality of care. We offer both inpatient and outpatient services, with a focus on patient comfort and recovery.
        </p>
      </div>
    </div>
  )
}

