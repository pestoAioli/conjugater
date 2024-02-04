import type { Setter, Accessor, Component } from "solid-js";
import { For, Show } from "solid-js";
import { NewAccessory } from "./new-accessory";
import { useSocket } from "../contexts/socket-context-provider";

export const AddExerciseRecord: Component<
  {
    setAddingExercise: Setter<boolean>;
    token: Accessor<string>;
    date: Accessor<string>;
    exerciseNames: Accessor<string[]>;
    setMaybeMainExercise: Setter<string>;
    maybeMainExercise: Accessor<string>;
    numAccessory: Accessor<number[]>;
    setNumAccessory: Setter<number[]>
  }> =
  (
    { setAddingExercise,
      token,
      date,
      exerciseNames,
      setMaybeMainExercise,
      maybeMainExercise,
      numAccessory,
      setNumAccessory,
    }) => {
    const socket = useSocket();
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
        console.log(result, "result from add exercise");
      } catch (e) {
        console.log(e);
      }

    }
    let exercise_records = {};
    let payload: Payload = {};
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
        for (const [key, value] of Object.entries(exercise_records)) {
          if (key.split("-")[0] == "accessory") {
            if (!payload[counter]) {
              payload[counter] = {};
              payload[counter]["date"] = date();
            }
            if (Number(key.split("-")[2]) == counter) {
              payload[counter][key.split("-")[1]] = value;
            } else {
              counter = Number(key.split("-")[2]);
              if (!payload[counter]) {
                payload[counter] = {};
                payload[counter]["date"] = date();
              }
              payload[counter][key.split("-")[1]] = value;
            }
          }
          if (key.split("-")[0] == "main") {
            if (!payload["main"]) {
              payload["main"] = {};
              payload["main"]["date"] = date();
            }
            if (!key.split("-")[2]) {
              payload["main"][key.split("-")[1]] = value;
            } else {
              payload["main"][key.split("-")[2]] = value;
            }
          }
        }
        console.log(payload)
        for await (const [_key, value] of Object.entries(payload)) {
          if (!exerciseNames().includes(value.exercise)) {
            addExercise(value.exercise)
          }
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
        if (socket) {
          socket.push("added_exercise_record_overall", {});
        }
        setAddingExercise(false);
      } catch (e) {
        console.log(e);
        setAddingExercise(false);
      }
    }
    return (
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
        <button type="button" onClick={() => numAccessory()[0] == 0 ? setNumAccessory([1]) : setNumAccessory(prev => [...prev, prev[prev.length - 1] + 1])}>
          Add accessory exercise
        </button>
        <button type="submit">save</button>
      </form>
    )
  }
