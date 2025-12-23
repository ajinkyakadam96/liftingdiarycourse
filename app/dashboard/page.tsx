"use client"

import { useState } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { formatDate } from "@/lib/utils/date"

// Mock workout data type
type Workout = {
  id: string
  name: string
  exercises: Array<{
    name: string
    sets: number
    reps: number
    weight: number
  }>
  duration: number
  completedAt: string
}

// Mock workouts for UI demonstration
const mockWorkouts: Workout[] = [
  {
    id: "1",
    name: "Upper Body Strength",
    exercises: [
      { name: "Bench Press", sets: 4, reps: 8, weight: 185 },
      { name: "Overhead Press", sets: 3, reps: 10, weight: 95 },
      { name: "Pull-ups", sets: 3, reps: 12, weight: 0 },
    ],
    duration: 65,
    completedAt: new Date().toISOString(),
  },
  {
    id: "2",
    name: "Core & Accessories",
    exercises: [
      { name: "Cable Crunches", sets: 3, reps: 15, weight: 70 },
      { name: "Dumbbell Rows", sets: 4, reps: 10, weight: 60 },
      { name: "Face Pulls", sets: 3, reps: 15, weight: 40 },
    ],
    duration: 45,
    completedAt: new Date().toISOString(),
  },
]

export default function DashboardPage() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight mb-2">Dashboard</h1>
          <p className="text-muted-foreground">
            Track your workouts and progress
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[350px_1fr]">
          {/* Datepicker Section */}
          <div className="flex flex-col gap-4">
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
                  onSelect={setSelectedDate}
                  className="rounded-md border"
                />
              </CardContent>
            </Card>
          </div>

          {/* Workouts List Section */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-2xl font-semibold tracking-tight">
                Workouts for {selectedDate ? formatDate(selectedDate) : "selected date"}
              </h2>
              <span className="text-sm text-muted-foreground">
                {mockWorkouts.length} {mockWorkouts.length === 1 ? "workout" : "workouts"}
              </span>
            </div>

            {mockWorkouts.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <p className="text-muted-foreground text-center">
                    No workouts logged for this date.
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Start tracking your progress by adding a workout!
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {mockWorkouts.map((workout) => (
                  <Card key={workout.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle>{workout.name}</CardTitle>
                          <CardDescription>
                            {workout.duration} minutes • {workout.exercises.length} exercises
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {workout.exercises.map((exercise, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                          >
                            <div className="flex-1">
                              <p className="font-medium">{exercise.name}</p>
                              <p className="text-sm text-muted-foreground">
                                {exercise.sets} sets × {exercise.reps} reps
                                {exercise.weight > 0 && ` @ ${exercise.weight} lbs`}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
