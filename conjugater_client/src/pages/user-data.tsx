import { createSignal, type Component } from "solid-js";
import { useAuth } from "../contexts/auth-context-provider";
import { useSocket } from "../contexts/socket-context-provider";

export const UserData: Component = () => {
  const [token, _setToken] = useAuth();
  const socket = useSocket();
  const [addingExercise, setAddingExercise] = createSignal(false);

  if (socket) {
    console.log("socket connected")
    console.log(token());
    socket.push("joined_my_feed", {});
    socket.on("list_my_data", (payload: any) => {
      console.log(payload);
    })
    socket.on("exercise_added", (payload: any) => {
      console.log(payload, "addedddddddddddddddd");
    })
  }

  async function addExercise(e: SubmitEvent) {
    e.preventDefault();
    setAddingExercise(true);
    try {
      const target = e.target as HTMLInputElementAddExercise;
      const exercise = target.exercise.value;
      console.log(exercise);
      const response = await fetch(import.meta.env.VITE_NEW_EXERCISE_URL, {
        method: "POST",
        body: JSON.stringify({ exercise: { name: exercise } }),
        mode: 'cors',
        headers: {
          'Access-Control-Allow-Origin': '*',
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token()}`
        }
      })
      const result = await response.json();
      console.log(result, "result0000000000000000");
      setAddingExercise(false);
    } catch (e) {
      console.log(e);
      setAddingExercise(false);
    }

  }
  return (
    <div class="home-login">
      <form onSubmit={addExercise}>
        <input name="exercise" id="exercise" placeholder="save new exercise" required />
        <button type="submit">add esserzicio</button>
      </form>
    </div>
  )
}
