import { createSignal, type Component, Show, For } from "solid-js";
import { useAuth } from "../contexts/auth-context-provider";
import { useSocket } from "../contexts/socket-context-provider";
import moment from "moment";
import { createStore } from "solid-js/store";
import { constants } from "zlib";

export const RecentRecords: Component = () => {
  const [token, _setToken] = useAuth();
  const socket = useSocket();
  const [date, setDate] = createSignal(moment().format('LL'));
  const [loading, setLoading] = createSignal(true);
  const [exerciseRecords, setExerciseRecords] = createStore<any>();
  const [dates, setDates] = createSignal<string[]>([]);

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
        setExerciseRecords(`${key}`, (rec: any) => value)
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
        <For each={dates()}>{(date, i) =>
          <For each={exerciseRecords[date]}>{(record) =>
            <div style={{ "display": "flex", "border": "1px solid black", "border-radius": "8px", "margin-bottom": "4px", "margin-left": "8px", "margin-right": "8px" }}>
              <div>
                <p style={{ "margin-left": "8px" }}><b>{record.user_name}</b> @ {record.date}</p>
                <p style={{ "margin-left": "8px" }}>{record.type ? record.type : `just accessory work`}: {record.exercise}</p>
              </div>
            </div>
          }
          </For>
        }
        </For>
      </Show>
    </>
  )

}
