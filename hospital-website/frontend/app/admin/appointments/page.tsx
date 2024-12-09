'use client'
import { useState, useEffect } from 'react'
import { DataTable } from '@/components/ui/data-table'
import { columns } from '@/app/admin/appointments/columns'
import { getCookie } from 'cookies-next'
import { format } from 'date-fns'

interface Appointment {
  id: number
  date: string
  reason: string
  status: string
  user_id: number
}

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await fetch('http://34.220.228.30:30000/api/appointments/admin/all', {
          headers: {
            Authorization: `Bearer ${getCookie('adminToken')}`,
          },
        })
        if (!response.ok) throw new Error('Failed to fetch appointments')
        const data = await response.json()
        
        // Format the data
        const formattedData = data.map((appointment: Appointment) => ({
          ...appointment,
          date: format(new Date(appointment.date), 'PPP p'),
        }))
        
        setAppointments(formattedData)
      } catch (error) {
        console.error('Error:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchAppointments()
  }, [])

  if (loading) {
    return <div className="flex items-center justify-center h-full">Loading...</div>
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Appointments</h2>
      </div>
      <DataTable columns={columns} data={appointments} />
    </div>
  )
}
