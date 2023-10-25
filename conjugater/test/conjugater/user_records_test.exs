defmodule Conjugater.UserRecordsTest do
  use Conjugater.DataCase

  alias Conjugater.UserRecords

  describe "exercise_records" do
    alias Conjugater.UserRecords.ExerciseRecords

    import Conjugater.UserRecordsFixtures

    @invalid_attrs %{reps: nil, sets: nil, type: nil, weight: nil}

    test "list_exercise_records/0 returns all exercise_records" do
      exercise_records = exercise_records_fixture()
      assert UserRecords.list_exercise_records() == [exercise_records]
    end

    test "get_exercise_records!/1 returns the exercise_records with given id" do
      exercise_records = exercise_records_fixture()
      assert UserRecords.get_exercise_records!(exercise_records.id) == exercise_records
    end

    test "create_exercise_records/1 with valid data creates a exercise_records" do
      valid_attrs = %{reps: 42, sets: 42, type: "some type", weight: 42}

      assert {:ok, %ExerciseRecords{} = exercise_records} = UserRecords.create_exercise_records(valid_attrs)
      assert exercise_records.reps == 42
      assert exercise_records.sets == 42
      assert exercise_records.type == "some type"
      assert exercise_records.weight == 42
    end

    test "create_exercise_records/1 with invalid data returns error changeset" do
      assert {:error, %Ecto.Changeset{}} = UserRecords.create_exercise_records(@invalid_attrs)
    end

    test "update_exercise_records/2 with valid data updates the exercise_records" do
      exercise_records = exercise_records_fixture()
      update_attrs = %{reps: 43, sets: 43, type: "some updated type", weight: 43}

      assert {:ok, %ExerciseRecords{} = exercise_records} = UserRecords.update_exercise_records(exercise_records, update_attrs)
      assert exercise_records.reps == 43
      assert exercise_records.sets == 43
      assert exercise_records.type == "some updated type"
      assert exercise_records.weight == 43
    end

    test "update_exercise_records/2 with invalid data returns error changeset" do
      exercise_records = exercise_records_fixture()
      assert {:error, %Ecto.Changeset{}} = UserRecords.update_exercise_records(exercise_records, @invalid_attrs)
      assert exercise_records == UserRecords.get_exercise_records!(exercise_records.id)
    end

    test "delete_exercise_records/1 deletes the exercise_records" do
      exercise_records = exercise_records_fixture()
      assert {:ok, %ExerciseRecords{}} = UserRecords.delete_exercise_records(exercise_records)
      assert_raise Ecto.NoResultsError, fn -> UserRecords.get_exercise_records!(exercise_records.id) end
    end

    test "change_exercise_records/1 returns a exercise_records changeset" do
      exercise_records = exercise_records_fixture()
      assert %Ecto.Changeset{} = UserRecords.change_exercise_records(exercise_records)
    end
  end
end
