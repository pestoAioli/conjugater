defmodule ConjugaterWeb.RoomChannel do
  use ConjugaterWeb, :channel

  @impl true
  def join("room:lobby", _payload, socket) do
    {:ok, socket}
  end

  # Channels can be used in a request/response fashion
  # by sending replies to requests from the client
  @impl true
  def handle_in("joined_my_feed", _payload, socket) do
    exercises =
      Conjugater.Exercises.list_exercises()
      |> Enum.map(fn exercise ->
        %{
          name: exercise.name
        }
      end)

    push(socket, "list_exercise_names", %{exercises: exercises})

    {:noreply, socket}
  end

  @impl true
  def handle_in("find_workout_by_date", payload, socket) do
    IO.inspect(payload)

    exercise_records =
      Conjugater.UserRecords.list_exercise_records()
      |> Enum.filter(fn record ->
        record.date == payload["date"]
      end)
      |> Enum.map(fn record ->
        %{
          exercise: record.exercise,
          type: record.type,
          weight: record.weight,
          reps: record.reps,
          sets: record.sets,
          notes: record.notes,
          user_id: record.user_id
        }
      end)

    if length(exercise_records) > 0 do
      push(socket, "found_workout_by_date", %{exercise_records: exercise_records})
    end

    {:noreply, socket}
  end

  @impl true
  def handle_info({:exercise_added, exercise}, socket) do
    IO.inspect(exercise)

    push(socket, "exercise_added", %{
      name: exercise.name
    })

    {:noreply, socket}
  end
end
