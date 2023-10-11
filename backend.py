import random

from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)


@app.route("/complete-task", methods=["POST"])
def complete_task():
    return jsonify({})


@app.route("/get-new-task", methods=["POST"])
def get_new_task():
    selected_operations = request.json.get("selectedOperations", [])
    print(selected_operations)

    num1 = random.randint(1, 10)
    num2 = random.randint(1, 10)
    task = f"{num1} + {num2}"
    correct_answer = num1 + num2

    return jsonify({"task": task, "correct_answer": correct_answer})


if __name__ == "__main__":
    app.run(debug=True)
