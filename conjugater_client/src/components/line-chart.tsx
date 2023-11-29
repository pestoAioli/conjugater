import { createSignal, type Component, createEffect, For, Accessor, onMount } from "solid-js";

export const LineChart: Component<{ width: number; height: number; exerciseData: any; exerciseName: any }> =
  ({
    width,
    height,
    exerciseData,
    exerciseName
  }) => {
    createEffect(() => {
      if (exerciseData().length == 1) {
        console.log(exerciseData(), "oneeee")
        Flotr.draw(document.getElementById("chart"),
          [{
            data: exerciseData(),
            lines: { show: true },
            points: { show: true }
          }],
          {
            xaxis: {
              mode: 'time',
              timemode: 'UTC',
              noticks: 1
            },
            yaxis: {
              noticks: 2,
            },
            title: `yuove only done ${exerciseName} once, on this day!`,
          }
        )
      }
      if (exerciseData().length > 1) {
        console.log(exerciseData(), "eeeeeeeeee")
        Flotr.draw(document.getElementById("chart"),
          [{ data: exerciseData(), lines: { show: true } }],
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
      <div style={{
        "width": width ? `${width}px` : "500px",
        "height": height ? `${height}px` : "300px",
      }} id="chart" />
    )
  }
