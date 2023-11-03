import { createSignal, type Component, createEffect, Show, For } from "solid-js";
import { useAuth } from "../contexts/auth-context-provider";
import { useSocket } from "../contexts/socket-context-provider";
import moment from "moment";
import { NewAccessory } from "../components/new-accessory";

export const UserData: Component = () => {
  const [token, _setToken] = useAuth();
  const socket = useSocket();
  const [addingExercise, setAddingExercise] = createSignal(false);
  const [date, setDate] = createSignal(moment().format('LL'));
  const [workoutFound, setWorkoutFound] = createSignal(false);
  const [exerciseNames, setExerciseNames] = createSignal<string[]>([]);
  const [maybeMainExercise, setMaybeMainExercise] = createSignal('');
  const [numAccessory, setNumAccessory] = createSignal([0]);

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
  let exercise_records = {};
  let payload: any = {};
  let counter = 1;

  async function addExerciseRecord(e: SubmitEvent) {
    e.preventDefault();
    setAddingExercise(true);
    try {
      // const target = e.target as HTMLInputElementAddExerciseRecord;
      console.log(e.target);
      const target = e.target;
      //@ts-ignore
      for (let i = 0; i < target.length; i++) {
        //@ts-ignore
        if (e.target.elements[i].getAttribute("name") == "main-exercise-type") {
          //@ts-ignore
          if (e.target.elements[i].checked) {
            //@ts-ignore
            exercise_records[e.target.elements[i].getAttribute("name")] = target.elements[i].value;
          }
        } else {
          //@ts-ignore
          exercise_records[e.target.elements[i].getAttribute("name")] = target.elements[i].value;
        }
      }
      console.log(exercise_records, "form");
      for (const [key, value] of Object.entries(exercise_records)) {
        if (key.split("-")[0] == "accessory") {
          if (!payload[counter]) payload[counter] = {};
          if (Number(key.split("-")[2]) == counter) {
            payload[counter][key.split("-")[1]] = value;
          } else {
            counter = Number(key.split("-")[2]);
            if (!payload[counter]) payload[counter] = {};
            payload[counter][key.split("-")[1]] = value;
          }
        }
        if (key.split("-")[0] == "main") {
          if (!payload["main"]) payload["main"] = {};
          if (!key.split("-")[2]) {
            payload["main"][key.split("-")[1]] = value;
          } else {
            payload["main"][key.split("-")[2]] = value;
          }
        }
      }
      console.log(payload)
      for await (const [_key, value] of Object.entries(payload)) {
        const response = await fetch(import.meta.env.VITE_NEW_EXERCISE_RECORD_URL, {
          method: "POST",
          body: JSON.stringify({
            exercise_records: value
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
      }
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
          <p style={{ "margin-top": "0px", "margin-bottom": "4px", "align-self": "center" }}>Add a main exercise:</p>
          <div style={{ "margin-bottom": "4px" }}>
            <input type="radio" id="max" name="main-exercise-type" value="max" onclick={() => setMaybeMainExercise('max')} />
            <label for="max">max</label>
            <input type="radio" id="speed" name="main-exercise-type" value="speed" onclick={() => setMaybeMainExercise('speed')} />
            <label for="speed">speed</label>
            <input type="radio" id="none" name="main-exercise-type" value="none" checked onclick={() => setMaybeMainExercise('none')} />
            <label for="none">none</label>
          </div>
          <Show when={maybeMainExercise() == 'none'}>
          </Show>
          <Show when={maybeMainExercise() == 'max'}>
            <label for="main-exercise">main exercise name:</label>
            <input type="search" list="exercise-names" id="main-exercise" name="main-exercise" required />
            <label for="main-exercise-weight">main exercise weight (1rm):</label>
            <input type="number" id="main-exercise-weight" name="main-exercise-weight" required />
            <label for="main-exercise-notes">notes:</label>
            <textarea id="main-exercise-notes" name="main-exercise-notes" required />
          </Show>
          <Show when={maybeMainExercise() == 'speed'}>
            <label for="main-exercise">main exercise name:</label>
            <input type="search" list="exercise-names" id="main-exercise" name="main-exercise" required />
            <label for="main-exercise-weight">main exercise weight:</label>
            <input type="number" id="main-exercise-weight" name="main-exercise-weight" required />
            <label for="main-exercise-sets">main exercise sets:</label>
            <input type="number" id="main-exercise-sets" name="main-exercise-sets" required />
            <label for="main-exercise-reps">main exercise reps:</label>
            <input type="number" id="main-exercise-reps" name="main-exercise-reps" required />
            <label for="main-exercise-notes">notes:</label>
            <textarea id="main-exercise-notes" name="main-exercise-notes" required />
          </Show>
          <button type="button" onClick={() => numAccessory()[0] == 0 ? setNumAccessory([1]) : setNumAccessory(prev => [...prev, prev[prev.length - 1] + 1])}>
            Add accessory exercise
          </button>
          <For each={numAccessory()}>{(accessory) =>
            <>
              <Show when={accessory == 0}>
              </Show>
              <Show when={accessory != 0}>
                <NewAccessory accessoryId={accessory} list={"exercise-names"} />
              </Show>
            </>
          }
          </For>
          <button type="submit">save</button>
        </form>
      </Show>
    </div>
  )
}
