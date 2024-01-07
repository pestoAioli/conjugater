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
    const [historyOfMain, setHistoryOfMain] = createStore<{ [key: string]: [Date, string][] }>();


    createEffect(() => {
      console.log(id, exerciseName, 'histroy and then id')
      //@ts-ignore
      Flotr.draw(document.getElementById(`chart${id}`),
        [{ data: data, lines: { show: true } }],
        {
          xaxis: {
            mode: 'time',
            timemode: 'UTC'
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
