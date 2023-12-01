import { createSignal, type Component, createEffect, For, Accessor, onMount, Show } from "solid-js";

export const LineChart: Component<{ width: number; height: number; exerciseData: any; exerciseName: any }> =
  ({
    width,
    height,
    exerciseData,
    exerciseName
  }) => {
    const [nothingToGraph, setNothingToGraph] = createSignal<boolean>(false);
    createEffect(() => {
      console.log(nothingToGraph(), "sdfsdfsd")
      if (exerciseData().length == 1) {
        setNothingToGraph(true)
      }
      if (exerciseData().length > 1) {
        setNothingToGraph(false)
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
      <>
        <Show when={nothingToGraph()}>
          <p>this is the first time youve done this exercise!</p>
        </Show>
        <div style={{
          "width": nothingToGraph() ? "1px" : width ? `${width}px` : "500px",
          "height": nothingToGraph() ? "1px" : height ? `${height}px` : "300px",
        }} id="chart" />
      </>
    )
  }
