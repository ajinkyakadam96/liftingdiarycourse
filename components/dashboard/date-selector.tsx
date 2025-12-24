"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { formatDate } from "@/lib/utils/date"

// Helper function to parse date string as local date (avoiding timezone issues)
function parseDateParam(dateParam: string | null): Date {
  if (!dateParam) return new Date()

  const [year, month, day] = dateParam.split('-').map(Number)
  return new Date(year, month - 1, day)
}

export function DateSelector() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const dateParam = searchParams.get('date')

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(() =>
    parseDateParam(dateParam)
  )

  // Sync state with URL parameter changes (for manual URL edits)
  useEffect(() => {
    const newDate = parseDateParam(dateParam)
    setSelectedDate(newDate)
  }, [dateParam])

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date)
    if (date) {
      // Format date as YYYY-MM-DD using local date components (avoiding timezone issues)
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      const dateString = `${year}-${month}-${day}`

      router.push(`/dashboard?date=${dateString}`)
      // Force refresh to re-fetch server component data
      router.refresh()
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Select Date</CardTitle>
        <CardDescription>
          {selectedDate ? formatDate(selectedDate) : "Pick a date"}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={handleDateSelect}
          className="rounded-md border"
        />
      </CardContent>
    </Card>
  )
}
