import * as Task from "./Task.js";
import * as utils from "./utils.js";

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
    let num1 = utils.randint(1, 9);
    let num2 = 10 - num1;
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
    let num2 = utils.randint(1, 9);
    if (Math.random() < 0.5) {
      [num1, num2] = [num2, num1]; // Randomize the order
    }
    const task = `${num1} ${this.operator} ${num2}`;
    const correctAnswer = num1 + num2;
    return { task, correctAnswer };
  }
}

export class AddTwoNumbersBelow10Task extends AdditionTask {
  constructor() {
    super("7+5", {});
  }

  generateAssignment() {
    let num1 = utils.randint(1, 9);
    let num2 = utils.randint(1, 9);
    const task = `${num1} ${this.operator} ${num2}`;
    const correctAnswer = num1 + num2;
    return { task, correctAnswer };
  }
}

export class AddSingleDigitToTwoDigitRoundTask extends AdditionTask {
  constructor() {
    super("17+3", {});
  }

  generateAssignment() {
    let num1 = utils.randint(1, 9);
    let num2 = utils.randint(2, 9) * 10;
    if (Math.random() < 0.5) {
      [num1, num2] = [num2, num1]; // Randomize the order
    }
    const task = `${num1} ${this.operator} ${num2}`;
    const correctAnswer = num1 + num2;
    return { task, correctAnswer };
  }
}

export class AddTens extends AdditionTask {
  constructor() {
    super("20+30", {});
  }

  generateAssignment() {
    let num1 = utils.randint(1, 9) * 10;
    let num2 = utils.randint(1, 9) * 10;
    if (Math.random() < 0.5) {
      [num1, num2] = [num2, num1]; // Randomize the order
    }
    const task = `${num1} ${this.operator} ${num2}`;
    const correctAnswer = num1 + num2;
    return { task, correctAnswer };
  }
}

export class AddSingleDigitToTwoDigitTask extends AdditionTask {
  constructor() {
    super("18+5", {});
  }

  generateAssignment() {
    let num1 = utils.randint(1, 9);
    let num2 = utils.randint(10, 99 - num1);
    if (Math.random() < 0.5) {
      [num1, num2] = [num2, num1]; // Randomize the order
    }
    const task = `${num1} ${this.operator} ${num2}`;
    const correctAnswer = num1 + num2;
    return { task, correctAnswer };
  }
}

export class AddDoubleDigitToHundredsTask extends AdditionTask {
  constructor() {
    super("300+34", {});
  }

  generateAssignment() {
    let num1 = utils.randint(10, 99);
    let num2 = utils.randint(1, 9) * 100;
    if (Math.random() < 0.5) {
      [num1, num2] = [num2, num1]; // Randomize the order
    }
    const task = `${num1} ${this.operator} ${num2}`;
    const correctAnswer = num1 + num2;
    return { task, correctAnswer };
  }
}

export class AddTwoDigitToTwoDigitTask extends AdditionTask {
  constructor() {
    super("38+54", {});
  }

  generateAssignment() {
    let num1 = utils.randint(11, 88);
    let num2 = utils.randint(11, 99 - num1);
    if (Math.random() < 0.5) {
      [num1, num2] = [num2, num1]; // Randomize the order
    }
    const task = `${num1} ${this.operator} ${num2}`;
    const correctAnswer = num1 + num2;
    return { task, correctAnswer };
  }
}

export class AddTwoDigitToThreeDigitTask extends AdditionTask {
  constructor() {
    super("38+254", {});
  }

  generateAssignment() {
    let num1 = utils.randint(10, 98);
    let num2 = utils.randint(1, 99 - num1);
    num2 += utils.randint(1, 9) * 100;
    if (Math.random() < 0.5) {
      [num1, num2] = [num2, num1]; // Randomize the order
    }
    const task = `${num1} ${this.operator} ${num2}`;
    const correctAnswer = num1 + num2;
    return { task, correctAnswer };
  }
}

export class AddTwoDigitToThreeDigitTaskWithCarry extends AdditionTask {
  constructor() {
    super("68+254", {});
  }

  generateAssignment() {
    let num1 = utils.randint(10, 99);
    let num2 = utils.randint(101, 999 - num1);
    if (Math.random() < 0.5) {
      [num1, num2] = [num2, num1]; // Randomize the order
    }
    const task = `${num1} ${this.operator} ${num2}`;
    const correctAnswer = num1 + num2;
    return { task, correctAnswer };
  }
}

export class AddThreeDigitToThreeDigitTask extends AdditionTask {
  constructor() {
    super("168+254", {});
  }

  generateAssignment() {
    let num1 = utils.randint(101, 898);
    let num2 = utils.randint(101, 999 - num1);
    if (Math.random() < 0.5) {
      [num1, num2] = [num2, num1]; // Randomize the order
    }
    const task = `${num1} ${this.operator} ${num2}`;
    const correctAnswer = num1 + num2;
    return { task, correctAnswer };
  }
}

export class AddNoCarryTask extends AdditionTask {
  constructor(num_digits = 1, second_digits = null) {
    if (second_digits === null) {
      second_digits = num_digits;
    }
    if (second_digits < num_digits) {
      [num_digits, second_digits] = [second_digits, num_digits];
    }
    let id = `${"5".repeat(num_digits)}+${"2".repeat(second_digits)}`;
    super(id, {});
    this.first_digits = num_digits;
    this.second_digits = second_digits;
  }

  generateNumberPair(include_zeros = false) {
    let num1 = 0;
    let num2 = 0;
    if (include_zeros) {
      num1 = utils.randint(0, 9);
      num2 = utils.randint(0, 10 - num1 - 1);
    } else {
      num1 = utils.randint(1, 8);
      num2 = utils.randint(1, 10 - num1 - 1);
    }
    if (Math.random() < 0.5) {
      [num1, num2] = [num2, num1]; // Randomize the order
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

    if (Math.random() < 0.5) {
      [num1, num2] = [num2, num1]; // Randomize the order
    }
    let task = `${num1} ${this.operator} ${num2}`;
    let correctAnswer = num1 + num2;

    return { task, correctAnswer };
  }
}
