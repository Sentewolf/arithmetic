import random

from flask import Flask, jsonify, request
from flask_cors import CORS

from pyrithmetic import Addition, Subtraction

app = Flask(__name__)
CORS(app)

default_progress = {"average_time": 3, "average_result": 0.5, "count": 0}


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
        progress_data[task_type] = default_progress

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
    picked_operation = random.choice(selected_operations)
    if picked_operation == "addition":
        tasks = addition_tasks
    elif picked_operation == "subtraction":
        tasks = subtraction_tasks
    else:
        tasks = addition_tasks

    progress_data = request.json.get("progressData", {})

    # Calculate probabilities for each task

    probabilities = []
    activated = []
    previous_activated = True
    for task in tasks:
        if progress_data is None:
            progress_data = {}

        try:
            progress = progress_data[task.id]
        except KeyError:
            progress = default_progress

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
    chosen_task = random.choices(tasks, weights=weights)[0]
    task, correct_answer = chosen_task.generate_assignment()

    return jsonify(
        {"task": task, "correct_answer": correct_answer, "task_type": chosen_task.id}
    )


if __name__ == "__main__":
    addition_tasks = [
        Addition.AddNoCarryTask(difficulty_level=10, num_digits=1),
        Addition.SumExactly10Task(difficulty_level=20),
        Addition.AddSingleDigitTo10Task(difficulty_level=30),
        Addition.AddTwoNumbersBelow10Task(difficulty_level=40),
        Addition.AddNoCarryTask(difficulty_level=50, num_digits=1, second_digits=2),
        Addition.AddSingleDigitToTwoDigitRoundTask(difficulty_level=60),
        Addition.AddSingleDigitToTwoDigitTask(difficulty_level=70),
        Addition.AddNoCarryTask(difficulty_level=80, num_digits=2),
        Addition.AddTwoDigitToTwoDigitTask(difficulty_level=90),
        Addition.AddDoubleDigitToHundredsTask(difficulty_level=100),
        Addition.AddNoCarryTask(difficulty_level=110, num_digits=2, second_digits=3),
        Addition.AddTwoDigitToThreeDigitTask(difficulty_level=120),
        Addition.AddTwoDigitToThreeDigitTaskWithCarry(difficulty_level=130),
        Addition.AddThreeDigitToThreeDigitTask(difficulty_level=140),
    ]

    subtraction_tasks = [
        Subtraction.SubtractNoCarryTask(difficulty_level=10, num_digits=1),
        Subtraction.SubtractFrom10(difficulty_level=20),
        Subtraction.SubtractSingleDigitFromTwoDigitRoundTask(difficulty_level=30),
        Subtraction.SubtractNoCarryTask(
            difficulty_level=40, num_digits=1, second_digits=2
        ),
        Subtraction.SubtractSingleDigitFromTweenTask(difficulty_level=50),
        Subtraction.SubtractSingleDigitFromTwoDigitTask(difficulty_level=60),
        Subtraction.SubtractNoCarryTask(difficulty_level=70, num_digits=2),
        Subtraction.SubtractTwoDigitFromTwoDigitTask(difficulty_level=80),
        Subtraction.SubtractNoCarryTask(
            difficulty_level=90, num_digits=2, second_digits=3
        ),
        Subtraction.SubtractTwoDigitFromThreeDigitTask(difficulty_level=100),
        Subtraction.SubtractTwoDigitFromThreeDigitTaskWithCarry(difficulty_level=110),
        Subtraction.SubtractThreeDigitFromThreeDigitTask(difficulty_level=120),
    ]

    addition_tasks = sorted(addition_tasks, key=lambda task: task.difficulty_level)
    subtraction_tasks = sorted(
        subtraction_tasks, key=lambda task: task.difficulty_level
    )

    app.run(debug=True)
