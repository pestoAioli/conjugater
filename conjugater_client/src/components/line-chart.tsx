import { createSignal, type Component, createEffect, For, Accessor, onMount, Show } from "solid-js";
import { useSocket } from "../contexts/socket-context-provider";

export const LineChart: Component<{ width: number; height: number; exerciseType: string; exerciseName: string; id: number }> =
  ({
    width,
    height,
    exerciseName,
    exerciseType,
    id
  }) => {
    const [nothingToGraph, setNothingToGraph] = createSignal<boolean>(false);
    const [historyOfMain, setHistoryOfMain] = createSignal<[Date, string][]>([]);
    const [currID, setCurrID] = createSignal<number>(id);
    const socket = useSocket();
    if (socket) {
      socket.on("found_history_of_main_exercise", (payload: ExerciseRecords) => {
        payload.exercise_records.map((record) => {
          let tuple: [Date, string] = [new Date(record.date), record.weight];
          setHistoryOfMain((prev) => [...prev, tuple]);
        })
        console.log(historyOfMain(), 'history', id, "id")
      })
    }

    createEffect(() => {
      if (socket && currID()) {
        console.log('sockeeeeeeeeet')
        socket.push("find_history_of_main_exercise", { type: exerciseType, exercise: exerciseName })
      }
    });

    createEffect(() => {
      console.log(nothingToGraph(), "sdfsdfsd")
      if (historyOfMain().length == 1) {
        setNothingToGraph(true)
      }
      if (historyOfMain().length > 1) {
        setNothingToGraph(false)
        console.log(historyOfMain(), "eeeeeeeeee")
        Flotr.draw(document.getElementById(`chart${id}`),
          [{ data: historyOfMain(), lines: { show: true } }],
          {
            xaxis: {
              mode: 'time',
              timemode: 'UTC'
            },
            title: `${exerciseName} progression`,
          }
        )
      }
    })

    return (
      <>
        <Show when={nothingToGraph()}>
          <p>this is the first time youve done this exercise!</p>
        </Show>
        <div style={{
          "width": nothingToGraph() ? "1px" : width ? `${width}px` : "500px",
          "height": nothingToGraph() ? "1px" : height ? `${height}px` : "300px",
        }} id={`chart${id}`} />
      </>
    )
  }
