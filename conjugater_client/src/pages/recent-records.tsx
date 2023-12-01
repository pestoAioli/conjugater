import { createSignal, type Component, Show, For } from "solid-js";
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
  const [dates, setDates] = createSignal<string[]>([]);
  const [width, setWidth] = createSignal();

  if (socket) {
    socket.push("joined_home_page", { date: date() })
    socket.on("found_recent_records", (payload: ExerciseRecords) => {
      console.log(payload)
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
        console.log(exerciseRecords[key])
        setDates(asd => [...asd, key])
      }
      console.log(dates())
      setLoading(false);
    })
  }



  return (
    <>
      <Show when={loading()}>
        ...
      </Show>
      <Show when={!loading()}>
        <h2 style={{ "margin-left": "8px" }}>exercises done this month:</h2>
        <For each={dates()}>{(date, k) =>
          <div style={{ "display": "flex", "flex-direction": "column", "border": "1px solid black", "background-color": "whitesmoke", "border-radius": "8px", "margin-bottom": "4px", "margin-left": "8px", "margin-right": "8px" }}>
            <For each={exerciseRecords[date] as any[]}>{(record: ExerciseRecord, i) =>
              <>
                <Show when={i() == 0}>
                  <h3 style={{ "margin-left": "8px", "margin-bottom": "0px" }}>{record.user_name} @ {record.date}</h3>
                </Show>
                <Show when={!record.type}>
                  <div style={{ "display": "flex", "align-items": "baseline" }}>
                    <p style={{ "margin-bottom": "0px", "margin-left": "8px", "font-size": "larger", "color": "mediumorchid" }}>{record.exercise}</p>
                    <p style={{ "margin-bottom": "0px", "margin-left": "8px" }}>{record.sets} sets</p>
                    <p style={{ "margin-bottom": "0px", "margin-left": "8px" }}>@ {record.weight} lbs</p>
                  </div>
                </Show>
                <Show when={record.type}>
                  <div style={{ "display": "flex", "margin-left": "8px", "gap": "4px", "align-items": "center" }}>
                    <p style={{ "font-size": "larger", "color": "mediumorchid" }}>{record.type == 'max' ? `${record.type} effort` : record.type == 'speed' ? `${record.type} day` : `just accessory work`}:</p>
                    <p style={{ "color": "mediumslateblue" }}>{record.exercise}</p>
                    <p> @ {record.weight} lbs</p>
                  </div>
                  <LineChart width={300} height={200} exerciseName={record.exercise} exerciseType={record.type!} id={k()} />
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
