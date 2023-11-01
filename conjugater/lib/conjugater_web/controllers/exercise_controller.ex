defmodule ConjugaterWeb.ExerciseController do
  use ConjugaterWeb, :controller

  alias Conjugater.Exercises
  alias Conjugater.Exercises.Exercise

  action_fallback ConjugaterWeb.FallbackController

  def index(conn, _params) do
    exercises = Exercises.list_exercises()
    render(conn, :index, exercises: exercises)
  end

  def create(conn, %{"exercise" => exercise_params}) do
    user = conn.assigns[:current_user]
    IO.inspect(user)

    if user do
      with {:ok, %Exercise{} = exercise} <- Exercises.create_exercise(exercise_params) do
        conn
        |> put_status(:created)
        |> render(:show, exercise: exercise)
      end
    else
      {:error, :unauthorized}
    end
  end

  def show(conn, %{"id" => id}) do
    exercise = Exercises.get_exercise!(id)
    render(conn, :show, exercise: exercise)
  end

  def update(conn, %{"id" => id, "exercise" => exercise_params}) do
    exercise = Exercises.get_exercise!(id)

    with {:ok, %Exercise{} = exercise} <- Exercises.update_exercise(exercise, exercise_params) do
      render(conn, :show, exercise: exercise)
    end
  end

  def delete(conn, %{"id" => id}) do
    exercise = Exercises.get_exercise!(id)

    with {:ok, %Exercise{}} <- Exercises.delete_exercise(exercise) do
      send_resp(conn, :no_content, "")
    end
  end
end
