import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

type WorkoutWithDetails = {
  id: number
  name: string
  completedAt: Date | null
  workoutExercises: Array<{
    exercise: {
      name: string
    }
    sets: Array<{
      reps: number
      weight: number
    }>
  }>
}

type WorkoutListProps = {
  workouts: WorkoutWithDetails[]
  selectedDate: Date
}

export function WorkoutList({ workouts, selectedDate }: WorkoutListProps) {
  if (workouts.length === 0) {
    return (
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
    )
  }

  return (
    <div className="grid gap-4">
      {workouts.map((workout) => {
        // Calculate total duration and exercise count
        const exerciseCount = workout.workoutExercises.length

        // Calculate approximate duration (rough estimate based on sets)
        const totalSets = workout.workoutExercises.reduce(
          (acc, we) => acc + we.sets.length,
          0
        )
        const estimatedDuration = totalSets * 3 // ~3 minutes per set

        return (
          <Card key={workout.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle>{workout.name}</CardTitle>
                  <CardDescription>
                    {estimatedDuration} minutes • {exerciseCount} {exerciseCount === 1 ? 'exercise' : 'exercises'}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {workout.workoutExercises.map((workoutExercise, index) => {
                  const sets = workoutExercise.sets

                  return (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                    >
                      <div className="flex-1">
                        <p className="font-medium">{workoutExercise.exercise.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {sets.length} {sets.length === 1 ? 'set' : 'sets'}
                          {sets.length > 0 && (
                            <>
                              {' × '}
                              {sets[0].reps} reps
                              {sets[0].weight > 0 && ` @ ${sets[0].weight} lbs`}
                            </>
                          )}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
