import { createSignal, type Component, createEffect, For, Accessor, onMount, Show } from "solid-js";
import { useSocket } from "../contexts/socket-context-provider";
import { createStore } from "solid-js/store";

export const LineChart: Component<{ width: number; height: number; data: any; id: number; exerciseName: string | null; }> =
  ({
    width,
    height,
    id,
    data,
    exerciseName
  }) => {
    const [nothingToGraph, setNothingToGraph] = createSignal<boolean>(false);
    const [historyOfMain, setHistoryOfMain] = createSignal<[Date, string][]>([]);


    createEffect(() => {
      console.log(id, data, exerciseName, 'histroy and then id')
      if (id != 999) {
        setHistoryOfMain([]);
        for (const [key, value] of Object.entries(data)) {
          console.log(value)
          setHistoryOfMain(prev => [...prev, [new Date(value.date), value.weight]])
        }
      } else {
        setHistoryOfMain([]);
        console.log(data, 'data')
        setHistoryOfMain(data)
      }
      //@ts-ignore
      Flotr.draw(document.getElementById(`chart${id}`),
        [{ data: historyOfMain(), lines: { show: true } }],
        {
          xaxis: {
            mode: 'time',
            timemode: 'UTC',
            minTicks: 4
          },
          title: `${exerciseName} progression`,
        }
      )
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
