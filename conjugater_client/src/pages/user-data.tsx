import { createSignal, type Component, createEffect, Show, For } from "solid-js";
import { useAuth } from "../contexts/auth-context-provider";
import { useSocket } from "../contexts/socket-context-provider";
import moment from "moment";

export const UserData: Component = () => {
  const [token, _setToken] = useAuth();
  const socket = useSocket();
  const [addingExercise, setAddingExercise] = createSignal(false);
  const [date, setDate] = createSignal(moment().format('LL'));
  const [workoutFound, setWorkoutFound] = createSignal(false);
  const [exerciseNames, setExerciseNames] = createSignal<string[]>([]);
  const [maybeMainExercise, setMaybeMainExercise] = createSignal(true);
  const noMainExercise = document.getElementById('none') as HTMLInputElement;

  if (socket) {
    console.log("socket connected")
    console.log(token());
    socket.push("joined_my_feed", {});
    socket.on("list_exercise_names", (payload: Exercises) => {
      console.log(payload.exercises);
      payload.exercises.map((exercise) => setExerciseNames((name) => [...name, exercise.name]))
      console.log(exerciseNames(), "exerdsdfad")
    })
    socket.on("exercise_added", (payload: any) => {
      console.log(payload, "addedddddddddddddddd");
    })
    socket.on("found_workout_by_date", (payload: any) => {
      setWorkoutFound(true);
    })
  }
  createEffect(() => {
    if (socket && date()) {
      console.log('date changed')
      socket.push("find_workout_by_date", {})
    }
  })
  createEffect(() => {
    if (noMainExercise.checked) {
      setMaybeMainExercise(false);
    }
  })

  async function addExercise(exerciseName: string) {
    try {
      const response = await fetch(import.meta.env.VITE_NEW_EXERCISE_URL, {
        method: "POST",
        body: JSON.stringify({ exercise: { name: exerciseName } }),
        mode: 'cors',
        headers: {
          'Access-Control-Allow-Origin': '*',
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token()}`
        }
      })
      const result = await response.json();
      console.log(result, "result0000000000000000");
    } catch (e) {
      console.log(e);
    }

  }

  async function addExerciseRecord(e: SubmitEvent) {
    e.preventDefault();
    setAddingExercise(true);
    try {
      const target = e.target as HTMLInputElementAddExerciseRecord;
      const type = target.type.value;
      const weight = target.weight.value;
      const reps = target.reps.value;
      const sets = target.sets.value;
      const exercise = target.exercise.value;
      const notes = target.notes.value;
      if (!exerciseNames().includes(exercise)) {
        addExercise(exercise);
      }
      const response = await fetch(import.meta.env.VITE_NEW_EXERCISE_URL, {
        method: "POST",
        body: JSON.stringify({
          exercise_records: {
            name: exercise
          }
        }),
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
  //  for UTC -----> {moment.utc().format('YYYY-MM-DD HH:mm:ss')}Z
  return (
    <div class="home-login">
      <datalist id="exercise-names">
        <For each={exerciseNames()}>{(exercise) =>
          <option value={exercise} />
        }</For>
      </datalist>
      <div style={{ "display": "flex", "align-items": "center", "gap": "10px" }}>
        <p>Select date:</p>
        <form onChange={(e: any) => { setDate(moment(e.target.value).format('LL')) }}>
          <input type="date" name="date" id="date" max={new Date().toISOString().split('T')[0]} />
        </form>
      </div>
      <h2 style={{ "margin-bottom": "0px", "margin-top": "0px" }}>{date()}</h2>
      <Show when={workoutFound()}>
        <p>:0</p>
      </Show>
      <Show when={!workoutFound()}>
        <i style={{ "margin": "8px" }}>No exercises have been logged for this day!</i>
        <b style={{ "margin-bottom": "8px" }}>New workout:</b>
        <form onSubmit={addExerciseRecord} style={{ "display": "flex", "flex-direction": "column" }}>
          <div style={{ "margin-bottom": "4px" }}>
            <p style={{ "margin-top": "0px", "margin-bottom": "4px" }}>Add a main exercise:</p>
            <input type="radio" id="max" name="type" value="max" />
            <label for="max">max</label>
            <input type="radio" id="speed" name="type" value="speed" />
            <label for="speed">speed</label>
            <input type="radio" id="none" name="type" value="none" />
            <label for="none">none</label>
          </div>
          <label for="main-exercise">main exercise name:</label>
          <input type="search" list="exercise-names" id="main-exercise" name="main-exercise" required />
          <button type="submit">save</button>
        </form>
      </Show>

      <form>

      </form>
    </div>
  )
}
