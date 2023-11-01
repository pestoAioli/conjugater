defmodule ConjugaterWeb.ExerciseRecordsJSON do
  alias Conjugater.UserRecords.ExerciseRecords

  @doc """
  Renders a list of exercise_records.
  """
  def index(%{exercise_records: exercise_records}) do
    %{data: for(exercise_records <- exercise_records, do: data(exercise_records))}
  end

  @doc """
  Renders a single exercise_records.
  """
  def show(%{exercise_records: exercise_records}) do
    %{data: data(exercise_records)}
  end

  defp data(%ExerciseRecords{} = exercise_records) do
    %{
      id: exercise_records.id,
      type: exercise_records.type,
      weight: exercise_records.weight,
      reps: exercise_records.reps,
      sets: exercise_records.sets,
      notes: exercise_records.notes
    }
  end
end
