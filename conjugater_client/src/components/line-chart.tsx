import { createSignal, type Component, createEffect, For } from "solid-js";
import '../styles/chart.css';

export const LineChart: Component<{ width: number; height: number; exerciseData: any }> =
  ({
    width,
    height,
    exerciseData
  }) => {
    return (
      <div style={{
        "height": `${height}px`,
        "width": `${width}px`,
      }} id="line-chart" />
    )
  }
