import * as Task from "./Task.js";
import * as utils from "./utils.js";

class DivisionTask extends Task.Task {
  constructor(id, { accuracyTarget = 0.8, solveTimeTarget = 3 }) {
    super(id, { accuracyTarget, solveTimeTarget });
    this.operator = "/";
  }

  generateAssignment() {
    throw new Error("Subclasses must implement generateAssignment()");
  }
}

export class DivisionTableN extends DivisionTask {
  constructor(table) {
    let id = `${table}/x`;
    super(id, {});
    this.table = table;
  }

  generateAssignment() {
    const num2 = this.table;
    const correctAnswer = utils.randint(1, 10);
    const num1 = correctAnswer * num2;
    const task = `${num1} ${this.operator} ${num2}`;
    return { task, correctAnswer };
  }
}

export class DivideNbyM extends DivisionTask {
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
    const num2 = utils.randint(
      Math.pow(10, this.first_digits - 1),
      Math.pow(10, this.first_digits - 1) - 1,
    );
    const correctAnswer = utils.randint(
      Math.pow(10, this.second_digits - 1),
      Math.pow(10, this.second_digits - 1) - 1,
    );
    const num1 = correctAnswer * num2;
    const task = `${num1} ${this.operator} ${num2}`;
    return { task, correctAnswer };
  }
}
