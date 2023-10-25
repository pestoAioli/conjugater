defmodule ConjugaterWeb.ExerciseControllerTest do
  use ConjugaterWeb.ConnCase

  import Conjugater.ExercisesFixtures

  alias Conjugater.Exercises.Exercise

  @create_attrs %{
    name: "some name"
  }
  @update_attrs %{
    name: "some updated name"
  }
  @invalid_attrs %{name: nil}

  setup %{conn: conn} do
    {:ok, conn: put_req_header(conn, "accept", "application/json")}
  end

  describe "index" do
    test "lists all exercises", %{conn: conn} do
      conn = get(conn, ~p"/api/exercises")
      assert json_response(conn, 200)["data"] == []
    end
  end

  describe "create exercise" do
    test "renders exercise when data is valid", %{conn: conn} do
      conn = post(conn, ~p"/api/exercises", exercise: @create_attrs)
      assert %{"id" => id} = json_response(conn, 201)["data"]

      conn = get(conn, ~p"/api/exercises/#{id}")

      assert %{
               "id" => ^id,
               "name" => "some name"
             } = json_response(conn, 200)["data"]
    end

    test "renders errors when data is invalid", %{conn: conn} do
      conn = post(conn, ~p"/api/exercises", exercise: @invalid_attrs)
      assert json_response(conn, 422)["errors"] != %{}
    end
  end

  describe "update exercise" do
    setup [:create_exercise]

    test "renders exercise when data is valid", %{conn: conn, exercise: %Exercise{id: id} = exercise} do
      conn = put(conn, ~p"/api/exercises/#{exercise}", exercise: @update_attrs)
      assert %{"id" => ^id} = json_response(conn, 200)["data"]

      conn = get(conn, ~p"/api/exercises/#{id}")

      assert %{
               "id" => ^id,
               "name" => "some updated name"
             } = json_response(conn, 200)["data"]
    end

    test "renders errors when data is invalid", %{conn: conn, exercise: exercise} do
      conn = put(conn, ~p"/api/exercises/#{exercise}", exercise: @invalid_attrs)
      assert json_response(conn, 422)["errors"] != %{}
    end
  end

  describe "delete exercise" do
    setup [:create_exercise]

    test "deletes chosen exercise", %{conn: conn, exercise: exercise} do
      conn = delete(conn, ~p"/api/exercises/#{exercise}")
      assert response(conn, 204)

      assert_error_sent 404, fn ->
        get(conn, ~p"/api/exercises/#{exercise}")
      end
    end
  end

  defp create_exercise(_) do
    exercise = exercise_fixture()
    %{exercise: exercise}
  end
end
