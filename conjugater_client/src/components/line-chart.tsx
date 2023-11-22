import { createSignal, type Component, createEffect, For, Accessor, onMount } from "solid-js";

export const LineChart: Component<{ width: number; height: number; exerciseData: any; exerciseName: any }> =
  ({
    width,
    height,
    exerciseData,
    exerciseName
  }) => {
    onMount(() => {
      Flotr.draw(document.getElementById("chart"),
        [{ data: exerciseData, lines: { show: true } }],
        {
          xaxis: {
            mode: 'time'
          },
          title: `${exerciseName} progression`,
        }
      )
    })

    return (
      <div style={{
        "height": "200px",
        "width": "100px",
      }} id="chart" />
    )
  }
