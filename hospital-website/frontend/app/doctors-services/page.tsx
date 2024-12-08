'use client'
import Image from 'next/image'
import React, { useCallback, useEffect, useState } from 'react'
import useEmblaCarousel from 'embla-carousel-react'

export default function DoctorsServices() {
  const doctors = [
    {
      name: "Dr. Richard Webber",
      title: "Chief of Surgery",
      specialty: "Cardiothoracic Surgery",
      image: "https://assets-auto.rbl.ms/60dbbb4a77cb576fdbdb044851cad1f5314bdd87bf2fb5d29f56e04cd009e2be",
      objectFit: "cover",
      objectPosition: "center top",
    },
    {
      name: "Dr. Meredith Grey",
      title: "Head of Neurology",
      specialty: "Neurological Surgery",
      image: "https://s2.r29static.com/bin/entry/506/x,80/2031793/image.jpg",
      objectFit: "cover",
      objectPosition: "center top",
    },
    {
      name: "Dr. Derek Shepherd",
      title: "Director of Oncology",
      specialty: "Surgical Oncology",
      image: "https://www.hollywoodreporter.com/wp-content/uploads/2023/04/GettyImages-93740544.jpg?w=800",
      objectFit: "cover",
      objectPosition: "center top",
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
      { "name": "Internal Medicine", "description": "Providing comprehensive care for adult health, focusing on prevention, diagnosis, and treatment of chronic and acute conditions." },
      { "name": "Cardiology", "description": "Expert care for heart and vascular health, specializing in diagnosis and treatment of cardiovascular diseases." },
      { "name": "Pulmonology", "description": "Dedicated to respiratory health, managing lung diseases and breathing disorders." },
      { "name": "Endocrinology", "description": "Specialized in diagnosing and treating hormonal disorders and metabolic conditions." },
      { "name": "Gastroenterology", "description": "Focused on digestive health, offering advanced care for gastrointestinal disorders." },
      { "name": "Neurology", "description": "Providing expert care for neurological health, addressing conditions of the brain, spine, and nervous system." },
      { "name": "Rheumatology", "description": "Specializing in the management of autoimmune conditions and joint, muscle, and connective tissue diseases." },
      { "name": "Immunology", "description": "Specialized in diagnosing and treating immune system disorders, including autoimmune diseases and immunodeficiencies." },
      { "name": "Geriatrics", "description": "Focuses on the health and well-being of older adults, addressing age-related conditions and promoting quality of life." },
      { "name": "Sports Medicine", "description": "Dedicated to preventing, diagnosing, and treating sports-related injuries and optimizing physical performance." },
    ],
    
    "Surgical Specialties": [
      { "name": "General Surgery", "description": "Expertise in a wide variety of surgical procedures, with a focus on abdominal and soft tissue conditions." },
      { "name": "Orthopedics", "description": "Specialized in surgical care for bones, joints, and the musculoskeletal system." },
      { "name": "Neurosurgery", "description": "Advanced surgical treatment for disorders of the brain, spine, and nervous system." },
      { "name": "Cardiothoracic Surgery", "description": "Specializing in surgical procedures involving the heart, lungs, and chest." },
      { "name": "Plastic Surgery", "description": "Providing both reconstructive and aesthetic surgical solutions." },
      { "name": "Otolaryngology (ENT)", "description": "Focused on surgical care for conditions of the ear, nose, throat, and related structures." },
      { "name": "Vascular Surgery", "description": "Specialized in the surgical treatment of disorders affecting the blood vessels, including arteries and veins." },
      { "name": "Transplant Surgery", "description": "Focuses on the surgical replacement of organs, such as the liver, kidney, or heart, to restore function." },
      { "name": "Pediatric Surgery", "description": "Expertise in performing surgical procedures on infants, children, and adolescents." },
      { "name": "Ocular Surgery", "description": "Specialized in surgeries for eye-related conditions, including cataract removal and vision correction." },
    ],
    "Pediatric Specialties": [
      { "name": "Pediatrics", "description": "Comprehensive medical care tailored for infants, children, and adolescents." },
      { "name": "Pediatric Surgery", "description": "Expert surgical care designed specifically for children of all ages." },
      { "name": "Pediatric Cardiology", "description": "Specialized in diagnosing and treating heart and vascular conditions in children." },
      { "name": "Pediatric Oncology", "description": "Providing compassionate care for children diagnosed with cancer, including advanced treatment options." },
      { "name": "Pediatric Neurology", "description": "Focused on the diagnosis and management of neurological conditions in children, such as epilepsy and developmental disorders." },
      { "name": "Neonatology", "description": "Specialized in intensive care for newborns, including premature and critically ill infants." },
      { "name": "Pediatric Endocrinology", "description": "Specializes in hormonal and metabolic disorders in children, such as diabetes and growth issues." },
      { "name": "Pediatric Gastroenterology", "description": "Focused on digestive system disorders in children, including food allergies, reflux, and bowel diseases." },
      { "name": "Pediatric Pulmonology", "description": "Provides care for children with respiratory conditions, such as asthma and cystic fibrosis." },
      { "name": "Pediatric Infectious Diseases", "description": "Expertise in diagnosing and treating complex infections and immune disorders in children." }
    ],
    
    "Women's Health": [
      { "name": "Obstetrics and Gynecology (OB/GYN)", "description": "Comprehensive care for pregnancy, childbirth, and overall female reproductive health." },
      { "name": "Reproductive Medicine", "description": "Specialized in fertility treatments and addressing reproductive health concerns." },
      { "name": "Gynecologic Oncology", "description": "Expert care for cancers of the female reproductive system, including ovarian, uterine, and cervical cancers." },
      { "name": "Maternal-Fetal Medicine", "description": "Advanced care for high-risk pregnancies, offering specialized prenatal diagnosis and treatment." },
      { "name": "Urogynecology", "description": "Focused on the treatment of pelvic floor disorders, such as urinary incontinence and pelvic organ prolapse." },
      { "name": "Menopause Medicine", "description": "Dedicated to supporting women through menopause and managing related hormonal changes." }
    ],
    "Emergency and Acute Care": [
      { "name": "Emergency Medicine", "description": "Providing immediate, life-saving care for acute illnesses and injuries in urgent situations." },
      { "name": "Trauma Surgery", "description": "Specialized in surgical treatment for patients with critical and traumatic injuries." },
      { "name": "Critical Care Medicine", "description": "Expert management of life-threatening conditions in intensive care settings." },
      { "name": "Burn Medicine", "description": "Dedicated care for patients with severe burns, focusing on treatment and rehabilitation." },
      { "name": "Toxicology", "description": "Specialized in diagnosing and treating poisonings, overdoses, and chemical exposures." },
      { "name": "Disaster Medicine", "description": "Coordinated medical care during natural disasters, mass casualty events, and emergencies." },
      { "name": "Acute Pain Management", "description": "Focused on relieving severe, short-term pain in emergency and postoperative settings." }
    ],    
    "Oncology and Hematology": [
      { "name": "Oncology", "description": "Comprehensive care for patients diagnosed with cancer, from diagnosis to treatment." },
      { "name": "Medical Oncology", "description": "Specialized in treating cancer through chemotherapy, immunotherapy, and targeted therapies." },
      { "name": "Radiation Oncology", "description": "Focused on using advanced radiation therapy techniques to treat and manage cancer." },
      { "name": "Surgical Oncology", "description": "Expert in performing surgeries to remove tumors and cancerous tissues for optimal care." },
      { "name": "Pediatric Hematology/Oncology", "description": "Providing compassionate care for children with blood disorders and various types of cancer." },
      { "name": "Hematopathology", "description": "Specialized in diagnosing blood-related diseases and cancers at the cellular level." },
      { "name": "Bone Marrow Transplantation", "description": "Advanced treatment using healthy stem cell transplants to combat blood cancers and severe disorders." }
    ], 

    "Mental Health": [
  { "name": "Psychiatry", "description": "Comprehensive care for diagnosing and managing a wide range of mental health disorders." },
  { "name": "Child and Adolescent Psychiatry", "description": "Specialized in treating mental health conditions in children, teens, and young adults." },
  { "name": "Addiction Psychiatry", "description": "Focused on addressing substance use disorders and addiction through expert care." },
  { "name": "Geriatric Psychiatry", "description": "Providing compassionate mental health care for older adults, including treatment for dementia and depression." },
  { "name": "Forensic Psychiatry", "description": "Combining psychiatry and legal expertise to assess and treat individuals involved in legal matters." },
  { "name": "Clinical Psychology", "description": "Offering therapy and psychological evaluations to help patients manage mental health challenges." },
  { "name": "Behavioral Therapy", "description": "Utilizing evidence-based approaches to help patients change negative behaviors and thought patterns." },
  { "name": "Trauma Counseling", "description": "Providing specialized care for individuals recovering from PTSD and other trauma-related conditions." }
],
"Specialized Fields": [
  { "name": "Dermatology", "description": "Expert care for conditions affecting the skin, hair, and nails." },
  { "name": "Ophthalmology", "description": "Specialized in eye health, offering comprehensive vision care and treatment." },
  { "name": "Urology", "description": "Focused on diagnosing and treating conditions of the urinary tract and male reproductive system." },
  { "name": "Nephrology", "description": "Providing advanced care for kidney health and managing related disorders." },
  { "name": "Infectious Diseases", "description": "Specialized in preventing, diagnosing, and treating diseases caused by infections." },
  { "name": "Allergy and Immunology", "description": "Expert in managing allergies, asthma, and immune system-related conditions." }
],
"Diagnostic Services": [
  { "name": "Radiology", "description": "Providing advanced imaging services, including X-rays, CT scans, and MRIs, to aid in accurate diagnoses." },
  { "name": "Pathology", "description": "Expert analysis of tissues, organs, and fluids to diagnose and understand diseases." },
  { "name": "Nuclear Medicine", "description": "Utilizing radioactive materials for precise imaging and treatment of conditions like cancer and thyroid disorders." },
  { "name": "Laboratory Medicine", "description": "Comprehensive testing of blood, urine, and other fluids to diagnose and monitor health conditions." },
  { "name": "Interventional Radiology", "description": "Specialized in minimally invasive procedures guided by imaging, including biopsies and vascular treatments." },
  { "name": "Cardiac Imaging", "description": "Focused on detailed imaging of the heart and blood vessels for accurate cardiovascular diagnosis." },
  { "name": "Molecular Diagnostics", "description": "Advanced analysis of genetic material and biomarkers to detect diseases at the molecular level." },
  { "name": "Electrodiagnostic Medicine", "description": "Performing specialized tests like EMGs and nerve conduction studies to assess muscle and nerve health." },
  { "name": "Prenatal Diagnostics", "description": "Providing imaging and testing during pregnancy to ensure fetal health and development." }
],

"Rehabilitation and Therapy": [
  { "name": "Physical Medicine and Rehabilitation", "description": "Dedicated to restoring function and improving quality of life for individuals with physical impairments." },
  { "name": "Occupational Therapy", "description": "Helping patients regain the skills needed to perform daily activities and achieve independence." },
  { "name": "Speech Therapy", "description": "Specialized in treating speech, language, and swallowing disorders to enhance communication and quality of life." },
  { "name": "Physical Therapy (PT)", "description": "Improving mobility, strength, and overall physical function through tailored exercises and therapeutic techniques." },
  { "name": "Recreational Therapy", "description": "Promoting physical and mental well-being through structured recreational activities." },
  { "name": "Respiratory Therapy", "description": "Expert care for managing breathing difficulties and cardiopulmonary disorders." },
  { "name": "Cognitive Rehabilitation Therapy", "description": "Supporting recovery or improvement in cognitive function after brain injuries or strokes." },
  { "name": "Music Therapy", "description": "Using music interventions to support emotional, psychological, and physical healing." },
  { "name": "Aquatic Therapy", "description": "Providing low-impact rehabilitation exercises in water to improve mobility and reduce joint strain." },
  { "name": "Prosthetics and Orthotics Therapy", "description": "Helping patients adapt to prosthetic limbs and braces to restore mobility and function effectively." }
],

"Supportive and Palliative Care": [
  { "name": "Palliative Medicine", "description": "Dedicated to enhancing quality of life for patients living with serious illnesses through symptom management and emotional support." },
  { "name": "Pain Management", "description": "Specialized in diagnosing and treating chronic and acute pain to improve daily function and comfort." },
  { "name": "Hospice Care", "description": "Compassionate end-of-life care focused on comfort, dignity, and emotional support for terminally ill patients and their families." },
  { "name": "Oncologic Supportive Care", "description": "Providing relief from the side effects of cancer treatments, such as pain, fatigue, and nausea, to enhance patient well-being." },
  { "name": "Geriatric Palliative Care", "description": "Tailored palliative care for elderly patients with complex or terminal conditions, ensuring comfort and quality of life." },
  { "name": "Pediatric Palliative Care", "description": "Comprehensive care for children with serious or life-limiting illnesses, supporting both the patient and their family." },
  { "name": "Integrative Palliative Care", "description": "Blending traditional medical care with holistic therapies, including acupuncture, meditation, and nutritional guidance." },
  { "name": "Caregiver Support Services", "description": "Offering practical resources and emotional support to families and caregivers of patients with serious illnesses." },
  { "name": "Bereavement Support", "description": "Providing counseling and resources to help families and loved ones navigate grief and loss." }
],
  }

  // Carousel implementation
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: 'start',
    slidesToScroll: 1,
    containScroll: 'trimSnaps'
  })

  const [selectedIndex, setSelectedIndex] = useState(0)
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([])

  const onSelect = useCallback(() => {
    if (!emblaApi) return
    setSelectedIndex(emblaApi.selectedScrollSnap())
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) return

    setScrollSnaps(emblaApi.scrollSnapList())
    onSelect()
    emblaApi.on('select', onSelect)
    emblaApi.on('reInit', onSelect)

    return () => {
      emblaApi.off('select', onSelect)
      emblaApi.off('reInit', onSelect)
    }
  }, [emblaApi, onSelect])

  const scrollTo = useCallback(
    (index: number) => emblaApi && emblaApi.scrollTo(index),
    [emblaApi]
  )

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev()
  }, [emblaApi])

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext()
  }, [emblaApi])

  const slides = Object.entries(specialties).map(([category, items]) => ({
    category,
    items
  }))

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
                className={`transition-transform duration-300 group-hover:scale-110 object-${doctor.objectFit} object-[${doctor.objectPosition}]`}
              />
            </div>
            <h2 className="text-xl font-bold">{doctor.name}</h2>
            <h3 className="text-lg text-primary mb-2">{doctor.title}</h3>
            <p className="text-muted-foreground">{doctor.specialty}</p>
          </div>
        ))}
      </div>

      {/* Specialties Carousel Section */}
      <div className="mt-16">
        <h2 className="text-3xl font-bold text-center mb-8">Our Specialties</h2>
        <div className="max-w-4xl mx-auto">
          <div className="overflow-hidden bg-muted rounded-lg border" ref={emblaRef}>
            <div className="flex">
              {slides.map((slide, index) => (
                <div key={index} className="flex-[0_0_100%] min-w-0">
                  <div className="p-6">
                    <h3 className="text-2xl font-bold mb-6">{slide.category}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {slide.items.map((specialty, idx) => (
                        <div
                          key={idx}
                          className="bg-blue-600/10 rounded-lg p-4 
                          hover:bg-blue-600/20 
                          transition-all duration-300 ease-in-out
                          border border-blue-600/20 
                          hover:border-blue-600/30 
                          hover:shadow-lg hover:-translate-y-0.5
                          hover:scale-[1.02]
                          outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        >
                          <h4 className="text-lg font-semibold mb-2 text-blue-600 dark:text-blue-400">
                            {specialty.name}
                          </h4>
                          <p className="text-muted-foreground text-sm">
                            {specialty.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex justify-between items-center mt-4">
            <button
              onClick={scrollPrev}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors border border-muted-foreground/20 outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              Previous
            </button>
            <div className="flex gap-2">
              {scrollSnaps.map((_, index) => (
                <button
                  key={index}
                  onClick={() => scrollTo(index)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === selectedIndex ? 'bg-primary' : 'bg-muted-foreground/20'
                  }`}
                />
              ))}
            </div>
            <button
              onClick={scrollNext}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors border border-muted-foreground/20 outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              Next
            </button>
          </div>
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

