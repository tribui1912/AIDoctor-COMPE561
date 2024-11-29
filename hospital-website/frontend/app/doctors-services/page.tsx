import Image from 'next/image'

export default function DoctorsServices() {
  const doctors = [
    {
      name: "Dr. Richard Webber",
      title: "Chief of Surgery",
      specialty: "Cardiothoracic Surgery",
      image: "https://assets-auto.rbl.ms/60dbbb4a77cb576fdbdb044851cad1f5314bdd87bf2fb5d29f56e04cd009e2be",
      objectFit: "cover",
      objectPosition: "100% 0%",
    },
    {
      name: "Dr. Meredith Grey",
      title: "Head of Neurology",
      specialty: "Neurological Surgery",
      image: "https://s2.r29static.com/bin/entry/506/x,80/2031793/image.jpg",
      objectFit: "cover",
      objectPosition: "100% 1%",
    },
    {
      name: "Dr. Derek Shepherd",
      title: "Director of Oncology",
      specialty: "Surgical Oncology",
      image: "https://www.hollywoodreporter.com/wp-content/uploads/2023/04/GettyImages-93740544.jpg?w=800",
      objectFit: "cover",
      objectPosition: "30% 10%",
    },
    {
      name: "Dr. Alex Karev",
      title: "Chief of Orthopedics",
      specialty: "Orthopedic Surgery",
      image: "https://static.wikia.nocookie.net/my-high-school-musical-series/images/c/c6/AlexKarevS104.jpg/revision/latest/scale-to-width-down/1200?cb=20240323060734",
      objectFit: "cover",
      objectPosition: "top",
    },
    {
      name: "Dr. Christina Yang",
      title: "Chief of Pediatrics",
      specialty: "Pediatric Surgery",
      image: "https://hips.hearstapps.com/digitalspyuk.cdnds.net/18/12/1521768676-oh1.jpg",
      objectFit: "cover",
      objectPosition: "top",
    },
    {
      name: "Dr. Miranda Bailey",
      title: "Head of Ophthalmology",
      specialty: "Ophthalmology",
      image: "https://cdn1.edgedatg.com/aws/v2/abc/GreysAnatomy/blog/739398/201a7241d0b32b1f215a93abeb7c5193/1600x900-Q90_201a7241d0b32b1f215a93abeb7c5193.jpg",
      objectFit: "cover",
      objectPosition: "top",
    },
    {
      name: "Dr. Jackson Avery ",
      title: "Director of Radiology",
      specialty: "Radiology",
      image: "https://i.ebayimg.com/images/g/apwAAOSwQjdieQlA/s-l1200.jpg",
      objectFit: "cover",
      objectPosition: "5% 10%",
    },
    {
      name: "Dr. Addison Montgomery",
      title: "Chief of Anesthesiology",
      specialty: "Anesthesiology",
      image: "https://i.pinimg.com/736x/4b/b3/f7/4bb3f76ffbee5be6f3840d6a7646753e.jpg",
      objectFit: "cover",
      objectPosition: "top",
    },
  ]

  const specialties = {
    "Medical Specialties": [
      { name: "Internal Medicine", description: "Focuses on the diagnosis, treatment, and prevention of adult diseases." },
      { name: "Cardiology", description: "Deals with disorders of the heart and blood vessels." },
      { name: "Pulmonology", description: "Specializes in respiratory system diseases." },
      { name: "Endocrinology", description: "Focuses on hormonal imbalances and endocrine disorders." },
      { name: "Gastroenterology", description: "Treats conditions of the digestive system." },
      { name: "Neurology", description: "Manages disorders of the brain, spinal cord, and nerves." },
      { name: "Rheumatology", description: "Specializes in autoimmune diseases and musculoskeletal disorders." },
    ],
    "Surgical Specialties": [
      { name: "General Surgery", description: "Covers a broad range of surgical procedures, especially involving the abdomen and soft tissues." },
      { name: "Orthopedics", description: "Focuses on the musculoskeletal system, including bones and joints." },
      { name: "Neurosurgery", description: "Treats surgical conditions of the nervous system." },
      { name: "Cardiothoracic Surgery", description: "Involves surgery of the heart, lungs, and chest." },
      { name: "Plastic Surgery", description: "Includes reconstructive and cosmetic procedures." },
      { name: "Otolaryngology (ENT)", description: "Deals with ear, nose, and throat surgeries." },
    ],
    "Pediatric Specialties": [
      { name: "Pediatrics", description: "Focuses on medical care for infants, children, and adolescents." },
      { name: "Pediatric Surgery", description: "Surgical care for children." },
    ],
    "Women's Health": [
      { name: "Obstetrics and Gynecology (OB/GYN)", description: "Focuses on pregnancy, childbirth, and female reproductive health." },
      { name: "Reproductive Medicine", description: "Addresses fertility and reproductive issues." },
    ],
    "Emergency and Acute Care": [
      { name: "Emergency Medicine", description: "Provides immediate care for acute injuries or illnesses." },
      { name: "Trauma Surgery", description: "Specialized care for traumatic injuries." },
    ],
    "Oncology and Hematology": [
      { name: "Oncology", description: "Treats cancer patients." },
      { name: "Hematology", description: "Focuses on blood disorders, including anemia and leukemia." },
    ],
    "Mental Health": [
      { name: "Psychiatry", description: "Manages mental health disorders." },
      { name: "Psychology", description: "Provides counseling and therapy services." },
    ],
    "Specialized Fields": [
      { name: "Dermatology", description: "Treats skin, hair, and nail conditions." },
      { name: "Ophthalmology", description: "Focuses on eye and vision care." },
      { name: "Urology", description: "Treats urinary tract and male reproductive system issues." },
      { name: "Nephrology", description: "Specializes in kidney care and treatment." },
      { name: "Infectious Diseases", description: "Manages diseases caused by infectious agents." },
      { name: "Allergy and Immunology", description: "Focuses on allergies and immune system disorders." },
    ],
    "Diagnostic Services": [
      { name: "Radiology", description: "Uses imaging techniques like X-rays, CT scans, and MRIs for diagnosis." },
      { name: "Pathology", description: "Analyzes tissues, organs, and body fluids for diagnosis." },
    ],
    "Rehabilitation and Therapy": [
      { name: "Physical Medicine and Rehabilitation", description: "Restores function for people with physical impairments." },
      { name: "Occupational Therapy", description: "Helps patients regain skills for daily activities." },
      { name: "Speech Therapy", description: "Treats communication and swallowing disorders." },
    ],
    "Supportive and Palliative Care": [
      { name: "Palliative Medicine", description: "Focuses on improving quality of life for patients with serious illnesses." },
      { name: "Pain Management", description: "Treats chronic pain conditions." },
    ],
  }

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
          <div key={index} className="flex flex-col items-center text-center group">
            <div className="relative w-full aspect-square mb-4 overflow-hidden rounded-lg">
              <Image
                src={doctor.image}
                alt={`Portrait of ${doctor.name}`}
                fill
                style={{
                  objectFit: doctor.objectFit,
                  objectPosition: doctor.objectPosition
                }}
                className="transition-transform duration-300 group-hover:scale-110"
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
        <div className="space-y-8">
          {Object.entries(specialties).map(([category, specialtiesList], index) => (
            <div key={index} className="bg-muted rounded-lg p-6">
              <h3 className="text-2xl font-bold mb-4">{category}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {specialtiesList.map((specialty, specialtyIndex) => (
                  <div key={specialtyIndex} className="bg-background rounded-lg p-4 hover:bg-muted/80 transition-colors">
                    <h4 className="text-lg font-semibold mb-2">{specialty.name}</h4>
                    <p className="text-muted-foreground text-sm">{specialty.description}</p>
                  </div>
                ))}
              </div>
            </div>
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

