defmodule Conjugater.Repo do
  use Ecto.Repo,
    otp_app: :conjugater,
    adapter: Ecto.Adapters.Postgres
end
