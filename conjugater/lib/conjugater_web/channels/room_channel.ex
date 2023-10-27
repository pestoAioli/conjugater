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

  # It is also common to receive messages from the client and
  # broadcast to everyone in the current topic (room:lobby).
  @impl true
  def handle_in("shout", payload, socket) do
    broadcast(socket, "shout", payload)
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
