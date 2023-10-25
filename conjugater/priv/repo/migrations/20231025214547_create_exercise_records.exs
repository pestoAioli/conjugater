defmodule Conjugater.Repo.Migrations.CreateExerciseRecords do
  use Ecto.Migration

  def change do
    create table(:exercise_records) do
      add :type, :string
      add :weight, :integer
      add :reps, :integer
      add :sets, :integer
      add :user_id, references(:users, on_delete: :nothing)
      add :exercise_id, references(:exercises, on_delete: :nothing)

      timestamps(type: :utc_datetime)
    end

    create index(:exercise_records, [:user_id])
    create index(:exercise_records, [:exercise_id])
  end
end
