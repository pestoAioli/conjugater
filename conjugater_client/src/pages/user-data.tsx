import { createSignal, type Component, createEffect, Show, For, onMount } from "solid-js";
import { useAuth } from "../contexts/auth-context-provider";
import { useSocket } from "../contexts/socket-context-provider";
import moment from "moment";
import { AddExerciseRecord } from "../components/add-exercise-record";
import { A } from "@solidjs/router";
import { LineChart } from "../components/line-chart";

export const UserData: Component = () => {
  const [token, _setToken] = useAuth();
  const socket = useSocket();
  const [addingExercise, setAddingExercise] = createSignal(false);
  const [date, setDate] = createSignal(moment().format('LL'));
  const [workoutFound, setWorkoutFound] = createSignal(false);
  const [exerciseNames, setExerciseNames] = createSignal<string[]>([]);
  const [exerciseRecords, setExerciseRecords] = createSignal<ExerciseRecord[]>([]);
  const [maybeMainExercise, setMaybeMainExercise] = createSignal('');
  const [numAccessory, setNumAccessory] = createSignal([0]);
  const [typeEx, setTypeEx] = createSignal('');
  const [mainName, setMainName] = createSignal('');
  const [historyOfMain, setHistoryOfMain] = createSignal<[Date, string][]>([]);
  const [width, setWidth] = createSignal(300);
  const [height, setHeight] = createSignal(200);

  if (socket) {
    console.log(date(), 'date')
    socket.push("joined_my_feed", {});
    socket.on("list_exercise_names", (payload: Exercises) => {
      payload.exercises.map((exercise) => setExerciseNames((name) => [...name, exercise.name]))
    })

    socket.on("found_workout_by_date", (payload: ExerciseRecords) => {
      payload.exercise_records.map((record) => {
        setExerciseRecords((prev) => [...prev, record]);
        if (record.type == "speed" || record.type == "max") {
          setTypeEx(record.type);
          setMainName(record.exercise);
        }
      })
      setWorkoutFound(true);
    })
    socket.on("found_history_of_main_exercise", (payload: ExerciseRecords) => {
      payload.exercise_records.map((record) => {
        let tuple: [Date, string] = [new Date(record.date), record.weight];
        setHistoryOfMain((prev) => [...prev, tuple]);
      })
    })
  }
  createEffect(() => {
    if (socket && date()) {
      setWorkoutFound(false);
      setExerciseRecords([]);
      socket.push("find_workout_by_date", { date: date() })
    }
  });

  createEffect(() => {
    if (socket && typeEx() && mainName()) {
      setHistoryOfMain([])

      console.log(typeEx());
      socket.push("find_history_of_main_exercise", { type: typeEx(), exercise: mainName() })
    }
  });
  createEffect(() => {
    if (historyOfMain()) {
      if (historyOfMain().length > 1) {
      }
    }
  })

  function setFormDate(e: Event & { currentTarget: HTMLFormElement; target: Element }) {
    const target = e.target as HTMLFormElement;
    setDate(moment(target.value).format('LL'))
  }

  return (
    <div class="home-login">
      <A href='/login' style={{ "color": "rebeccapurple", "align-self": "end" }}>logout</A>
      <datalist id="exercise-names">
        <For each={exerciseNames()}>{(exercise) =>
          <option value={exercise} />
        }</For>
      </datalist>
      <div style={{ "display": "flex", "align-items": "center", "gap": "10px" }}>
        <p>Select date:</p>
        <form onChange={setFormDate}>
          <input type="date" name="date" id="date" max={new Date().toISOString().split('T')[0]} />
        </form>
      </div>
      <h2 style={{ "margin-bottom": "0px", "margin-top": "0px" }}>{date()}</h2>
      <Show when={workoutFound()}>
        <For each={exerciseRecords()}>{(record) =>
          <Show when={record.type && record.type != "none"}>
            <h3 style={{ "margin-bottom": "0px", "font-size": "24px", "color": "saddlebrown" }}>{record.type} day</h3>
            <h4 style={{ "margin-bottom": "0px", "font-size": "larger" }}>{record.exercise}</h4>
            <Show when={record.type == "speed"}>
              <div style={{ "font-size": "larger", "display": "flex", "justify-content": "space-between", "gap": "8px", "align-items": "center" }}>
                <p>{record.sets} sets</p>
                <p>{record.reps} reps</p>
                <p>{record.weight} lbs</p>
              </div>
            </Show>
            <Show when={record.type == "max"}>
              <p style={{ "font-size": "larger" }}>{record.weight} lbs</p>
            </Show>
            <p style={{ "max-width": "310px", "margin-top": "0px" }}>{record.notes}</p>
          </Show>
        }
        </For>
        <For each={exerciseRecords()}>{(record) =>
          <div style={{ "display": "flex", "flex-direction": "column", "align-items": "center" }}>
            <Show when={!record.type || record.type == "none"}>
              <h4 style={{ "margin-bottom": "0px" }}>{record.exercise}</h4>
              <div style={{ "display": "flex", "justify-content": "space-between", "gap": "8px", "align-items": "center" }}>
                <p>{record.sets} sets</p>
                <p>{record.reps} reps</p>
                <p>{record.weight} lbs</p>
              </div>
              <p style={{ "max-width": "310px" }}>{record.notes}</p>
            </Show>
          </div>
        }
        </For>
        <LineChart width={width()} height={height()} exerciseData={historyOfMain} exerciseName={mainName()} />
      </Show>
      <Show when={!workoutFound() && !addingExercise()}>
        <i style={{ "margin": "8px" }}>No exercises have been logged for this day!</i>
        <b style={{ "margin-bottom": "8px" }}>New workout:</b>
        <AddExerciseRecord
          setAddingExercise={setAddingExercise}
          token={token}
          date={date}
          exerciseNames={exerciseNames}
          setMaybeMainExercise={setMaybeMainExercise}
          maybeMainExercise={maybeMainExercise}
          numAccessory={numAccessory}
          setNumAccessory={setNumAccessory}
        />
      </Show>
      <Show when={addingExercise()}>saving...</Show>
    </div>
  )
}
