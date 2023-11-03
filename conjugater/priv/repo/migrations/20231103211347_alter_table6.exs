defmodule Conjugater.Repo.Migrations.AlterTable6 do
  use Ecto.Migration

  def change do
    alter table(:exercise_records) do
      add :date, :string
    end
  end
end
