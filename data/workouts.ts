import { db } from '@/db';
import { workouts, workoutExercises, exercises, sets } from '@/db/schema';
import { eq, and, desc, gte, lte, sql } from 'drizzle-orm';

/**
 * Get all workouts for a specific user
 * @param userId - The authenticated user's ID (from Clerk)
 * @returns Array of workouts belonging to the user
 */
export async function getUserWorkouts(userId: string) {
  return await db
    .select()
    .from(workouts)
    .where(eq(workouts.userId, userId))
    .orderBy(desc(workouts.completedAt));
}

/**
 * Get workouts for a specific user on a specific date
 * @param userId - The authenticated user's ID (from Clerk)
 * @param date - The date to filter workouts by
 * @returns Array of workouts for that date
 */
export async function getUserWorkoutsByDate(userId: string, date: Date) {
  // Set time to start of day (00:00:00)
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);

  // Set time to end of day (23:59:59)
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  return await db
    .select()
    .from(workouts)
    .where(
      and(
        eq(workouts.userId, userId),
        gte(workouts.completedAt, startOfDay),
        lte(workouts.completedAt, endOfDay)
      )
    )
    .orderBy(desc(workouts.completedAt));
}

/**
 * Get a specific workout with all its exercises and sets
 * @param userId - The authenticated user's ID (from Clerk)
 * @param workoutId - The workout ID to fetch
 * @returns The workout with exercises and sets, or null if not found/unauthorized
 */
export async function getUserWorkoutWithDetails(userId: string, workoutId: number) {
  const result = await db.query.workouts.findFirst({
    where: (workouts, { eq, and }) =>
      and(eq(workouts.id, workoutId), eq(workouts.userId, userId)),
    with: {
      workoutExercises: {
        orderBy: (workoutExercises, { asc }) => [asc(workoutExercises.order)],
        with: {
          exercise: true,
          sets: {
            orderBy: (sets, { asc }) => [asc(sets.setNumber)],
          },
        },
      },
    },
  });

  return result ?? null;
}

/**
 * Get workouts for a specific date with all exercises and sets
 * @param userId - The authenticated user's ID (from Clerk)
 * @param date - The date to filter workouts by
 * @returns Array of workouts with exercises and sets for that date
 */
export async function getUserWorkoutsByDateWithDetails(userId: string, date: Date) {
  // Set time to start of day (00:00:00)
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);

  // Set time to end of day (23:59:59)
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  const results = await db.query.workouts.findMany({
    where: (workouts, { eq, and, gte, lte }) =>
      and(
        eq(workouts.userId, userId),
        gte(workouts.completedAt, startOfDay),
        lte(workouts.completedAt, endOfDay)
      ),
    with: {
      workoutExercises: {
        orderBy: (workoutExercises, { asc }) => [asc(workoutExercises.order)],
        with: {
          exercise: true,
          sets: {
            orderBy: (sets, { asc }) => [asc(sets.setNumber)],
          },
        },
      },
    },
    orderBy: (workouts, { desc }) => [desc(workouts.completedAt)],
  });

  return results;
}

/**
 * Create a new workout for a user
 * @param userId - The authenticated user's ID (from Clerk)
 * @param data - Workout data to insert
 */
export async function createWorkout(
  userId: string,
  data: { name: string; startedAt?: Date; completedAt?: Date }
) {
  const [workout] = await db
    .insert(workouts)
    .values({
      ...data,
      userId, // CRITICAL: Always set userId from authenticated user
    })
    .returning();

  return workout;
}
