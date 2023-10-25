defmodule ConjugaterWeb.ExerciseRecordsController do
  use ConjugaterWeb, :controller

  alias Conjugater.UserRecords
  alias Conjugater.UserRecords.ExerciseRecords

  action_fallback ConjugaterWeb.FallbackController

  def index(conn, _params) do
    exercise_records = UserRecords.list_exercise_records()
    render(conn, :index, exercise_records: exercise_records)
  end

  def create(conn, %{"exercise_records" => exercise_records_params}) do
    with {:ok, %ExerciseRecords{} = exercise_records} <-
           UserRecords.create_exercise_records(exercise_records_params) do
      conn
      |> put_status(:created)
      |> render(:show, exercise_records: exercise_records)
    end
  end

  def show(conn, %{"id" => id}) do
    exercise_records = UserRecords.get_exercise_records!(id)
    render(conn, :show, exercise_records: exercise_records)
  end

  def update(conn, %{"id" => id, "exercise_records" => exercise_records_params}) do
    exercise_records = UserRecords.get_exercise_records!(id)

    with {:ok, %ExerciseRecords{} = exercise_records} <-
           UserRecords.update_exercise_records(exercise_records, exercise_records_params) do
      render(conn, :show, exercise_records: exercise_records)
    end
  end

  def delete(conn, %{"id" => id}) do
    exercise_records = UserRecords.get_exercise_records!(id)

    with {:ok, %ExerciseRecords{}} <- UserRecords.delete_exercise_records(exercise_records) do
      send_resp(conn, :no_content, "")
    end
  end
end
