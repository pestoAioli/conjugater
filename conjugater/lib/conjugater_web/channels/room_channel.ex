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
          id: record.id,
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
  def handle_in("find_history_of_main_exercise", payload, socket) do
    exercise_records =
      Conjugater.UserRecords.list_exercise_records()
      |> Enum.filter(fn record ->
        record.type && record.type == payload["type"] && record.exercise == payload["exercise"]
      end)
      |> Enum.map(fn record ->
        %{
          exercise: record.exercise,
          id: record.id,
          type: record.type,
          weight: record.weight,
          reps: record.reps,
          sets: record.sets,
          notes: record.notes,
          user_id: record.user_id,
          date: record.date
        }
      end)

    IO.inspect(exercise_records)

    push(socket, "found_history_of_main_exercise", %{exercise_records: exercise_records})

    {:noreply, socket}
  end

  @impl true
  def handle_in("joined_home_page", payload, socket) do
    months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December"
    ]

    [incoming_month | tail] = String.split(payload["date"])
    [day | _year] = tail
    day_minus_comma_lol = String.trim(day, ",")
    IO.inspect(day_minus_comma_lol)
    IO.inspect(incoming_month)
    last_month = Enum.at(months, Enum.find_index(months, fn x -> x == incoming_month end) - 1)
    IO.inspect(last_month)

    bool =
      Enum.any?(Conjugater.UserRecords.list_exercise_records(), fn record ->
        [month_of_record | _tail] = String.split(record.date)
        incoming_month == month_of_record
      end)

    exercise_records =
      Conjugater.UserRecords.list_exercise_records()
      |> Enum.filter(fn record ->
        if bool do
          [month_of_record | _tail] = String.split(record.date)
          incoming_month == month_of_record
        else
          [month_of_record | _tail] = String.split(record.date)
          last_month == month_of_record
        end
      end)
      |> Enum.map(fn record ->
        user_name = Conjugater.Accounts.get_user!(record.user_id).username

        %{
          exercise: record.exercise,
          id: record.id,
          type: record.type,
          weight: record.weight,
          reps: record.reps,
          sets: record.sets,
          notes: record.notes,
          user_id: record.user_id,
          date: record.date,
          user_name: user_name
        }
      end)

    IO.inspect(exercise_records)

    push(socket, "found_recent_records", %{exercise_records: exercise_records})

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
