defmodule ConjugaterWeb.ExerciseJSON do
  alias Conjugater.Exercises.Exercise

  @doc """
  Renders a list of exercises.
  """
  def index(%{exercises: exercises}) do
    %{data: for(exercise <- exercises, do: data(exercise))}
  end

  @doc """
  Renders a single exercise.
  """
  def show(%{exercise: exercise}) do
    %{data: data(exercise)}
  end

  defp data(%Exercise{} = exercise) do
    %{
      id: exercise.id,
      name: exercise.name
    }
  end
end
