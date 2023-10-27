defmodule Conjugater.Repo.Migrations.AlterTable2 do
  use Ecto.Migration

  def change do
    alter table(:exercise_records) do
      add :notes, :text
    end
  end
end
