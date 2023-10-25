defmodule Conjugater.ExercisesFixtures do
  @moduledoc """
  This module defines test helpers for creating
  entities via the `Conjugater.Exercises` context.
  """

  @doc """
  Generate a exercise.
  """
  def exercise_fixture(attrs \\ %{}) do
    {:ok, exercise} =
      attrs
      |> Enum.into(%{
        name: "some name"
      })
      |> Conjugater.Exercises.create_exercise()

    exercise
  end
end
