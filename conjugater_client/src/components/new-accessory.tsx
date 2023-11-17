import type { Accessor, Component } from "solid-js";
import { Show } from "solid-js";

export const NewAccessory: Component<{ accessoryId: number, list: string }> = ({ accessoryId, list }) => {
  return (
    <div id={`${accessoryId}`} style={{ "display": "flex", "flex-direction": "column", "align-items": "center" }}>
      <p>Accesory #{accessoryId}</p>
      <label for={`accessory-exercise-${accessoryId}`}>name of exercise: </label>
      <input type="search" list={list} name={`accessory-exercise-${accessoryId}`} id={`accessory-exercise-${accessoryId}`} />
      <label for={`accessory-reps-${accessoryId}`}>reps: </label>
      <input type="number" name={`accessory-reps-${accessoryId}`} id={`accessory-reps-${accessoryId}`} />
      <label for={`accessory-sets-${accessoryId}`}>sets: </label>
      <input type="number" name={`accessory-sets-${accessoryId}`} id={`accessory-sets-${accessoryId}`} />
      <label for={`accessory-weight-${accessoryId}`}>weight: </label>
      <input type="number" name={`accessory-weight-${accessoryId}`} id={`accessory-weight-${accessoryId}`} />
      <label for={`accessory-notes-${accessoryId}`}>notes: </label>
      <textarea name={`accessory-notes-${accessoryId}`} id={`accessory-notes-${accessoryId}`} />
      <button type="button" onClick={() => accessoryId != 0 ? document.getElementById(`${accessoryId}`)?.remove() : null}>remove</button>
    </div>
  )
}
