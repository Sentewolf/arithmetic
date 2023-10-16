import * as Task from "./Task.js";
import * as utils from "./utils.js";

class MultiplicationTask extends Task.Task {
  constructor(id, { accuracyTarget = 0.8, solveTimeTarget = 3 }) {
    super(id, { accuracyTarget, solveTimeTarget });
    this.operator = "x";
  }

  generateAssignment() {
    throw new Error("Subclasses must implement generateAssignment()");
  }
}

export class MultiplicationTableN extends MultiplicationTask {
  constructor(table) {
    let id = `${table}*x`;
    super(id, {});
    this.table = table;
  }

  generateAssignment() {
    let num1 = this.table;
    let num2 = utils.randint(1, 10);
    const task = `${num1} ${this.operator} ${num2}`;
    const correctAnswer = num1 * num2;
    return { task, correctAnswer };
  }
}

export class MultiplyNbyM extends MultiplicationTask {
  constructor(first_digits, second_digits) {
    if (second_digits === null) {
      second_digits = first_digits;
    }
    if (second_digits <= first_digits) {
      [first_digits, second_digits] = [second_digits, first_digits];
    }
    let id = `${"5".repeat(first_digits)}x${"2".repeat(second_digits)}`;
    super(id, {});
    this.first_digits = first_digits;
    this.second_digits = second_digits;
  }

  generateAssignment() {
    let num1 = utils.randint(
      Math.pow(10, this.first_digits - 1),
      Math.pow(10, this.first_digits - 1) - 1,
    );
    let num2 = utils.randint(
      Math.pow(10, this.second_digits - 1),
      Math.pow(10, this.second_digits - 1) - 1,
    );

    if (Math.random() < 0.5) {
      [num1, num2] = [num2, num1]; // Randomize the order
    }

    const task = `${num1} ${this.operator} ${num2}`;
    const correctAnswer = num1 * num2;
    return { task, correctAnswer };
  }
}
