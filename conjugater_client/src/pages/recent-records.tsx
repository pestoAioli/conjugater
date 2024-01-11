import { createSignal, type Component, Show, For, createEffect } from "solid-js";
import { useAuth } from "../contexts/auth-context-provider";
import { useSocket } from "../contexts/socket-context-provider";
import moment from "moment";
import { createStore } from "solid-js/store";
import { LineChart } from "../components/line-chart";

export const RecentRecords: Component = () => {
  const [_token, _setToken] = useAuth();
  const socket = useSocket();
  const [date, _setDate] = createSignal(moment().format('LL'));
  const [loading, setLoading] = createSignal(true);
  const [exerciseRecords, setExerciseRecords] = createStore<{ [key: string]: object }>();
  const [historyOfMain, setHistoryOfMain] = createStore<{ [key: string]: object }>();
  const [dates, setDates] = createSignal<string[]>([]);
  const [width, setWidth] = createSignal();
  const [ready, setReady] = createSignal(false);

  if (socket) {
    socket.push("joined_home_page", { date: date() })
    socket.on("found_recent_records", (payload: ExerciseRecords) => {
      console.log(payload, "recent")
      let tempArr: { [key: string]: Array<object> } = {};
      payload.exercise_records.map((record, i) => {
        let day = record.date;
        if (i == 0) {
          tempArr[day] = [];
          tempArr[day].push(record)
        } else if (tempArr[day]) {
          tempArr[day].push(record)
        } else {
          tempArr[day] = [];
          tempArr[day].push(record)
        }
        console.log(day, tempArr)
      })
      for (const [key, value] of Object.entries(tempArr)) {
        setExerciseRecords(`${key}`, rec => value)
        //@ts-ignore
        console.log(exerciseRecords[key], "2323")
        //@ts-ignore
        socket.push("find_history_of_main_exercise", { type: exerciseRecords[key][0].type, exercise: exerciseRecords[key][0].exercise })
        setDates(asd => [...asd, key])
      }
      console.log(exerciseRecords, "333")
      setReady(true);
    })
    socket.on("found_history_of_main_exercise", (payload: ExerciseRecords) => {
      setLoading(true)
      for (let i = 0; i < payload.exercise_records.length; i++) {
        for (const [key, value] of Object.entries(exerciseRecords)) {
          //@ts-ignore
          if (payload.exercise_records[i].exercise == value[0].exercise) {
            //@ts-ignore
            console.log(value[0].exercise, "value", payload.exercise_records, "exc", i)
            if (Object.keys(value).length == 1) {
              setExerciseRecords(key, (prev: []) => [...prev, { data: payload.exercise_records, id: Math.floor(Math.random() * 3393), exercise: payload.exercise_records[0].exercise }])
            }
          }
        }
      }
      console.log(exerciseRecords, "hehe")
      setLoading(false)
    })
  }





  return (
    <>
      <Show when={loading()}>
        ...
      </Show>
      <Show when={!loading()}>
        <h2 style={{ "margin-left": "8px" }}>recent exercises:</h2>
        <For each={dates()}>{(date, k) =>
          <div style={{ "display": "flex", "flex-direction": "column", "border": "1px solid black", "max-width": "360px", "background-color": "whitesmoke", "border-radius": "8px", "margin-bottom": "4px", "margin-left": "8px", "margin-right": "8px" }}>
            <For each={exerciseRecords[date] as any[]}>{(record: any, i) =>
              <>
                <Show when={i() == 0}>
                  <span style={{ "margin-left": "8px", "margin-bottom": "0px", "margin-top": "4px", "font-size": "large" }}>{record.date}</span>
                  <Show when={!record.type}>
                    <div style={{ "display": "flex", "align-items": "baseline" }}>
                      <p style={{ "margin-bottom": "0px", "margin-left": "8px", "font-size": "larger", "color": "mediumorchid" }}>{record.exercise}</p>
                      <p style={{ "margin-bottom": "0px", "margin-left": "8px" }}>{record.sets} sets</p>
                      <p style={{ "margin-bottom": "0px", "margin-left": "8px" }}>@ {record.weight} lbs</p>
                    </div>
                  </Show>
                  <Show when={record.type}>
                    <div style={{ "display": "flex", "margin-left": "8px", "height": "28px", "gap": "4px", "align-items": "baseline", "margin-bottom": "0px", "margin-top": "0px" }}>
                      <p style={{ "margin-bottom": "0px", "margin-top": "4px", "font-size": "x-large", }}>{record.user_name} </p>
                      <p style={{ "margin-bottom": "0px", "margin-top": "4px", "font-size": "larger" }}>did</p>
                      <p style={{ "margin-bottom": "0px", "margin-top": "4px", "font-size": "larger", "color": "mediumorchid" }}>{record.type == 'max' ? `${record.type} effort` : record.type == 'speed' ? `${record.type} day` : `just accessory work`}:</p>
                    </div>
                    <div style={{ "display": "flex", "margin-left": "8px", "gap": "4px", "align-items": "center" }}>
                      <p style={{ "color": "mediumslateblue" }}>{record.exercise}</p>
                      <p> @ {record.weight} lbs</p>
                    </div>
                    <Show when={record.notes}>
                      <p style={{ "margin-left": "8px", "margin-bottom": "0px", "margin-top": "0px" }}>{record.user_name}'s notes:</p>
                      <p style={{ "margin-left": "8px" }}>{record.notes}</p>
                    </Show>
                  </Show>
                </Show>
                <Show when={i() == 1}>
                  <LineChart width={300} height={200} exerciseName={record.exercise} id={record.id} data={record.data} />
                </Show>
              </>
            }
            </For>
          </div>
        }
        </For>
      </Show>
    </>
  )

}
