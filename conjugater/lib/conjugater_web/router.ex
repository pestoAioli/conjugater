defmodule ConjugaterWeb.Router do
  use ConjugaterWeb, :router

  import ConjugaterWeb.UserAuth

  pipeline :browser do
    plug(:accepts, ["json"])
  end

  pipeline :api do
    plug(:accepts, ["json"])
    plug(:fetch_current_user)
  end

  scope "/", ConjugaterWeb do
    pipe_through(:browser)

    post("/user/register", UserAuthController, :register)
    post("/user/log_in", UserAuthController, :login)
  end

  # Other scopes may use custom stacks.
  # scope "/api", ConjugaterWeb do
  #   pipe_through :api
  # end

  # Enable Swoosh mailbox preview in development
  if Application.compile_env(:conjugater, :dev_routes) do
    scope "/dev" do
      pipe_through(:browser)

      forward("/mailbox", Plug.Swoosh.MailboxPreview)
    end
  end

  ## Authentication routes

  scope "/api", ConjugaterWeb do
    pipe_through([:api])

    get("/user", UserAuthController, :index)
    patch("/user", UserAuthController, :update)
    post("/user/log_out", UserAuthController, :logout)
    post("/user/confirm_email", UserAuthController, :confirm_email)
    post("/user/reset_password", UserAuthController, :reset_password)
    # TODO: implement forgot_password functionality
    # post "/user/forgot_password", UserAuthController, :forgot_password
    get "/exercise", ExerciseController, :index
    post "/exercise", ExerciseController, :create
  end
end
