defmodule SolidPhoenixWeb.Router do
  use SolidPhoenixWeb, :router

  import SolidPhoenixWeb.UserAuth

  pipeline :browser do
    plug(:accepts, ["json"])
  end

  pipeline :api do
    plug(:accepts, ["json"])
    plug(:fetch_current_user)
  end

  scope "/", SolidPhoenixWeb do
    pipe_through(:browser)

    post("/user/register", UserAuthController, :register)
    post("/user/log_in", UserAuthController, :login)
  end

  # Other scopes may use custom stacks.
  # scope "/api", SolidPhoenixWeb do
  #   pipe_through :api
  # end

  # Enable Swoosh mailbox preview in development
  if Application.compile_env(:solid_phoenix, :dev_routes) do
    scope "/dev" do
      pipe_through(:browser)

      forward("/mailbox", Plug.Swoosh.MailboxPreview)
    end
  end

  ## Authentication routes

  scope "/api", SolidPhoenixWeb do
    pipe_through([:api])

    get("/user", UserAuthController, :index)
    patch("/user", UserAuthController, :update)
    post("/user/log_out", UserAuthController, :logout)
    post("/user/confirm_email", UserAuthController, :confirm_email)
    post("/user/reset_password", UserAuthController, :reset_password)
    # TODO: implement forgot_password functionality
    # post "/user/forgot_password", UserAuthController, :forgot_password
  end
end
