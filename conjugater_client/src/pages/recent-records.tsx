import { createSignal, type Component, Show, For } from "solid-js";
import { useAuth } from "../contexts/auth-context-provider";
import { useSocket } from "../contexts/socket-context-provider";
import moment from "moment";

export const RecentRecords: Component = () => {
  const [token, _setToken] = useAuth();
  const socket = useSocket();
  const [date, setDate] = createSignal(moment().format('LL'));
  const [loading, setLoading] = createSignal(true);
  const [exerciseRecords, setExerciseRecords] = createSignal<ExerciseRecord[][]>([]);

  if (socket) {
    socket.push("joined_home_page", { date: date() })
    socket.on("found_recent_records", (payload: ExerciseRecords) => {
      console.log(payload)
      let tempArr: any = [];
      payload.exercise_records.map((record, i) => {
        let day = record.date;
        if (tempArr.length == 0) {
          tempArr.push(record);
          console.log(tempArr, '1')
        } else if (tempArr[0].date == day) {
          tempArr.push(record);
          console.log(tempArr, '2')
        } else {
          setExerciseRecords(prev => [...prev, [tempArr]])
          console.log(exerciseRecords(), '3')
          tempArr = [];
        }
      })
      console.log(exerciseRecords())
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
        <For each={exerciseRecords()}>{(record) =>
          <For each={record}>{(day) =>
            <div style={{ "display": "flex", "border": "1px solid black", "border-radius": "8px", "margin-bottom": "4px", "margin-left": "8px", "margin-right": "8px" }}>
              <div>
                <p style={{ "margin-left": "8px" }}><b>{day.user_name}</b> @ {day.date}</p>
                <p style={{ "margin-left": "8px" }}>{day.type ? day.type : `just accessory work`}: {day.exercise}</p>
              </div>
            </div>
          }</For>
        }
        </For>
      </Show>
    </>
  )

}
