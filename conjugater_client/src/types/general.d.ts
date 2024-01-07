interface HTMLInputElementLogin extends EventTarget {
  email: { value: string };
  password: { value: string };
}
interface HTMLInputElementSignUp extends EventTarget {
  email: { value: string };
  password: { value: string };
  username: { value: string };
}
interface HTMLInputElementAddExercise extends EventTarget {
  exercise: { value: string }
}

interface HTMLInputElementAddExerciseRecord extends EventTarget {
  type: { value: string };
  weight: { value: number };
  reps: { value: number };
  sets: { value: number };
  exercise: { value: string };
  notes: { value: string };
}
interface Exercises {
  exercises: Exercise[];
}
interface Exercise {
  name: string;
}
interface ExerciseRecord {
  type?: string;
  id: number;
  reps?: string;
  weight: string;
  sets?: string;
  exercise: string;
  notes?: string;
  user_id?: number;
  date: string;
  user_name?: string;
  data?: any;
}
interface ExerciseRecords {
  exercise_records: ExerciseRecord[];
}

interface Payload {
  [key: string | number]: any;
}
