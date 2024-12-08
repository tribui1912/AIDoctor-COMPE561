'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Building2, Heart, History, ListChecks, Hospital, Users, Stethoscope, Brain, Baby, Activity, HandHeart } from 'lucide-react'

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
}

export default function About() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative h-[50vh] min-h-[400px] w-full">
        <Image
          src="https://t4.ftcdn.net/jpg/08/42/31/49/360_F_842314946_W6xsF6x15mA61W2wUbkbTCVRx7EMqvwe.jpg"
          alt="City General Hospital Building"
          fill
          className="object-cover brightness-50"
          priority
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white space-y-4 p-4">
            <motion.h1 
              className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight"
              {...fadeIn}
            >
              City General Hospital
            </motion.h1>
            <motion.p 
              className="text-lg md:text-xl max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Providing exceptional healthcare with compassion and expertise since 1950
            </motion.p>
          </div>
        </div>
      </section>

      <main className="container mx-auto px-4 py-12 space-y-12">
        {/* Mission Section */}
        <motion.section 
          className="grid md:grid-cols-2 gap-8 items-stretch"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <Card className="bg-blue-600/10 border-blue-600/20 hover:bg-blue-600/20 transition-all duration-300 h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                <Heart className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                Our Mission
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                At City General Hospital, our mission is to provide exceptional healthcare services with compassion and expertise. We are committed to improving the health and well-being of our community through innovative medical practices, cutting-edge technology, and a patient-centered approach to care.
              </p>
            </CardContent>
          </Card>
          <Card className="bg-blue-600/10 border-blue-600/20 hover:bg-blue-600/20 transition-all duration-300 h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                <History className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                Our History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Founded in 1950, City General Hospital has been serving our community for over seven decades. What started as a small clinic has grown into a state-of-the-art medical facility, consistently ranked among the top hospitals in the region.
              </p>
            </CardContent>
          </Card>
        </motion.section>

        {/* Values Section */}
        <motion.section 
          className="space-y-6"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2 text-blue-600 dark:text-blue-400">
            <ListChecks className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            Our Values
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Heart, title: "Compassion", desc: "We treat every patient with kindness, empathy, and respect." },
              { icon: Stethoscope, title: "Excellence", desc: "We strive for the highest standards in medical care and patient service." },
              { icon: Brain, title: "Innovation", desc: "We embrace cutting-edge technologies and procedures to improve patient outcomes." },
              { icon: HandHeart, title: "Integrity", desc: "We uphold the highest ethical standards in all our practices." },
              { icon: Users, title: "Collaboration", desc: "We foster a team-based approach to provide comprehensive care." },
              { icon: Activity, title: "Quality", desc: "We are committed to providing high-quality care through our commitment to ongoing improvement and innovation." }
            ].map((value, index) => (
              <Card key={index} className="bg-blue-600/10 border-blue-600/20 hover:bg-blue-600/20 transition-all duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                    <value.icon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    {value.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{value.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.section>

        {/* Facilities Section */}
        <motion.section 
          className="space-y-6"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2 text-blue-600 dark:text-blue-400">
            <Building2 className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            Our Facilities
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Hospital, title: "Emergency Department", desc: "24/7 equipped to handle all types of medical emergencies" },
              { icon: Brain, title: "Advanced Imaging Center", desc: "MRI, CT, and PET scanning capabilities" },
              { icon: Activity, title: "Cancer Center", desc: "Comprehensive oncology treatments" },
              { icon: Stethoscope, title: "Surgical Suites", desc: "Modern facilities for inpatient and outpatient procedures" },
              { icon: Heart, title: "Women's Health Center", desc: "Dedicated center with maternity ward" },
              { icon: Baby, title: "Pediatric Wing", desc: "Specially designed for our youngest patients" }
            ].map((facility, index) => (
              <Card key={index} className="bg-blue-600/10 border-blue-600/20 hover:bg-blue-600/20 transition-all duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                    <facility.icon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    {facility.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{facility.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.section>

        {/* Community Section */}
        <motion.section 
          className="space-y-6"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <Card className="bg-blue-600/10 border-blue-600/20 hover:bg-blue-600/20 transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                Community Involvement
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                We believe in giving back to the community that has supported us for so long. City General Hospital regularly organizes and participates in community health initiatives, free screening programs, and health education workshops. Our staff also volunteers their time and expertise to various local charities and outreach programs.
              </p>
            </CardContent>
          </Card>
        </motion.section>
      </main>
    </div>
  )
}

