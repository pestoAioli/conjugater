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
