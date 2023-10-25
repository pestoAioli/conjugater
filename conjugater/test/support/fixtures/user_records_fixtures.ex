defmodule Conjugater.UserRecordsFixtures do
  @moduledoc """
  This module defines test helpers for creating
  entities via the `Conjugater.UserRecords` context.
  """

  @doc """
  Generate a exercise_records.
  """
  def exercise_records_fixture(attrs \\ %{}) do
    {:ok, exercise_records} =
      attrs
      |> Enum.into(%{
        reps: 42,
        sets: 42,
        type: "some type",
        weight: 42
      })
      |> Conjugater.UserRecords.create_exercise_records()

    exercise_records
  end
end
