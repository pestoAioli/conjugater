defmodule SolidPhoenix.Repo do
  use Ecto.Repo,
    otp_app: :solid_phoenix,
    adapter: Ecto.Adapters.Postgres
end
