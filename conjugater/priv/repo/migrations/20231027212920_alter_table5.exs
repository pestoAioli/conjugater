defmodule Conjugater.Repo.Migrations.AlterTable5 do
  use Ecto.Migration

  def change do
    alter table(:exercise_records) do
      add :exercise, :string
    end
  end
end
