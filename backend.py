import random

from flask import Flask, jsonify, request
from flask_cors import CORS

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
            "average_time": 2,
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

    num1 = random.randint(1, 9)
    num2 = random.randint(1, 9)
    task = f"{num1} + {num2}"
    correct_answer = num1 + num2

    return jsonify({"task": task, "correct_answer": correct_answer, "task_type": "8+6"})


if __name__ == "__main__":
    app.run(debug=True)
