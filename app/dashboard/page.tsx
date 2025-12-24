import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { DateSelector } from "@/components/dashboard/date-selector"
import { WorkoutList } from "@/components/dashboard/workout-list"
import { getUserWorkoutsByDateWithDetails } from "@/data/workouts"
import { formatDate } from "@/lib/utils/date"

// Force dynamic rendering to ensure fresh data on each request
export const dynamic = 'force-dynamic'

type SearchParams = Promise<{
  date?: string
}>

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  // Get authenticated user
  const { userId } = await auth()

  if (!userId) {
    redirect('/sign-in')
  }

  // Get date from search params or default to today
  const params = await searchParams
  const dateParam = params.date
  // Parse date string as local date (avoiding timezone issues)
  const selectedDate = dateParam
    ? (() => {
        const [year, month, day] = dateParam.split('-').map(Number)
        return new Date(year, month - 1, day)
      })()
    : new Date()

  // Fetch workouts for the selected date
  const workouts = await getUserWorkoutsByDateWithDetails(userId, selectedDate)

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
            <DateSelector />
          </div>

          {/* Workouts List Section */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-2xl font-semibold tracking-tight">
                Workouts for {formatDate(selectedDate)}
              </h2>
              <span className="text-sm text-muted-foreground">
                {workouts.length} {workouts.length === 1 ? "workout" : "workouts"}
              </span>
            </div>

            <WorkoutList workouts={workouts} selectedDate={selectedDate} />
          </div>
        </div>
      </div>
    </div>
  )
}
