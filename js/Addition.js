import * as Task from "./Task.js";

class AdditionTask extends Task.Task {
  constructor(id, { accuracyTarget = 0.8, solveTimeTarget = 3 }) {
    super(id, { accuracyTarget, solveTimeTarget });
    this.operator = "+";
  }

  generateAssignment() {
    throw new Error("Subclasses must implement generateAssignment()");
  }
}

export class SumExactly10Task extends AdditionTask {
  constructor() {
    super("5+5", {});
  }

  generateAssignment() {
    const num1 = Math.floor(Math.random() * 9) + 1;
    const num2 = 10 - num1;
    const task = `${num1} ${this.operator} ${num2}`;
    const correctAnswer = num1 + num2;
    return { task, correctAnswer };
  }
}

export class AddSingleDigitTo10Task extends AdditionTask {
  constructor() {
    super("10+5", {});
  }

  generateAssignment() {
    let num1 = 10;
    let num2 = Math.floor(Math.random() * 10);
    if (Math.random() < 0.5) {
      [num1, num2] = [num2, num1]; // Randomize the order
    }
    const task = `${num1} ${this.operator} ${num2}`;
    const correctAnswer = num1 + num2;
    return { task, correctAnswer };
  }
}
