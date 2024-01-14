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
      console.log(tempArr, "tempy")
      for (const [key, value] of Object.entries(tempArr)) {
        console.log(key, value, "tempy")
        setExerciseRecords(`${key}`, rec => value)
        //@ts-ignore
        console.log(exerciseRecords[key], "2323")
        if (value.length > 1) {
          for (let i = 0; i < value.length; i++) {
            //@ts-ignore
            if (value[i].type) {
              //@ts-ignore
              console.log(value[i].type, "ffff")
              //@ts-ignore
              socket.push("find_history_of_main_exercise", { type: exerciseRecords[key][0].type, exercise: exerciseRecords[key][0].exercise })
            }
          }
        } else {
          //@ts-ignore
          if (exerciseRecords[key][0].type) {
            //@ts-ignore
            console.log(exerciseRecords[key][0].type, exerciseRecords[key][0].exercise, "ffff", "2")
            //@ts-ignore
            socket.push("find_history_of_main_exercise", { type: exerciseRecords[key][0].type, exercise: exerciseRecords[key][0].exercise })
          }
        }

        setDates(asd => [...asd, key])
      }
      console.log(exerciseRecords, "333")
      setReady(true);
    })
    socket.on("found_history_of_main_exercise", (payload: ExerciseRecords) => {
      setLoading(true)
      for (let i = 0; i < payload.exercise_records.length; i++) {
        console.log(payload.exercise_records, "ppp",)
        for (const [key, value] of Object.entries(exerciseRecords)) {
          console.log(key == payload.exercise_records[i].date, payload.exercise_records[i].date, "pppp")
          //@ts-ignore
          if (key == payload.exercise_records[i].date) {
            let dont = false;
            for (let k = 0; k < Object.keys(value).length; k++) {
              //@ts-ignore
              if (value[k].data) dont = true;
            }
            if (!dont) {
              setExerciseRecords(key, (prev: []) => [...prev, { data: payload.exercise_records, id: Math.floor(Math.random() * 3393), exercise: payload.exercise_records[0].exercise }])
            }
          }
          console.log(key, exerciseRecords[key], "hihi")
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
            <span style={{ "margin-left": "8px", "margin-bottom": "0px", "margin-top": "4px", "font-size": "large" }}>{date}</span>
            <For each={exerciseRecords[date] as any[]}>{(record: any, i) =>
              <>
                <Show when={!record.data}>
                  <Show when={record.type}>
                    <div style={{ "display": "flex", "margin-left": "8px", "height": "28px", "gap": "4px", "align-items": "baseline", "margin-bottom": "0px", "margin-top": "0px" }}>
                      <p style={{ "margin-bottom": "0px", "margin-top": "4px", "font-size": "x-large", }}>{record.user_name} </p>
                      <p style={{ "margin-bottom": "0px", "margin-top": "4px", "font-size": "larger" }}>did</p>
                      <p style={{ "margin-bottom": "0px", "margin-top": "4px", "font-size": "larger", "color": "mediumorchid" }}>{record.type == 'max' ? `${record.type} effort` : record.type == 'speed' ? `${record.type} day` : `just accessory work`}:</p>
                    </div>
                    <div style={{ "display": "flex", "margin-left": "8px", "gap": "4px", "align-items": "center" }}>
                      <p style={{ "color": "mediumorchid" }}>{record.exercise}</p>
                      <p> @ {record.weight} lbs</p>
                    </div>
                  </Show>
                  <Show when={!record.type}>
                    <div style={{ "display": "flex", "align-items": "baseline" }}>
                      <p style={{ "margin-bottom": "0px", "margin-left": "8px", "font-size": "large", "color": "mediumslateblue" }}>{record.exercise}</p>
                      <p style={{ "margin-bottom": "0px", "margin-left": "8px" }}>{record.sets} sets</p>
                      <p style={{ "margin-bottom": "0px", "margin-left": "8px" }}>@ {record.weight} lbs</p>
                    </div>
                  </Show>
                  <Show when={record.notes}>
                    <p style={{ "margin-left": "8px", "margin-bottom": "0px", "margin-top": "0px" }}>{record.user_name}'s notes:</p>
                    <p style={{ "margin-left": "8px" }}>{record.notes}</p>
                  </Show>
                </Show>
                <Show when={record.data}>
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
