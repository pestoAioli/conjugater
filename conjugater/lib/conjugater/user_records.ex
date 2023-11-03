defmodule Conjugater.UserRecords do
  @moduledoc """
  The UserRecords context.
  """

  import Ecto.Query, warn: false
  alias Conjugater.Repo

  alias Conjugater.UserRecords.ExerciseRecords

  @doc """
  Returns the list of exercise_records.

  ## Examples

      iex> list_exercise_records()
      [%ExerciseRecords{}, ...]

  """
  def list_exercise_records do
    Repo.all(ExerciseRecords)
  end

  @doc """
  Gets a single exercise_records.

  Raises `Ecto.NoResultsError` if the Exercise records does not exist.

  ## Examples

      iex> get_exercise_records!(123)
      %ExerciseRecords{}

      iex> get_exercise_records!(456)
      ** (Ecto.NoResultsError)

  """
  def get_exercise_records!(id), do: Repo.get!(ExerciseRecords, id)

  @doc """
  Creates a exercise_records.

  ## Examples

      iex> create_exercise_records(%{field: value})
      {:ok, %ExerciseRecords{}}

      iex> create_exercise_records(%{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def create_exercise_records(user_id, attrs \\ %{}) do
    %ExerciseRecords{user_id: user_id}
    |> ExerciseRecords.changeset(attrs)
    |> Repo.insert()
  end

  @doc """
  Updates a exercise_records.

  ## Examples

      iex> update_exercise_records(exercise_records, %{field: new_value})
      {:ok, %ExerciseRecords{}}

      iex> update_exercise_records(exercise_records, %{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def update_exercise_records(%ExerciseRecords{} = exercise_records, attrs) do
    exercise_records
    |> ExerciseRecords.changeset(attrs)
    |> Repo.update()
  end

  @doc """
  Deletes a exercise_records.

  ## Examples

      iex> delete_exercise_records(exercise_records)
      {:ok, %ExerciseRecords{}}

      iex> delete_exercise_records(exercise_records)
      {:error, %Ecto.Changeset{}}

  """
  def delete_exercise_records(%ExerciseRecords{} = exercise_records) do
    Repo.delete(exercise_records)
  end

  @doc """
  Returns an `%Ecto.Changeset{}` for tracking exercise_records changes.

  ## Examples

      iex> change_exercise_records(exercise_records)
      %Ecto.Changeset{data: %ExerciseRecords{}}

  """
  def change_exercise_records(%ExerciseRecords{} = exercise_records, attrs \\ %{}) do
    ExerciseRecords.changeset(exercise_records, attrs)
  end
end
