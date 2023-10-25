defmodule ConjugaterWeb.ExerciseRecordsControllerTest do
  use ConjugaterWeb.ConnCase

  import Conjugater.UserRecordsFixtures

  alias Conjugater.UserRecords.ExerciseRecords

  @create_attrs %{
    reps: 42,
    sets: 42,
    type: "some type",
    weight: 42
  }
  @update_attrs %{
    reps: 43,
    sets: 43,
    type: "some updated type",
    weight: 43
  }
  @invalid_attrs %{reps: nil, sets: nil, type: nil, weight: nil}

  setup %{conn: conn} do
    {:ok, conn: put_req_header(conn, "accept", "application/json")}
  end

  describe "index" do
    test "lists all exercise_records", %{conn: conn} do
      conn = get(conn, ~p"/api/exercise_records")
      assert json_response(conn, 200)["data"] == []
    end
  end

  describe "create exercise_records" do
    test "renders exercise_records when data is valid", %{conn: conn} do
      conn = post(conn, ~p"/api/exercise_records", exercise_records: @create_attrs)
      assert %{"id" => id} = json_response(conn, 201)["data"]

      conn = get(conn, ~p"/api/exercise_records/#{id}")

      assert %{
               "id" => ^id,
               "reps" => 42,
               "sets" => 42,
               "type" => "some type",
               "weight" => 42
             } = json_response(conn, 200)["data"]
    end

    test "renders errors when data is invalid", %{conn: conn} do
      conn = post(conn, ~p"/api/exercise_records", exercise_records: @invalid_attrs)
      assert json_response(conn, 422)["errors"] != %{}
    end
  end

  describe "update exercise_records" do
    setup [:create_exercise_records]

    test "renders exercise_records when data is valid", %{conn: conn, exercise_records: %ExerciseRecords{id: id} = exercise_records} do
      conn = put(conn, ~p"/api/exercise_records/#{exercise_records}", exercise_records: @update_attrs)
      assert %{"id" => ^id} = json_response(conn, 200)["data"]

      conn = get(conn, ~p"/api/exercise_records/#{id}")

      assert %{
               "id" => ^id,
               "reps" => 43,
               "sets" => 43,
               "type" => "some updated type",
               "weight" => 43
             } = json_response(conn, 200)["data"]
    end

    test "renders errors when data is invalid", %{conn: conn, exercise_records: exercise_records} do
      conn = put(conn, ~p"/api/exercise_records/#{exercise_records}", exercise_records: @invalid_attrs)
      assert json_response(conn, 422)["errors"] != %{}
    end
  end

  describe "delete exercise_records" do
    setup [:create_exercise_records]

    test "deletes chosen exercise_records", %{conn: conn, exercise_records: exercise_records} do
      conn = delete(conn, ~p"/api/exercise_records/#{exercise_records}")
      assert response(conn, 204)

      assert_error_sent 404, fn ->
        get(conn, ~p"/api/exercise_records/#{exercise_records}")
      end
    end
  end

  defp create_exercise_records(_) do
    exercise_records = exercise_records_fixture()
    %{exercise_records: exercise_records}
  end
end
