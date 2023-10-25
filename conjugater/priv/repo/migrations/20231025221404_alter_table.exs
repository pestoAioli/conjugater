defmodule Conjugater.Repo.Migrations.AlterTable do
  use Ecto.Migration

  def change do
    alter table(:exercises) do
      add :user_id, references(:users, on_delete: :nothing)
    end
  end
end
