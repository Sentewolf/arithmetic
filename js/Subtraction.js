import * as Task from "./Task.js";
import * as utils from "./utils.js";

class SubtractionTask extends Task.Task {
  constructor(id, { accuracyTarget = 0.8, solveTimeTarget = 3 }) {
    super(id, { accuracyTarget, solveTimeTarget });
    this.operator = "-";
  }

  generateAssignment() {
    throw new Error("Subclasses must implement generateAssignment()");
  }
}

export class SubtractFrom10 extends SubtractionTask {
  constructor() {
    super("10-5", {});
  }

  generateAssignment() {
    const num1 = 10;
    const num2 = utils.randint(1, 9);
    const task = `${num1} ${this.operator} ${num2}`;
    const correctAnswer = num1 - num2;
    return { task, correctAnswer };
  }
}

export class SubtractSingleDigitFromTwoDigitRoundTask extends SubtractionTask {
  constructor() {
    super("37-7", {});
  }

  generateAssignment() {
    const num2 = utils.randint(1, 9);
    const num1 = num2 + utils.randint(2, 9) * 10;
    const task = `${num1} ${this.operator} ${num2}`;
    const correctAnswer = num1 - num2;
    return { task, correctAnswer };
  }
}

export class SubtractSingleDigitFromTweenTask extends SubtractionTask {
  constructor() {
    super("15-8", {});
  }

  generateAssignment() {
    const num2 = utils.randint(1, 9);
    const num1 = utils.randint(0, num2 - 1) + 10;
    const task = `${num1} ${this.operator} ${num2}`;
    const correctAnswer = num1 - num2;
    return { task, correctAnswer };
  }
}

export class SubtractSingleDigitFromTwoDigitTask extends SubtractionTask {
  constructor() {
    super("25-8", {});
  }

  generateAssignment() {
    const num2 = utils.randint(1, 9);
    const num1 = utils.randint(1, num2 - 1);
    num1 += utils.randint(1, 9) * 10;
    const task = `${num1} ${this.operator} ${num2}`;
    const correctAnswer = num1 - num2;
    return { task, correctAnswer };
  }
}

export class SubtractNoCarryTask extends SubtractionTask {
  constructor(num_digits = 1, second_digits = null) {
    if (second_digits === null) {
      second_digits = num_digits;
    }
    if (second_digits <= num_digits) {
      [num_digits, second_digits] = [second_digits, num_digits];
    }
    let id = `${"5".repeat(second_digits)}-${"2".repeat(num_digits)}`;
    super(id, {});
    this.first_digits = num_digits;
    this.second_digits = second_digits;
  }

  generateNumberPair(include_zeros = false) {
    let num1 = 0;
    let num2 = 0;
    if (include_zeros) {
      num1 = utils.randint(0, 9);
      num2 = utils.randint(0, num1);
    } else {
      num1 = utils.randint(1, 9);
      num2 = utils.randint(1, num1);
    }
    return [num1, num2];
  }

  generateAssignment() {
    let num1 = 0;
    let num2 = 0;

    for (let i = 0; i < this.first_digits; i++) {
      let includeZeros = !(i === 0 || i === this.first_digits - 1);
      let [a, b] = this.generateNumberPair(includeZeros);
      num1 += a * Math.pow(10, i);
      num2 += b * Math.pow(10, i);
    }

    for (let i = this.firstDigits; i < this.secondDigits; i++) {
      num1 += utils.randint(1, 9) * Math.pow(10, i);
    }

    let task = `${num1} ${this.operator} ${num2}`;
    let correctAnswer = num1 - num2;

    return { task, correctAnswer };
  }
}

export class SubtractTwoDigitFromTwoDigitTask extends SubtractionTask {
  constructor() {
    super("54-38", {});
  }

  generateAssignment() {
    const num1 = utils.randint(11, 99);
    const num2 = utils.randint(11, num1);
    const task = `${num1} ${this.operator} ${num2}`;
    const correctAnswer = num1 - num2;
    return { task, correctAnswer };
  }
}

export class SubtractTwoDigitFromThreeDigitTask extends SubtractionTask {
  constructor() {
    super("254-38", {});
  }

  generateAssignment() {
    const num1 = utils.randint(11, 99);
    const num2 = utils.randint(11, num1);
    num1 += utils.randint(1, 9) * 100;
    const task = `${num1} ${this.operator} ${num2}`;
    const correctAnswer = num1 - num2;
    return { task, correctAnswer };
  }
}

export class SubtractTwoDigitFromThreeDigitTaskWithCarry extends SubtractionTask {
  constructor() {
    super("254-68", {});
  }

  generateAssignment() {
    const num1 = utils.randint(101, 99);
    const num2 = utils.randint(1, 99);
    const task = `${num1} ${this.operator} ${num2}`;
    const correctAnswer = num1 - num2;
    return { task, correctAnswer };
  }
}

export class SubtractThreeDigitFromThreeDigitTask extends SubtractionTask {
  constructor() {
    super("254-168", {});
  }

  generateAssignment() {
    const num1 = utils.randint(101, 99);
    const num2 = utils.randint(101, num1);
    const task = `${num1} ${this.operator} ${num2}`;
    const correctAnswer = num1 - num2;
    return { task, correctAnswer };
  }
}
