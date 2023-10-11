import random

from flask import Flask, jsonify, request
from flask_cors import CORS

from pyrithmetic import Task

app = Flask(__name__)
CORS(app)


@app.route("/complete-task", methods=["POST"])
def complete_task():
    progress_data = request.json.get("progressData", {})
    elapsed_time = request.json.get("elapsedTime", {})
    elapsed_time = min(10, elapsed_time)

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
    stats["average_result"] = 0.95 * stats["average_result"] + 0.05 * result
    stats["average_time"] = 0.95 * stats["average_time"] + 0.05 * elapsed_time
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
        Task.SumLessThan10Task(),
        Task.SumExactly10Task(),
        Task.AddSingleDigitTo10Task(),
        Task.AddTwoNumbersBelow10Task(),
        Task.AddSingleDigitToTwoDigitRoundTask(),
        Task.AddSingleDigitToTwoDigitTask(),
    ]

    addition_tasks = sorted(addition_tasks, key=lambda task: task.difficulty_level)

    app.run(debug=True)
