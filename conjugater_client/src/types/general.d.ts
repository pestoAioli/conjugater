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
