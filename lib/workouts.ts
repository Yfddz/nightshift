export type Exercise = {
  name: string;
  sets: number;
  reps: string;
};

export type WorkoutDay = {
  id: number;
  code: string;
  name: string;
  exercises: Exercise[];
};

export const WORKOUTS: WorkoutDay[] = [
  {
    id: 1,
    code: "D1",
    name: "CHEST + TRI",
    exercises: [
      { name: "Bench Press", sets: 4, reps: "6-8" },
      { name: "Incline DB Press", sets: 3, reps: "8-10" },
      { name: "Cable Fly", sets: 3, reps: "12" },
      { name: "Close-Grip Bench", sets: 3, reps: "8-10" },
      { name: "Tricep Pushdown", sets: 3, reps: "12" },
    ],
  },
  {
    id: 2,
    code: "D2",
    name: "BACK + BI",
    exercises: [
      { name: "Lat Pulldown", sets: 4, reps: "8-10" },
      { name: "Barbell Row", sets: 4, reps: "6-8" },
      { name: "Seated Cable Row", sets: 3, reps: "10" },
      { name: "Barbell Curl", sets: 3, reps: "8-10" },
      { name: "Incline DB Curl", sets: 3, reps: "10" },
    ],
  },
  {
    id: 3,
    code: "D3",
    name: "LEGS",
    exercises: [
      { name: "Squats", sets: 4, reps: "6-8" },
      { name: "RDL", sets: 3, reps: "8-10" },
      { name: "Leg Press", sets: 3, reps: "10-12" },
      { name: "Leg Curl", sets: 3, reps: "12" },
      { name: "Standing Calf Raise", sets: 4, reps: "15" },
    ],
  },
  {
    id: 4,
    code: "D4",
    name: "SHOULDERS + ARMS",
    exercises: [
      { name: "OHP", sets: 4, reps: "6-8" },
      { name: "Lateral Raise", sets: 4, reps: "12-15" },
      { name: "Rear Delt Fly", sets: 3, reps: "15" },
      { name: "EZ-Bar Curl", sets: 3, reps: "10" },
      { name: "Overhead Tricep Ext", sets: 3, reps: "10" },
      { name: "Hanging Leg Raise", sets: 3, reps: "12" },
    ],
  },
  {
    id: 5,
    code: "D5",
    name: "CHEST + BACK VOLUME",
    exercises: [
      { name: "Incline Barbell Bench", sets: 4, reps: "8-10" },
      { name: "Pull-ups", sets: 4, reps: "AMRAP" },
      { name: "Pec Deck", sets: 3, reps: "12-15" },
      { name: "T-Bar Row", sets: 3, reps: "8-10" },
      { name: "Face Pull", sets: 3, reps: "15" },
      { name: "Hammer Curl", sets: 3, reps: "12" },
    ],
  },
];

export function findWorkout(id: number): WorkoutDay {
  return WORKOUTS.find((w) => w.id === id) ?? WORKOUTS[0];
}
