import { createSignal, type Component, createEffect, For, Accessor, onMount, Show } from "solid-js";
import { useSocket } from "../contexts/socket-context-provider";
import { createStore } from "solid-js/store";

export const LineChart: Component<{ width: number; height: number; exerciseType: string | null; exerciseName: string | null; id: number }> =
  ({
    width,
    height,
    exerciseName,
    exerciseType,
    id
  }) => {
    const [nothingToGraph, setNothingToGraph] = createSignal<boolean>(false);
    const [historyOfMain, setHistoryOfMain] = createStore<{ [key: string]: [Date, string][] }>([]);
    const [currID, setCurrID] = createSignal<number>(id);
    const [found, setFound] = createSignal(false);
    const socket = useSocket();
    if (socket) {
      socket.on("found_history_of_main_exercise", (payload: ExerciseRecords) => {
        let currArray: [Date, string][] = [];
        payload.exercise_records.map((record) => {
          let tuple: [Date, string] = [new Date(record.date), record.weight];
          currArray.push(tuple);
        })
        setHistoryOfMain(`${id}`, (prev) => currArray);
        setFound(true);
      })
    }

    createEffect(() => {
      if (socket && id) {
        console.log('NAME SND TYPOE', exerciseName, exerciseType)
        socket.push("find_history_of_main_exercise", { type: exerciseType, exercise: exerciseName })
        setFound(false)
      }
    });

    createEffect(() => {
      if (historyOfMain[`${id}`] && found()) {
        console.log(historyOfMain[`${id}`], id, 'histroy and then id')
      }
      // Flotr.draw(document.getElementById(`chart${id}`),
      //   [{ data: historyOfMain[`${id}`], lines: { show: true } }],
      //   {
      //     xaxis: {
      //       mode: 'time',
      //       timemode: 'UTC'
      //     },
      //     title: `${exerciseName} progression`,
      //   }
      // )
    })

    return (
      <>
        <Show when={nothingToGraph()}>
          <p>this is the first time <Show when={id != 999}> theyve</Show><Show when={id === 999}>yuove</Show> done this exercise!</p>
        </Show>
        <div style={{
          "width": nothingToGraph() ? "1px" : width ? `${width}px` : "500px",
          "height": nothingToGraph() ? "1px" : height ? `${height}px` : "300px",
        }} id={`chart${id}`} />
      </>
    )
  }
