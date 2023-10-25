defmodule Conjugater.UserRecords.ExerciseRecords do
  use Ecto.Schema
  import Ecto.Changeset

  schema "exercise_records" do
    field :reps, :integer
    field :sets, :integer
    field :type, :string
    field :weight, :integer
    field :user_id, :id
    field :exercise_id, :id

    timestamps(type: :utc_datetime)
  end

  @doc false
  def changeset(exercise_records, attrs) do
    exercise_records
    |> cast(attrs, [:type, :weight, :reps, :sets])
    |> validate_required([:type, :weight, :reps, :sets])
  end
end
