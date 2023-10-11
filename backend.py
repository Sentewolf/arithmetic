import random

from flask import Flask, jsonify, request
from flask_cors import CORS

from pyrithmetic import Task

app = Flask(__name__)
CORS(app)


@app.route("/complete-task", methods=["POST"])
def complete_task():
    time_limit = 10

    progress_data = request.json.get("progressData", {})
    elapsed_time = request.json.get("elapsedTime", {})
    elapsed_time = min(time_limit, elapsed_time)

    result = request.json.get("result", {})
    task_type = request.json.get("type", {})

    if progress_data is None:
        progress_data = {}

    if task_type not in progress_data.keys():
        progress_data[task_type] = {
            "average_time": 5,
            "average_result": 0.5,
            "count": 0,
        }

    stats = progress_data[task_type]
    stats["count"] += 1
    stats["average_time"] = 0.95 * stats["average_time"] + 0.05 * elapsed_time
    if elapsed_time < time_limit:
        stats["average_result"] = 0.95 * stats["average_result"] + 0.05 * result

    progress_data[task_type] = stats

    return jsonify({"progressData": progress_data})


@app.route("/get-new-task", methods=["POST"])
def get_new_task():
    selected_operations = request.json.get("selectedOperations", [])
    print(selected_operations)
    progress_data = request.json.get("progressData", {})

    # Calculate probabilities for each task

    probabilities = []
    activated = []
    previous_activated = True
    for task in addition_tasks:
        try:
            progress = progress_data[task.id]
        except KeyError:
            progress = {"average_time": 5, "average_result": 0.5, "count": 0}

        if previous_activated:
            activated.append(True)
            previous_activated = task.has_met_targets(
                progress["average_result"], progress["average_time"]
            )
        else:
            activated.append(False)
            probabilities.append(0)
            continue

        probability = task.probability_of_selection(
            progress["average_result"], progress["average_time"]
        )
        probabilities.append(probability)

    # Normalize probabilities to create weights
    total_probability = sum(probabilities)
    weights = [probability / total_probability for probability in probabilities]

    # Perform weighted random selection
    chosen_task = random.choices(addition_tasks, weights=weights)[0]
    print(activated)
    print(probabilities)
    print(progress_data)
    print(chosen_task.id)
    task, correct_answer = chosen_task.generate_assignment()

    return jsonify(
        {"task": task, "correct_answer": correct_answer, "task_type": chosen_task.id}
    )


if __name__ == "__main__":
    addition_tasks = [
        Task.AddNoCarryTask(difficulty_level=10, num_digits=1),
        Task.SumExactly10Task(difficulty_level=20),
        Task.AddSingleDigitTo10Task(difficulty_level=30),
        Task.AddTwoNumbersBelow10Task(difficulty_level=40),
        Task.AddNoCarryTask(difficulty_level=50, num_digits=1, second_digits=2),
        Task.AddSingleDigitToTwoDigitRoundTask(difficulty_level=60),
        Task.AddSingleDigitToTwoDigitTask(difficulty_level=70),
        Task.AddNoCarryTask(difficulty_level=80, num_digits=2),
        Task.AddDoubleDigitToHundredsTask(difficulty_level=90),
        Task.AddNoCarryTask(difficulty_level=100, num_digits=2, second_digits=3),
        Task.AddTwoDigitToTwoDigitTask(difficulty_level=110),
        Task.AddThreeDigitToThreeDigitTask(difficulty_level=120),
    ]

    addition_tasks = sorted(addition_tasks, key=lambda task: task.difficulty_level)

    app.run(debug=True)
